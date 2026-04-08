import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  Box, Card, CardContent, TextField, Button, Typography,
  InputAdornment, IconButton, CircularProgress, Alert,
  Grid, Divider, MenuItem,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { authApi } from '../api/authApi';
import { useAuthStore } from '../store/authStore';

const schema = yup.object({
  username: yup
    .string()
    .required('Username is required')
    .min(3, 'At least 3 characters')
    .max(50)
    .matches(/^[a-zA-Z0-9_]+$/, 'Only letters, numbers, and underscores'),
  email: yup.string().required('Email is required').email('Invalid email'),
  fullName: yup.string().max(100),
  phoneNumber: yup
    .string()
    .nullable()
    .transform((v) => (v === '' ? null : v))
    .matches(/^[+]?[0-9]{10,15}$/, { message: 'Invalid phone number', excludeEmptyString: true }),
  password: yup
    .string()
    .required('Password is required')
    .min(8, 'At least 8 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
      'Must include uppercase, lowercase, number, and special character'
    ),
  confirmPassword: yup
    .string()
    .required('Please confirm your password')
    .oneOf([yup.ref('password')], 'Passwords do not match'),
  role: yup.string().required('Please select a role').oneOf(['DEALER', 'EMPLOYEE']),
});

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = async (data) => {
    setLoading(true);
    setError('');
    try {
      const res = await authApi.register(data);
      setAuth(res.data.data);
      navigate('/dashboard');
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        (typeof err?.response?.data?.errors === 'object'
          ? Object.values(err.response.data.errors).join(', ')
          : err?.response?.data?.errors) ||
        'Registration failed. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      sx={{ bgcolor: 'grey.100', py: 4 }}
    >
      <Card sx={{ width: 480, boxShadow: 4 }}>
        <CardContent sx={{ p: 4 }}>
          <Box textAlign="center" mb={3}>
            <Typography variant="h4" fontWeight="bold" color="primary">
              DMS
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Create your account
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  {...register('username')}
                  label="Username *"
                  fullWidth
                  error={!!errors.username}
                  helperText={errors.username?.message}
                  autoFocus
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  {...register('fullName')}
                  label="Full Name"
                  fullWidth
                  error={!!errors.fullName}
                  helperText={errors.fullName?.message}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  {...register('email')}
                  label="Email *"
                  fullWidth
                  error={!!errors.email}
                  helperText={errors.email?.message}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  {...register('phoneNumber')}
                  label="Phone Number"
                  fullWidth
                  error={!!errors.phoneNumber}
                  helperText={errors.phoneNumber?.message}
                />
              </Grid>
              <Grid item xs={12}>
                <Controller
                  name="role"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <TextField
                      {...field}
                      select
                      label="Register As *"
                      fullWidth
                      error={!!errors.role}
                      helperText={errors.role?.message || 'Select your role in the system'}
                    >
                      <MenuItem value="DEALER">
                        Dealer — Manage dealership and vehicles
                      </MenuItem>
                      <MenuItem value="EMPLOYEE">
                        Employee — Sales and support staff
                      </MenuItem>
                    </TextField>
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  {...register('password')}
                  label="Password *"
                  type={showPassword ? 'text' : 'password'}
                  fullWidth
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
              </Grid>
              <Grid item xs={12}>
                <TextField
                  {...register('confirmPassword')}
                  label="Confirm Password *"
                  type={showConfirm ? 'text' : 'password'}
                  fullWidth
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword?.message}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowConfirm(!showConfirm)} edge="end">
                          {showConfirm ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>

            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              sx={{ mt: 3 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Create Account'}
            </Button>
          </form>

          <Divider sx={{ my: 2 }} />

          <Typography variant="body2" textAlign="center" color="text.secondary">
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'inherit', fontWeight: 600 }}>
              Sign in
            </Link>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
