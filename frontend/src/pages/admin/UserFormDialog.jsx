import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, Grid, MenuItem, Checkbox, ListItemText,
  Select, InputLabel, FormControl, CircularProgress, FormHelperText,
  Alert, InputAdornment, IconButton,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { userApi } from '../../api/userApi';
import { roleApi } from '../../api/roleApi';
import { useNotify } from '../../hooks/useNotify';
import { useApiError } from '../../hooks/useApiError';
import { useAuthStore } from '../../store/authStore';

const schema = yup.object({
  username: yup.string().required('Username is required').min(3).max(50),
  email: yup.string().required('Email is required').email(),
  password: yup.string().when('$isEdit', {
    is: false,
    then: (s) => s.required('Password is required').min(8),
    otherwise: (s) => s.min(8).nullable().transform((v) => v === '' ? null : v),
  }),
  fullName: yup.string().max(100),
  phoneNumber: yup.string().nullable(),
  roleIds: yup.array().of(yup.number()),
});

export default function UserFormDialog({ open, onClose, editData, isDealer = false }) {
  const queryClient = useQueryClient();
  const notify = useNotify();
  const { handleError } = useApiError();
  const isEdit = !!editData;
  const { user } = useAuthStore();
  
  // Show/hide password toggle
  const [showPassword, setShowPassword] = useState(false);

  // Admin editing their own account — role field should be locked
  const isSelfEdit = isEdit && editData?.username === user?.username;

  const { register, handleSubmit, reset, control, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    context: { isEdit },
  });

  const { data: roles } = useQuery({
    queryKey: ['roles-active'],
    queryFn: () => roleApi.getAllActive(),
    select: (res) => {
      let list = res.data.data;
      // ADMIN role never shown in create/edit dropdown — only one admin allowed
      list = list.filter(r => r.roleName !== 'ADMIN');
      // Dealer can only assign EMPLOYEE
      if (isDealer) list = list.filter(r => r.roleName === 'EMPLOYEE');
      return list;
    },
    enabled: open,
  });

  useEffect(() => {
    if (open) {
      reset(isEdit ? {
        ...editData,
        password: '',
        roleIds: editData.roles?.map((r) => roles?.find((ro) => ro.roleName === r)?.id).filter(Boolean) || [],
      } : { roleIds: [] });
    }
  }, [open, editData, roles, isEdit, reset]);

  const mutation = useMutation({
    mutationFn: (data) => isEdit ? userApi.update(editData.id, data) : userApi.create(data),
    onSuccess: () => {
      notify.success(`User ${isEdit ? 'updated' : 'created'}`);
      queryClient.invalidateQueries(['users']);
      onClose();
    },
    onError: handleError,
  });

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{isEdit ? 'Edit User' : 'Create User'}</DialogTitle>
      <form onSubmit={handleSubmit((d) => mutation.mutate(d))}>
        <DialogContent>
          {isSelfEdit && (
            <Alert severity="warning" sx={{ mb: 2, borderRadius: 2 }}>
              You are editing your own account. Your role cannot be changed.
            </Alert>
          )}
          <Grid container spacing={2} mt={0.5}>
            <Grid item xs={12} sm={6}>
              <TextField {...register('username')} label="Username *" fullWidth
                error={!!errors.username} helperText={errors.username?.message} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField {...register('email')} label="Email *" fullWidth
                error={!!errors.email} helperText={errors.email?.message} />
            </Grid>
            <Grid item xs={12}>
              <TextField 
                {...register('password')} 
                label={isEdit ? 'New Password (leave blank to keep)' : 'Password *'}
                type={showPassword ? 'text' : 'password'} 
                fullWidth 
                error={!!errors.password} 
                helperText={errors.password?.message || (!isEdit && 'Minimum 8 characters. Click the eye icon to reveal password for sharing with the user.')}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        size="small"
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        title={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField {...register('fullName')} label="Full Name" fullWidth />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField {...register('phoneNumber')} label="Phone" fullWidth />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth error={!!errors.roleIds} disabled={isSelfEdit}>
                <InputLabel>Roles</InputLabel>
                <Controller name="roleIds" control={control} render={({ field }) => (
                  <Select {...field} multiple label="Roles"
                    renderValue={(selected) =>
                      (roles || []).filter((r) => selected.includes(r.id)).map((r) => r.roleName).join(', ')
                    }>
                    {(roles || []).map((role) => (
                      <MenuItem key={role.id} value={role.id}>
                        <Checkbox checked={(field.value || []).includes(role.id)} />
                        <ListItemText primary={role.roleName} secondary={role.description} />
                      </MenuItem>
                    ))}
                  </Select>
                )} />
                {isSelfEdit && (
                  <FormHelperText sx={{ color: 'warning.main' }}>
                    You cannot change your own role
                  </FormHelperText>
                )}
                {errors.roleIds && <FormHelperText>{errors.roleIds.message}</FormHelperText>}
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={mutation.isPending}>
            {mutation.isPending ? <CircularProgress size={20} /> : isEdit ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
