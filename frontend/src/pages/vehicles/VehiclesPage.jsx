import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Chip, IconButton, Tooltip } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import PageHeader from '../../components/common/PageHeader';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import VehicleFormDialog from './VehicleFormDialog';
import { vehicleApi } from '../../api/vehicleApi';
import { useNotify } from '../../hooks/useNotify';
import { useApiError } from '../../hooks/useApiError';

const statusColors = { AVAILABLE: 'success', RESERVED: 'warning', SOLD: 'error', IN_TRANSIT: 'info' };

export default function VehiclesPage() {
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [formOpen, setFormOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const queryClient = useQueryClient();
  const notify = useNotify();
  const { handleError } = useApiError();

  const { data, isLoading } = useQuery({
    queryKey: ['vehicles', page, pageSize],
    queryFn: () => vehicleApi.getAll({ page, size: pageSize }),
    select: (res) => res.data.data,
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => vehicleApi.delete(id),
    onSuccess: () => {
      notify.success('Vehicle removed');
      queryClient.invalidateQueries(['vehicles']);
      setDeleteId(null);
    },
    onError: handleError,
  });

  const columns = [
    { field: 'vin', headerName: 'VIN', width: 180 },
    { field: 'model', headerName: 'Model', width: 120 },
    { field: 'variant', headerName: 'Variant', width: 120 },
    { field: 'color', headerName: 'Color', width: 100 },
    { field: 'modelYear', headerName: 'Year', width: 80 },
    { field: 'price', headerName: 'Price', width: 120, valueFormatter: ({ value }) => value ? `₩${Number(value).toLocaleString()}` : '-' },
    { field: 'dealerName', headerName: 'Dealer', flex: 1 },
    {
      field: 'status', headerName: 'Status', width: 120,
      renderCell: ({ value }) => <Chip label={value} size="small" color={statusColors[value] || 'default'} />,
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
          <Tooltip title="Remove">
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
      <PageHeader title="Vehicles" onAdd={() => { setEditData(null); setFormOpen(true); }} />
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
      <VehicleFormDialog open={formOpen} onClose={() => setFormOpen(false)} editData={editData} />
      <ConfirmDialog
        open={!!deleteId}
        message="Remove this vehicle from inventory?"
        onConfirm={() => deleteMutation.mutate(deleteId)}
        onCancel={() => setDeleteId(null)}
      />
    </Box>
  );
}
