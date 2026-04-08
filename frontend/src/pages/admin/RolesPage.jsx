import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Chip, IconButton, Tooltip } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import PageHeader from '../../components/common/PageHeader';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import RoleFormDialog from './RoleFormDialog';
import { roleApi } from '../../api/roleApi';
import { useNotify } from '../../hooks/useNotify';
import { useApiError } from '../../hooks/useApiError';

export default function RolesPage() {
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [formOpen, setFormOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const queryClient = useQueryClient();
  const notify = useNotify();
  const { handleError } = useApiError();

  const { data, isLoading } = useQuery({
    queryKey: ['roles', page, pageSize],
    queryFn: () => roleApi.getAll({ page, size: pageSize }),
    select: (res) => res.data.data,
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => roleApi.delete(id),
    onSuccess: () => { notify.success('Role deactivated'); queryClient.invalidateQueries(['roles']); setDeleteId(null); },
    onError: handleError,
  });

  const columns = [
    { field: 'roleName', headerName: 'Role Name', width: 150 },
    { field: 'description', headerName: 'Description', flex: 1 },
    {
      field: 'menus', headerName: 'Menus', width: 200,
      renderCell: ({ value }) => (
        <Box display="flex" gap={0.5} flexWrap="wrap">
          {(value || []).slice(0, 3).map((m) => <Chip key={m.id} label={m.menuName} size="small" />)}
          {(value || []).length > 3 && <Chip label={`+${value.length - 3}`} size="small" />}
        </Box>
      ),
    },
    {
      field: 'active', headerName: 'Status', width: 100,
      renderCell: ({ value }) => <Chip label={value ? 'Active' : 'Inactive'} size="small" color={value ? 'success' : 'default'} />,
    },
    {
      field: 'actions', headerName: 'Actions', width: 100, sortable: false,
      renderCell: ({ row }) => (
        <>
          <Tooltip title="Edit">
            <IconButton size="small" onClick={() => { setEditData(row); setFormOpen(true); }}>
              <Edit fontSize="small" />
            </IconButton>
          </Tooltip>
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
      <PageHeader title="Roles" onAdd={() => { setEditData(null); setFormOpen(true); }} />
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
      <RoleFormDialog open={formOpen} onClose={() => setFormOpen(false)} editData={editData} />
      <ConfirmDialog
        open={!!deleteId}
        message="Deactivate this role?"
        onConfirm={() => deleteMutation.mutate(deleteId)}
        onCancel={() => setDeleteId(null)}
      />
    </Box>
  );
}
