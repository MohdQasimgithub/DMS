import { useState } from 'react';
import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
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

// ============================================
// VehiclesPage - Vehicle inventory management
// ============================================
// Features: Server-side pagination, search, status filter, CRUD operations

// Status color mapping for chips
const statusColors = { AVAILABLE: 'success', RESERVED: 'warning', SOLD: 'error', IN_TRANSIT: 'info' };

export default function VehiclesPage() {
  // ============================================
  // State Management
  // ============================================
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const queryClient = useQueryClient();
  const notify = useNotify();
  const { handleError } = useApiError();

  // ============================================
  // Data Fetching - Server-side pagination + filters
  // ============================================
  const { data, isLoading } = useQuery({
    queryKey: ['vehicles', paginationModel.page, paginationModel.pageSize, search, statusFilter],
    queryFn: () => vehicleApi.getAll({
      page: paginationModel.page,
      size: paginationModel.pageSize,
      search,
      status: statusFilter || undefined,
    }),
    select: (res) => res.data.data,
    placeholderData: keepPreviousData, // Keep previous data while fetching new page
  });

  // ============================================
  // Delete Mutation
  // ============================================
  const deleteMutation = useMutation({
    mutationFn: (id) => vehicleApi.delete(id),
    onSuccess: () => {
      notify.success('Vehicle removed');
      queryClient.invalidateQueries({ queryKey: ['vehicles'] }); // Refresh list
      setDeleteId(null);
    },
    onError: handleError,
  });

  // ============================================
  // DataGrid Column Definitions
  // ============================================
  const columns = [
    { field: 'vin', headerName: 'VIN', width: 180 },
    { field: 'model', headerName: 'Model', width: 120 },
    { field: 'variant', headerName: 'Variant', width: 130 },
    { field: 'color', headerName: 'Color', width: 110 },
    { field: 'modelYear', headerName: 'Year', width: 70 },
    // Format price with thousand separators
    { field: 'price', headerName: 'Price (₩)', width: 130, valueFormatter: (value) => value ? Number(value).toLocaleString() : '-' },
    { field: 'dealerName', headerName: 'Dealer', flex: 1 },
    {
      // Status chip with color coding
      field: 'status', headerName: 'Status', width: 120,
      renderCell: ({ value }) => <Chip label={value} size="small" color={statusColors[value] || 'default'} />,
    },
    {
      // Action buttons - Edit & Delete
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

  // ============================================
  // Render
  // ============================================
  return (
    <Box>
      {/* Page header with Add button */}
      <PageHeader title="Vehicles" onAdd={() => { setEditData(null); setFormOpen(true); }} />

      {/* Search and filter controls */}
      <Box display="flex" gap={2} mb={2} flexWrap="wrap">
        {/* Debounced search bar */}
        <SearchBar placeholder="Search by VIN, model, variant, color, dealer..."
          onSearch={(v) => { setSearch(v); setPaginationModel(m => ({ ...m, page: 0 })); }} />
        
        {/* Status filter dropdown */}
        <TextField select size="small" label="Status" value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPaginationModel(m => ({ ...m, page: 0 })); }}
          sx={{ minWidth: 150 }}>
          <MenuItem value="">All Status</MenuItem>
          <MenuItem value="AVAILABLE">Available</MenuItem>
          <MenuItem value="RESERVED">Reserved</MenuItem>
          <MenuItem value="SOLD">Sold</MenuItem>
          <MenuItem value="IN_TRANSIT">In Transit</MenuItem>
        </TextField>
      </Box>

      {/* DataGrid with server-side pagination */}
      <DataGrid
        rows={data?.content || []}
        columns={columns}
        rowCount={data?.totalElements ?? 0}
        loading={isLoading}
        paginationMode="server"
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        pageSizeOptions={[5, 10, 25, 50]}
        autoHeight
        disableRowSelectionOnClick
      />

      {/* Form dialog for create/edit */}
      <VehicleFormDialog open={formOpen} onClose={() => setFormOpen(false)} editData={editData} />
      
      {/* Delete confirmation dialog */}
      <ConfirmDialog open={!!deleteId} message="Remove this vehicle?"
        onConfirm={() => deleteMutation.mutate(deleteId)} onCancel={() => setDeleteId(null)} />
    </Box>
  );
}
