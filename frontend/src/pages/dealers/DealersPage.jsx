import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Chip, IconButton, Tooltip } from '@mui/material';
import { Edit, Delete, LockOpen } from '@mui/icons-material';
import PageHeader from '../../components/common/PageHeader';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import DealerFormDialog from './DealerFormDialog';
import { dealerApi } from '../../api/dealerApi';
import { useNotify } from '../../hooks/useNotify';
import { useApiError } from '../../hooks/useApiError';

export default function DealersPage() {
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [formOpen, setFormOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const queryClient = useQueryClient();
  const notify = useNotify();
  const { handleError } = useApiError();

  const { data, isLoading } = useQuery({
    queryKey: ['dealers', page, pageSize],
    queryFn: () => dealerApi.getAll({ page, size: pageSize }),
    select: (res) => res.data.data,
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => dealerApi.delete(id),
    onSuccess: () => {
      notify.success('Dealer deactivated');
      queryClient.invalidateQueries(['dealers']);
      setDeleteId(null);
    },
    onError: handleError,
  });

  const columns = [
    { field: 'dealerCode', headerName: 'Code', width: 120 },
    { field: 'dealerName', headerName: 'Name', flex: 1 },
    { field: 'city', headerName: 'City', width: 120 },
    { field: 'region', headerName: 'Region', width: 120 },
    { field: 'phone', headerName: 'Phone', width: 140 },
    { field: 'managerName', headerName: 'Manager', width: 150 },
    {
      field: 'status', headerName: 'Status', width: 120,
      renderCell: ({ value }) => (
        <Chip label={value} size="small"
          color={value === 'ACTIVE' ? 'success' : value === 'SUSPENDED' ? 'warning' : 'default'} />
      ),
    },
    {
      field: 'actions', headerName: 'Actions', width: 120, sortable: false,
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
      <PageHeader title="Dealers" onAdd={() => { setEditData(null); setFormOpen(true); }} />
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
      <DealerFormDialog
        open={formOpen}
        onClose={() => setFormOpen(false)}
        editData={editData}
      />
      <ConfirmDialog
        open={!!deleteId}
        message="Are you sure you want to deactivate this dealer?"
        onConfirm={() => deleteMutation.mutate(deleteId)}
        onCancel={() => setDeleteId(null)}
      />
    </Box>
  );
}
