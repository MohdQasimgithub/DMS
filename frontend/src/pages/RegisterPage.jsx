import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  Box, TextField, Button, Typography, InputAdornment,
  IconButton, CircularProgress, Alert, Grid, MenuItem, Divider,
} from '@mui/material';
import { Visibility, VisibilityOff, DirectionsCar } from '@mui/icons-material';
import { authApi } from '../api/authApi';
import { useAuthStore } from '../store/authStore';

const schema = yup.object({
  username: yup.string().required('Username is required').min(3).max(50)
    .matches(/^[a-zA-Z0-9_]+$/, 'Only letters, numbers, underscores'),
  email: yup.string().required('Email is required').email('Invalid email'),
  fullName: yup.string().max(100),
  phoneNumber: yup.string().nullable()
    .transform(v => v === '' ? null : v)
    .matches(/^[+]?[0-9]{10,15}$/, { message: 'Invalid phone', excludeEmptyString: true }),
  password: yup.string().required('Password is required').min(8)
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/, 'Must include uppercase, lowercase, number, special char'),
  confirmPassword: yup.string().required('Please confirm password')
    .oneOf([yup.ref('password')], 'Passwords do not match'),
  role: yup.string().required('Please select a role').oneOf(['DEALER', 'EMPLOYEE']),
});

// ── Defined OUTSIDE component so it never remounts on re-render ──────────────
function FieldLabel({ children }) {
  return (
    <Typography variant="caption" fontWeight={600} color="text.secondary"
      sx={{ mb: 0.5, display: 'block', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
      {children}
    </Typography>
  );
}

export default function RegisterPage() {
  const [showPwd, setShowPwd] = useState(false);
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
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'onBlur',        // validate on blur, not on every keystroke
    reValidateMode: 'onBlur',
  });

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
        'Registration failed.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const inputSx = { '& .MuiOutlinedInput-root': { bgcolor: '#fff' } };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f8fafc', alignItems: 'center', justifyContent: 'center', p: 3 }}>
      <Box sx={{
        width: '100%', maxWidth: 520, bgcolor: '#fff', borderRadius: 3,
        boxShadow: '0 20px 60px rgba(0,0,0,0.08)', border: '1px solid #f1f5f9',
        p: { xs: 3, sm: 4 },
      }}>
        {/* Header */}
        <Box textAlign="center" mb={3}>
          <Box sx={{
            width: 52, height: 52, borderRadius: 2,
            background: 'linear-gradient(135deg, #002C5F, #00AAD2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            mx: 'auto', mb: 2,
          }}>
            <DirectionsCar sx={{ color: '#fff', fontSize: 26 }} />
          </Box>
          <Typography variant="h5" fontWeight={800} color="text.primary">Create Account</Typography>
          <Typography variant="body2" color="text.secondary" mt={0.5}>Join Hyundai AutoEver DMS</Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2.5, borderRadius: 2, fontSize: '0.85rem' }}>{error}</Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Grid container spacing={2}>

            {/* Username */}
            <Grid item xs={12} sm={6}>
              <FieldLabel>Username *</FieldLabel>
              <TextField
                {...register('username')}
                fullWidth size="small"
                placeholder="e.g. john_doe"
                error={!!errors.username}
                helperText={errors.username?.message}
                sx={inputSx}
              />
            </Grid>

            {/* Full Name */}
            <Grid item xs={12} sm={6}>
              <FieldLabel>Full Name</FieldLabel>
              <TextField
                {...register('fullName')}
                fullWidth size="small"
                placeholder="Your full name"
                error={!!errors.fullName}
                helperText={errors.fullName?.message}
                sx={inputSx}
              />
            </Grid>

            {/* Email */}
            <Grid item xs={12}>
              <FieldLabel>Email *</FieldLabel>
              <TextField
                {...register('email')}
                fullWidth size="small"
                placeholder="you@example.com"
                error={!!errors.email}
                helperText={errors.email?.message}
                sx={inputSx}
              />
            </Grid>

            {/* Phone */}
            <Grid item xs={12} sm={6}>
              <FieldLabel>Phone Number</FieldLabel>
              <TextField
                {...register('phoneNumber')}
                fullWidth size="small"
                placeholder="01012345678"
                error={!!errors.phoneNumber}
                helperText={errors.phoneNumber?.message}
                sx={inputSx}
              />
            </Grid>

            {/* Role */}
            <Grid item xs={12} sm={6}>
              <FieldLabel>Register As *</FieldLabel>
              <Controller
                name="role"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    select fullWidth size="small"
                    error={!!errors.role}
                    helperText={errors.role?.message}
                    sx={inputSx}
                  >
                    <MenuItem value="DEALER">Dealer</MenuItem>
                    <MenuItem value="EMPLOYEE">Employee</MenuItem>
                  </TextField>
                )}
              />
            </Grid>

            {/* Password */}
            <Grid item xs={12}>
              <FieldLabel>Password *</FieldLabel>
              <TextField
                {...register('password')}
                type={showPwd ? 'text' : 'password'}
                fullWidth size="small"
                placeholder="Min 8 chars, uppercase, number, special char"
                error={!!errors.password}
                helperText={errors.password?.message}
                sx={inputSx}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        size="small"
                        tabIndex={-1}
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => setShowPwd(v => !v)}
                      >
                        {showPwd ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            {/* Confirm Password */}
            <Grid item xs={12}>
              <FieldLabel>Confirm Password *</FieldLabel>
              <TextField
                {...register('confirmPassword')}
                type={showConfirm ? 'text' : 'password'}
                fullWidth size="small"
                placeholder="Re-enter your password"
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword?.message}
                sx={inputSx}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        size="small"
                        tabIndex={-1}
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => setShowConfirm(v => !v)}
                      >
                        {showConfirm ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
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
            disabled={loading}
            sx={{
              mt: 3, py: 1.3, fontWeight: 700, borderRadius: 2,
              background: 'linear-gradient(135deg, #002C5F, #1a4a7a)',
              '&:hover': { background: 'linear-gradient(135deg, #001a3a, #002C5F)' },
            }}
          >
            {loading ? <CircularProgress size={22} color="inherit" /> : 'Create Account'}
          </Button>
        </form>

        <Divider sx={{ my: 2.5 }}>
          <Typography variant="caption" color="text.secondary">or</Typography>
        </Divider>
        <Typography variant="body2" textAlign="center" color="text.secondary">
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#002C5F', fontWeight: 700, textDecoration: 'none' }}>
            Sign in
          </Link>
        </Typography>
      </Box>
    </Box>
  );
}
