import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, Grid, MenuItem, CircularProgress,
} from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { vehicleApi } from '../../api/vehicleApi';
import { dealerApi } from '../../api/dealerApi';
import { useNotify } from '../../hooks/useNotify';
import { useApiError } from '../../hooks/useApiError';

const schema = yup.object({
  vin: yup.string().required('VIN is required').length(17, 'VIN must be 17 characters'),
  model: yup.string().required('Model is required'),
  variant: yup.string().nullable(),
  color: yup.string().nullable(),
  modelYear: yup.number().min(2000).max(2030).nullable(),
  price: yup.number().positive().nullable(),
  status: yup.string(),
  dealerId: yup.number().nullable(),
});

export default function VehicleFormDialog({ open, onClose, editData }) {
  const queryClient = useQueryClient();
  const notify = useNotify();
  const { handleError } = useApiError();
  const isEdit = !!editData;

  const { register, handleSubmit, reset, control, watch, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { status: 'AVAILABLE' },
  });

  const watchModel = watch('model');
  const watchVariant = watch('variant');

  useEffect(() => {
    if (open) reset(editData || { status: 'AVAILABLE' });
  }, [open, editData]);

  // Linked dropdowns
  const { data: models } = useQuery({
    queryKey: ['vehicle-models'],
    queryFn: () => vehicleApi.getModels(),
    select: (res) => res.data.data,
    enabled: open,
  });

  const { data: variants } = useQuery({
    queryKey: ['vehicle-variants', watchModel],
    queryFn: () => vehicleApi.getVariants(watchModel),
    select: (res) => res.data.data,
    enabled: !!watchModel,
  });

  const { data: colors } = useQuery({
    queryKey: ['vehicle-colors', watchModel, watchVariant],
    queryFn: () => vehicleApi.getColors(watchModel, watchVariant),
    select: (res) => res.data.data,
    enabled: !!watchModel && !!watchVariant,
  });

  const { data: dealers } = useQuery({
    queryKey: ['dealers-all'],
    queryFn: () => dealerApi.getAll({ size: 100 }),
    select: (res) => res.data.data.content,
    enabled: open,
  });

  const mutation = useMutation({
    mutationFn: (data) => isEdit ? vehicleApi.update(editData.id, data) : vehicleApi.create(data),
    onSuccess: () => {
      notify.success(`Vehicle ${isEdit ? 'updated' : 'created'}`);
      queryClient.invalidateQueries(['vehicles']);
      onClose();
    },
    onError: handleError,
  });

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{isEdit ? 'Edit Vehicle' : 'Add Vehicle'}</DialogTitle>
      <form onSubmit={handleSubmit((d) => mutation.mutate(d))}>
        <DialogContent>
          <Grid container spacing={2} mt={0.5}>
            <Grid item xs={12}>
              <TextField {...register('vin')} label="VIN *" fullWidth
                error={!!errors.vin} helperText={errors.vin?.message} />
            </Grid>
            {/* Linked dropdowns: Model → Variant → Color */}
            <Grid item xs={12} sm={4}>
              <Controller name="model" control={control} render={({ field }) => (
                <TextField {...field} select label="Model *" fullWidth error={!!errors.model} helperText={errors.model?.message}>
                  {(models || []).map((m) => <MenuItem key={m} value={m}>{m}</MenuItem>)}
                  <MenuItem value={field.value || ''}>{field.value || 'Type model...'}</MenuItem>
                </TextField>
              )} />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Controller name="variant" control={control} render={({ field }) => (
                <TextField {...field} select label="Variant" fullWidth disabled={!watchModel}>
                  {(variants || []).map((v) => <MenuItem key={v} value={v}>{v}</MenuItem>)}
                </TextField>
              )} />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Controller name="color" control={control} render={({ field }) => (
                <TextField {...field} select label="Color" fullWidth disabled={!watchVariant}>
                  {(colors || []).map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                </TextField>
              )} />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField {...register('modelYear')} label="Model Year" type="number" fullWidth />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField {...register('price')} label="Price" type="number" fullWidth />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Controller name="status" control={control} render={({ field }) => (
                <TextField {...field} select label="Status" fullWidth>
                  {['AVAILABLE', 'RESERVED', 'SOLD', 'IN_TRANSIT'].map((s) => (
                    <MenuItem key={s} value={s}>{s}</MenuItem>
                  ))}
                </TextField>
              )} />
            </Grid>
            <Grid item xs={12}>
              <Controller name="dealerId" control={control} render={({ field }) => (
                <TextField {...field} select label="Dealer" fullWidth>
                  <MenuItem value="">None</MenuItem>
                  {(dealers || []).map((d) => (
                    <MenuItem key={d.id} value={d.id}>{d.dealerName}</MenuItem>
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
