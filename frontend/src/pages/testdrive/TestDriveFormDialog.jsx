import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, Grid, MenuItem, CircularProgress, Box, Typography,
} from '@mui/material';
import { DirectionsCar } from '@mui/icons-material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { testDriveApi } from '../../api/testDriveApi';
import { vehicleApi } from '../../api/vehicleApi';
import { dealerApi } from '../../api/dealerApi';
import { useNotify } from '../../hooks/useNotify';
import { useApiError } from '../../hooks/useApiError';

const schema = yup.object({
  customerName: yup.string().required('Customer name is required').max(100),
  customerPhone: yup.string().required('Phone is required').matches(/^[+]?[0-9]{10,15}$/, 'Invalid phone'),
  customerEmail: yup.string().email('Invalid email').nullable(),
  scheduledDate: yup.string().required('Date is required'),
  scheduledTime: yup.string().nullable(),
  notes: yup.string().max(500).nullable(),
  status: yup.string(),
  vehicleId: yup.number().required('Vehicle is required').typeError('Vehicle is required'),
  dealerId: yup.number().required('Dealer is required').typeError('Dealer is required'),
});

export default function TestDriveFormDialog({ open, onClose, editData, preselectedVehicle }) {
  const queryClient = useQueryClient();
  const notify = useNotify();
  const { handleError } = useApiError();
  const isEdit = !!editData;

  const { register, handleSubmit, reset, control, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { status: 'SCHEDULED' },
  });

  useEffect(() => {
    if (open) {
      if (isEdit) {
        reset({ ...editData, scheduledDate: editData.scheduledDate });
      } else if (preselectedVehicle) {
        reset({
          status: 'SCHEDULED',
          vehicleId: preselectedVehicle.id,
          dealerId: preselectedVehicle.dealerId,
        });
      } else {
        reset({ status: 'SCHEDULED' });
      }
    }
  }, [open, editData, preselectedVehicle]);

  const { data: vehicles } = useQuery({
    queryKey: ['vehicles-all'],
    queryFn: () => vehicleApi.getAll({ size: 200, status: 'AVAILABLE' }),
    select: (res) => res.data.data.content,
    enabled: open,
  });

  const { data: dealers } = useQuery({
    queryKey: ['dealers-all'],
    queryFn: () => dealerApi.getAll({ size: 100 }),
    select: (res) => res.data.data.content,
    enabled: open,
  });

  const mutation = useMutation({
    mutationFn: (data) => isEdit ? testDriveApi.update(editData.id, data) : testDriveApi.create(data),
    onSuccess: () => {
      notify.success(`Test drive ${isEdit ? 'updated' : 'booked'}`);
      queryClient.invalidateQueries(['test-drives']);
      onClose();
    },
    onError: handleError,
  });

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{isEdit ? 'Edit Test Drive' : 'Book Test Drive'}</DialogTitle>
      <form onSubmit={handleSubmit((d) => mutation.mutate(d))}>
        <DialogContent>
          {/* Show preselected vehicle info */}
          {preselectedVehicle && !isEdit && (
            <Box sx={{ p: 2, mb: 2, borderRadius: 2, bgcolor: '#f0f7ff', border: '1px solid #bfdbfe', display: 'flex', alignItems: 'center', gap: 2 }}>
              <DirectionsCar sx={{ color: '#002C5F', fontSize: 32 }} />
              <Box>
                <Typography variant="subtitle2" fontWeight={700} color="primary">
                  {preselectedVehicle.model} — {preselectedVehicle.variant}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {preselectedVehicle.color} · {preselectedVehicle.modelYear} · VIN: {preselectedVehicle.vin}
                </Typography>
                {preselectedVehicle.dealerName && (
                  <Typography variant="caption" color="text.secondary" display="block">
                    📍 {preselectedVehicle.dealerName}
                  </Typography>
                )}
              </Box>
            </Box>
          )}
          <Grid container spacing={2} mt={0.5}>
            <Grid item xs={12} sm={6}>
              <TextField {...register('customerName')} label="Customer Name *" fullWidth
                error={!!errors.customerName} helperText={errors.customerName?.message} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField {...register('customerPhone')} label="Phone *" fullWidth
                error={!!errors.customerPhone} helperText={errors.customerPhone?.message} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField {...register('customerEmail')} label="Email" fullWidth
                error={!!errors.customerEmail} helperText={errors.customerEmail?.message} />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField {...register('scheduledDate')} label="Date *" type="date" fullWidth
                InputLabelProps={{ shrink: true }}
                error={!!errors.scheduledDate} helperText={errors.scheduledDate?.message} />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField {...register('scheduledTime')} label="Time" type="time" fullWidth InputLabelProps={{ shrink: true }} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller name="vehicleId" control={control} render={({ field }) => (
                <TextField {...field} select label="Vehicle *" fullWidth
                  error={!!errors.vehicleId} helperText={errors.vehicleId?.message}>
                  {(vehicles || []).map((v) => (
                    <MenuItem key={v.id} value={v.id}>{v.model} — {v.vin}</MenuItem>
                  ))}
                </TextField>
              )} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller name="dealerId" control={control} render={({ field }) => (
                <TextField {...field} select label="Dealer *" fullWidth
                  error={!!errors.dealerId} helperText={errors.dealerId?.message}>
                  {(dealers || []).map((d) => (
                    <MenuItem key={d.id} value={d.id}>{d.dealerName}</MenuItem>
                  ))}
                </TextField>
              )} />
            </Grid>
            {isEdit && (
              <Grid item xs={12} sm={6}>
                <Controller name="status" control={control} render={({ field }) => (
                  <TextField {...field} select label="Status" fullWidth>
                    {['SCHEDULED', 'COMPLETED', 'CANCELLED', 'NO_SHOW'].map((s) => (
                      <MenuItem key={s} value={s}>{s}</MenuItem>
                    ))}
                  </TextField>
                )} />
              </Grid>
            )}
            <Grid item xs={12}>
              <TextField {...register('notes')} label="Notes" fullWidth multiline rows={2} />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={mutation.isPending}>
            {mutation.isPending ? <CircularProgress size={20} /> : isEdit ? 'Update' : 'Book'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
