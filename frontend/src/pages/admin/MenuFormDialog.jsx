import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, Grid, MenuItem, CircularProgress,
} from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { menuApi } from '../../api/menuApi';
import { useNotify } from '../../hooks/useNotify';
import { useApiError } from '../../hooks/useApiError';

const schema = yup.object({
  menuCode: yup.string().required('Menu code is required').max(50),
  menuName: yup.string().required('Menu name is required').max(100),
  url: yup.string().max(200).nullable(),
  icon: yup.string().max(50).nullable(),
  sortOrder: yup.number().integer().min(0).nullable(),
  parentId: yup.number().nullable(),
});

export default function MenuFormDialog({ open, onClose, editData }) {
  const queryClient = useQueryClient();
  const notify = useNotify();
  const { handleError } = useApiError();
  const isEdit = !!editData;

  const { register, handleSubmit, reset, control, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  const { data: menus } = useQuery({
    queryKey: ['menus-all'],
    queryFn: () => menuApi.getAll(),
    select: (res) => res.data.data?.filter((m) => !m.parentId),
    enabled: open,
  });

  useEffect(() => {
    if (open) reset(editData || { sortOrder: 0 });
  }, [open, editData]);

  const mutation = useMutation({
    mutationFn: (data) => isEdit ? menuApi.update(editData.id, data) : menuApi.create(data),
    onSuccess: () => {
      notify.success(`Menu ${isEdit ? 'updated' : 'created'}`);
      queryClient.invalidateQueries(['menus-all']);
      onClose();
    },
    onError: handleError,
  });

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{isEdit ? 'Edit Menu' : 'Create Menu'}</DialogTitle>
      <form onSubmit={handleSubmit((d) => mutation.mutate(d))}>
        <DialogContent>
          <Grid container spacing={2} mt={0.5}>
            <Grid item xs={12} sm={6}>
              <TextField {...register('menuCode')} label="Menu Code *" fullWidth
                error={!!errors.menuCode} helperText={errors.menuCode?.message} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField {...register('menuName')} label="Menu Name *" fullWidth
                error={!!errors.menuName} helperText={errors.menuName?.message} />
            </Grid>
            <Grid item xs={12}>
              <TextField {...register('url')} label="URL" fullWidth />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField {...register('icon')} label="Icon (Material Icon name)" fullWidth />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField {...register('sortOrder')} label="Sort Order" type="number" fullWidth />
            </Grid>
            <Grid item xs={12}>
              <Controller name="parentId" control={control} render={({ field }) => (
                <TextField {...field} select label="Parent Menu (optional)" fullWidth>
                  <MenuItem value="">None (Root)</MenuItem>
                  {(menus || []).filter((m) => m.id !== editData?.id).map((m) => (
                    <MenuItem key={m.id} value={m.id}>{m.menuName}</MenuItem>
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
