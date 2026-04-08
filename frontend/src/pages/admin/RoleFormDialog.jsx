import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, Grid, MenuItem, Checkbox, ListItemText,
  Select, InputLabel, FormControl, CircularProgress,
} from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { roleApi } from '../../api/roleApi';
import { menuApi } from '../../api/menuApi';
import { useNotify } from '../../hooks/useNotify';
import { useApiError } from '../../hooks/useApiError';

const schema = yup.object({
  roleName: yup.string().required('Role name is required').min(2).max(50),
  description: yup.string().max(200),
  menuIds: yup.array().of(yup.number()),
});

export default function RoleFormDialog({ open, onClose, editData }) {
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
    select: (res) => res.data.data,
    enabled: open,
  });

  useEffect(() => {
    if (open) {
      reset(isEdit ? {
        ...editData,
        menuIds: editData.menus?.map((m) => m.id) || [],
      } : { menuIds: [] });
    }
  }, [open, editData]);

  const mutation = useMutation({
    mutationFn: (data) => isEdit ? roleApi.update(editData.id, data) : roleApi.create(data),
    onSuccess: () => {
      notify.success(`Role ${isEdit ? 'updated' : 'created'}`);
      queryClient.invalidateQueries(['roles']);
      onClose();
    },
    onError: handleError,
  });

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{isEdit ? 'Edit Role' : 'Create Role'}</DialogTitle>
      <form onSubmit={handleSubmit((d) => mutation.mutate(d))}>
        <DialogContent>
          <Grid container spacing={2} mt={0.5}>
            <Grid item xs={12}>
              <TextField {...register('roleName')} label="Role Name *" fullWidth
                error={!!errors.roleName} helperText={errors.roleName?.message} />
            </Grid>
            <Grid item xs={12}>
              <TextField {...register('description')} label="Description" fullWidth multiline rows={2} />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Assign Menus</InputLabel>
                <Controller name="menuIds" control={control} render={({ field }) => (
                  <Select {...field} multiple label="Assign Menus"
                    renderValue={(selected) =>
                      (menus || []).filter((m) => selected.includes(m.id)).map((m) => m.menuName).join(', ')
                    }>
                    {(menus || []).map((menu) => (
                      <MenuItem key={menu.id} value={menu.id}>
                        <Checkbox checked={(field.value || []).includes(menu.id)} />
                        <ListItemText primary={menu.menuName} secondary={menu.url} />
                      </MenuItem>
                    ))}
                  </Select>
                )} />
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
