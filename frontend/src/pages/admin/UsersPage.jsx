import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Chip, IconButton, Tooltip } from '@mui/material';
import { Edit, Delete, LockOpen } from '@mui/icons-material';
import PageHeader from '../../components/common/PageHeader';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import UserFormDialog from './UserFormDialog';
import { userApi } from '../../api/userApi';
import { useNotify } from '../../hooks/useNotify';
import { useApiError } from '../../hooks/useApiError';

export default function UsersPage() {
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [formOpen, setFormOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const queryClient = useQueryClient();
  const notify = useNotify();
  const { handleError } = useApiError();

  const { data, isLoading } = useQuery({
    queryKey: ['users', page, pageSize],
    queryFn: () => userApi.getAll({ page, size: pageSize }),
    select: (res) => res.data.data,
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => userApi.delete(id),
    onSuccess: () => { notify.success('User deactivated'); queryClient.invalidateQueries(['users']); setDeleteId(null); },
    onError: handleError,
  });

  const unlockMutation = useMutation({
    mutationFn: (id) => userApi.unlock(id),
    onSuccess: () => { notify.success('Account unlocked'); queryClient.invalidateQueries(['users']); },
    onError: handleError,
  });

  const columns = [
    { field: 'username', headerName: 'Username', width: 130 },
    { field: 'fullName', headerName: 'Full Name', flex: 1 },
    { field: 'email', headerName: 'Email', flex: 1 },
    {
      field: 'roles', headerName: 'Roles', width: 200,
      renderCell: ({ value }) => (
        <Box display="flex" gap={0.5} flexWrap="wrap">
          {(value || []).map((r) => <Chip key={r} label={r} size="small" color="primary" variant="outlined" />)}
        </Box>
      ),
    },
    {
      field: 'active', headerName: 'Status', width: 100,
      renderCell: ({ row }) => (
        <Chip size="small"
          label={row.accountLocked ? 'Locked' : row.active ? 'Active' : 'Inactive'}
          color={row.accountLocked ? 'error' : row.active ? 'success' : 'default'} />
      ),
    },
    {
      field: 'actions', headerName: 'Actions', width: 130, sortable: false,
      renderCell: ({ row }) => (
        <>
          <Tooltip title="Edit">
            <IconButton size="small" onClick={() => { setEditData(row); setFormOpen(true); }}>
              <Edit fontSize="small" />
            </IconButton>
          </Tooltip>
          {row.accountLocked && (
            <Tooltip title="Unlock Account">
              <IconButton size="small" color="warning" onClick={() => unlockMutation.mutate(row.id)}>
                <LockOpen fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
          <Tooltip title="Deactivate">
            <IconButton size="small" color="error" onClick={() => setDeleteId(row.id)}>
              <Delete fontSize="small" />
            </IconButton>
          </Tooltip>
        </>
      ),
    },
  ];

  return (
    <Box>
      <PageHeader title="Users" onAdd={() => { setEditData(null); setFormOpen(true); }} />
      <DataGrid
        rows={data?.content || []}
        columns={columns}
        rowCount={data?.totalElements || 0}
        loading={isLoading}
        paginationMode="server"
        paginationModel={{ page, pageSize }}
        onPaginationModelChange={({ page: p, pageSize: ps }) => { setPage(p); setPageSize(ps); }}
        pageSizeOptions={[5, 10, 25]}
        autoHeight
        disableRowSelectionOnClick
      />
      <UserFormDialog open={formOpen} onClose={() => setFormOpen(false)} editData={editData} />
      <ConfirmDialog
        open={!!deleteId}
        message="Deactivate this user account?"
        onConfirm={() => deleteMutation.mutate(deleteId)}
        onCancel={() => setDeleteId(null)}
      />
    </Box>
  );
}
