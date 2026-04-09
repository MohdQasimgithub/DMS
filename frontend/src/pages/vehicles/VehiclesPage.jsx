import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Chip, IconButton, Tooltip, MenuItem, TextField } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import PageHeader from '../../components/common/PageHeader';
import SearchBar from '../../components/common/SearchBar';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import VehicleFormDialog from './VehicleFormDialog';
import { vehicleApi } from '../../api/vehicleApi';
import { useNotify } from '../../hooks/useNotify';
import { useApiError } from '../../hooks/useApiError';

const statusColors = { AVAILABLE: 'success', RESERVED: 'warning', SOLD: 'error', IN_TRANSIT: 'info' };

export default function VehiclesPage() {
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const queryClient = useQueryClient();
  const notify = useNotify();
  const { handleError } = useApiError();

  const { data, isLoading } = useQuery({
    queryKey: ['vehicles', page, pageSize, search, statusFilter],
    queryFn: () => vehicleApi.getAll({ page, size: pageSize, search, status: statusFilter || undefined }),
    select: (res) => res.data.data,
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => vehicleApi.delete(id),
    onSuccess: () => {
      notify.success('Vehicle removed');
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      setDeleteId(null);
    },
    onError: handleError,
  });

  const columns = [
    { field: 'vin', headerName: 'VIN', width: 180 },
    { field: 'model', headerName: 'Model', width: 120 },
    { field: 'variant', headerName: 'Variant', width: 130 },
    { field: 'color', headerName: 'Color', width: 110 },
    { field: 'modelYear', headerName: 'Year', width: 70 },
    { field: 'price', headerName: 'Price (₩)', width: 130, valueFormatter: ({ value }) => value ? Number(value).toLocaleString() : '-' },
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

      <Box display="flex" gap={2} mb={2} flexWrap="wrap">
        <SearchBar placeholder="Search by VIN, model, variant, color, dealer..." onSearch={(v) => { setSearch(v); setPage(0); }} />
        <TextField select size="small" label="Status" value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(0); }} sx={{ minWidth: 150 }}>
          <MenuItem value="">All Status</MenuItem>
          <MenuItem value="AVAILABLE">Available</MenuItem>
          <MenuItem value="RESERVED">Reserved</MenuItem>
          <MenuItem value="SOLD">Sold</MenuItem>
          <MenuItem value="IN_TRANSIT">In Transit</MenuItem>
        </TextField>
      </Box>

      <DataGrid
        rows={data?.content || []}
        columns={columns}
        rowCount={data?.totalElements || 0}
        loading={isLoading}
        paginationMode="server"
        paginationModel={{ page, pageSize }}
        onPaginationModelChange={({ page: p, pageSize: ps }) => { setPage(p); setPageSize(ps); }}
        pageSizeOptions={[5, 10, 25, 50]}
        autoHeight
        disableRowSelectionOnClick
      />

      <VehicleFormDialog open={formOpen} onClose={() => setFormOpen(false)} editData={editData} />
      <ConfirmDialog open={!!deleteId} message="Remove this vehicle?"
        onConfirm={() => deleteMutation.mutate(deleteId)} onCancel={() => setDeleteId(null)} />
    </Box>
  );
}
