// ============================================================================
// LOGIN PAGE - User authentication with form validation
// ============================================================================
// Features: Yup validation, error handling, auto-redirect after login
// ============================================================================

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  Box, TextField, Button, Typography, InputAdornment,
  IconButton, CircularProgress, Alert,
} from '@mui/material';
import { Visibility, VisibilityOff, DirectionsCar } from '@mui/icons-material';
import { authApi } from '../api/authApi';
import { useAuthStore } from '../store/authStore';

// Validation schema using Yup
const schema = yup.object({
  username: yup.string().required('Username is required'),
  password: yup.string().required('Password is required'),
});

export default function LoginPage() {
  // Local state
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Global state and navigation
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();

  // React Hook Form with Yup validation
  const { register, handleSubmit, formState: { errors } } = useForm({ 
    resolver: yupResolver(schema) 
  });

  // Form submission handler
  const onSubmit = async (data) => {
    setLoading(true); 
    setError('');
    
    try {
      // Call login API
      const res = await authApi.login(data);
      
      // Save auth data to Zustand store
      setAuth(res.data.data);
      
      // Redirect to dashboard
      navigate('/dashboard');
    } catch (err) {
      // Show error message
      setError(err?.response?.data?.message || 'Login failed. Please try again.');
    } finally { 
      setLoading(false); 
    }
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Left panel */}
      <Box sx={{
        display: { xs: 'none', md: 'flex' },
        width: '50%',
        background: 'linear-gradient(145deg, #002C5F 0%, #001a3a 60%, #00AAD2 100%)',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        p: 6,
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Decorative circles */}
        <Box sx={{ position: 'absolute', top: -80, right: -80, width: 300, height: 300, borderRadius: '50%', background: 'rgba(0,170,210,0.1)' }} />
        <Box sx={{ position: 'absolute', bottom: -60, left: -60, width: 250, height: 250, borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />

        <Box sx={{ position: 'relative', textAlign: 'center', maxWidth: 380 }}>
          <Box sx={{
            width: 72, height: 72, borderRadius: 3,
            background: 'rgba(0,170,210,0.2)',
            border: '1px solid rgba(0,170,210,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            mx: 'auto', mb: 3,
          }}>
            <DirectionsCar sx={{ fontSize: 36, color: '#00AAD2' }} />
          </Box>
          <Typography variant="h4" sx={{ color: '#fff', fontWeight: 800, mb: 1.5 }}>
            Hyundai AutoEver
          </Typography>
          <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 400, mb: 3 }}>
            Dealer Management System
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.45)', lineHeight: 1.8 }}>
            Manage your dealership network, vehicle inventory, test drives, and customer enquiries — all in one place.
          </Typography>

          {/* Stats */}
          <Box display="flex" justifyContent="center" gap={4} mt={5}>
            {[['Dealers', '50+'], ['Vehicles', '200+'], ['Regions', '14']].map(([label, val]) => (
              <Box key={label} textAlign="center">
                <Typography variant="h5" sx={{ color: '#00AAD2', fontWeight: 800 }}>{val}</Typography>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.45)' }}>{label}</Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>

      {/* Right panel */}
      <Box sx={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: '#f8fafc',
        p: 3,
      }}>
        <Box sx={{ width: '100%', maxWidth: 420 }}>
          {/* Mobile logo */}
          <Box sx={{ display: { md: 'none' }, textAlign: 'center', mb: 4 }}>
            <DirectionsCar sx={{ fontSize: 40, color: '#002C5F' }} />
            <Typography variant="h5" fontWeight={800} color="primary">Hyundai AutoEver DMS</Typography>
          </Box>

          <Typography variant="h5" fontWeight={800} color="text.primary" mb={0.5}>
            Welcome back
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={3}>
            Sign in to your account to continue
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2.5, borderRadius: 2, fontSize: '0.85rem' }}>{error}</Alert>
          )}

          <form onSubmit={handleSubmit(onSubmit)}>
            <Box mb={2}>
              <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ mb: 0.5, display: 'block', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Username
              </Typography>
              <TextField
                {...register('username')}
                fullWidth size="small"
                placeholder="Enter your username"
                error={!!errors.username}
                helperText={errors.username?.message}
                autoFocus
                sx={{ '& .MuiOutlinedInput-root': { bgcolor: '#fff' } }}
              />
            </Box>
            <Box mb={3}>
              <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ mb: 0.5, display: 'block', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Password
              </Typography>
              <TextField
                {...register('password')}
                type={showPassword ? 'text' : 'password'}
                fullWidth size="small"
                placeholder="Enter your password"
                error={!!errors.password}
                helperText={errors.password?.message}
                sx={{ '& .MuiOutlinedInput-root': { bgcolor: '#fff' } }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton size="small" onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
            <Button type="submit" variant="contained" fullWidth size="large" disabled={loading}
              sx={{ py: 1.3, fontSize: '0.95rem', fontWeight: 700, borderRadius: 2,
                background: 'linear-gradient(135deg, #002C5F, #1a4a7a)',
                '&:hover': { background: 'linear-gradient(135deg, #001a3a, #002C5F)' } }}>
              {loading ? <CircularProgress size={22} color="inherit" /> : 'Sign In'}
            </Button>
          </form>

          <Typography variant="caption" display="block" textAlign="center" color="text.disabled" mt={4}>
            © 2026 Hyundai AutoEver. All rights reserved.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
