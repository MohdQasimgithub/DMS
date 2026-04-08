import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, Grid, MenuItem, CircularProgress,
} from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { dealerApi } from '../../api/dealerApi';
import { useNotify } from '../../hooks/useNotify';
import { useApiError } from '../../hooks/useApiError';

const schema = yup.object({
  dealerCode: yup.string().required('Dealer code is required').max(20),
  dealerName: yup.string().required('Dealer name is required').max(100),
  address: yup.string().max(200),
  city: yup.string().max(50),
  region: yup.string().max(50),
  phone: yup.string().matches(/^[+]?[0-9]{10,15}$/, 'Invalid phone').nullable(),
  email: yup.string().email('Invalid email').nullable(),
  managerName: yup.string().max(100),
  status: yup.string().oneOf(['ACTIVE', 'INACTIVE', 'SUSPENDED']),
});

export default function DealerFormDialog({ open, onClose, editData }) {
  const queryClient = useQueryClient();
  const notify = useNotify();
  const { handleError } = useApiError();
  const isEdit = !!editData;

  const { register, handleSubmit, reset, control, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { status: 'ACTIVE' },
  });

  useEffect(() => {
    if (open) reset(editData || { status: 'ACTIVE' });
  }, [open, editData]);

  const mutation = useMutation({
    mutationFn: (data) => isEdit ? dealerApi.update(editData.id, data) : dealerApi.create(data),
    onSuccess: () => {
      notify.success(`Dealer ${isEdit ? 'updated' : 'created'} successfully`);
      queryClient.invalidateQueries(['dealers']);
      onClose();
    },
    onError: handleError,
  });

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{isEdit ? 'Edit Dealer' : 'Add New Dealer'}</DialogTitle>
      <form onSubmit={handleSubmit((d) => mutation.mutate(d))}>
        <DialogContent>
          <Grid container spacing={2} mt={0.5}>
            <Grid item xs={12} sm={6}>
              <TextField {...register('dealerCode')} label="Dealer Code *" fullWidth
                error={!!errors.dealerCode} helperText={errors.dealerCode?.message} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField {...register('dealerName')} label="Dealer Name *" fullWidth
                error={!!errors.dealerName} helperText={errors.dealerName?.message} />
            </Grid>
            <Grid item xs={12}>
              <TextField {...register('address')} label="Address" fullWidth />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField {...register('city')} label="City" fullWidth />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField {...register('region')} label="Region" fullWidth />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField {...register('phone')} label="Phone" fullWidth
                error={!!errors.phone} helperText={errors.phone?.message} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField {...register('email')} label="Email" fullWidth
                error={!!errors.email} helperText={errors.email?.message} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField {...register('managerName')} label="Manager Name" fullWidth />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller name="status" control={control} render={({ field }) => (
                <TextField {...field} select label="Status" fullWidth>
                  {['ACTIVE', 'INACTIVE', 'SUSPENDED'].map((s) => (
                    <MenuItem key={s} value={s}>{s}</MenuItem>
                  ))}
                </TextField>
              )} />
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
