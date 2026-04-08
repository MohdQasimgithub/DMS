import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  Box, Card, CardContent, TextField, Button, Typography,
  InputAdornment, IconButton, CircularProgress, Alert, Divider,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { authApi } from '../api/authApi';
import { useAuthStore } from '../store/authStore';

const schema = yup.object({
  username: yup.string().required('Username is required'),
  password: yup.string().required('Password is required'),
});

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    setLoading(true);
    setError('');
    try {
      const res = await authApi.login(data);
      setAuth(res.data.data);
      navigate('/dashboard');
    } catch (err) {
      const msg = err?.response?.data?.message || 'Login failed. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh"
      sx={{ bgcolor: 'grey.100' }}>
      <Card sx={{ width: 400, boxShadow: 4 }}>
        <CardContent sx={{ p: 4 }}>
          <Box textAlign="center" mb={3}>
            <Typography variant="h4" fontWeight="bold" color="primary">DMS</Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Hyundai AutoEver Dealer Management
            </Typography>
          </Box>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <form onSubmit={handleSubmit(onSubmit)}>
            <TextField
              {...register('username')}
              label="Username"
              fullWidth
              margin="normal"
              error={!!errors.username}
              helperText={errors.username?.message}
              autoFocus
            />
            <TextField
              {...register('password')}
              label="Password"
              type={showPassword ? 'text' : 'password'}
              fullWidth
              margin="normal"
              error={!!errors.password}
              helperText={errors.password?.message}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              sx={{ mt: 2 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
            </Button>
          </form>

          <Divider sx={{ my: 2 }} />

          <Typography variant="body2" textAlign="center" color="text.secondary">
            Don&apos;t have an account?{' '}
            <Link to="/register" style={{ color: 'inherit', fontWeight: 600 }}>
              Create one
            </Link>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
