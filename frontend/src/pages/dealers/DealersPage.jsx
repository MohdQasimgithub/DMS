// ============================================================================
// DEALERS PAGE - Dealer management with CRUD operations
// ============================================================================
// Features: Server-side pagination, search, filtering, inline editing,
//           keyboard shortcuts, role-based access control
// ============================================================================

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Chip, IconButton, Tooltip, MenuItem, TextField, Typography } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import PageHeader from '../../components/common/PageHeader';
import SearchBar from '../../components/common/SearchBar';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import DealerFormDialog from './DealerFormDialog';
import { dealerApi } from '../../api/dealerApi';
import { useNotify } from '../../hooks/useNotify';
import { useApiError } from '../../hooks/useApiError';
import { useKeyboardShortcuts } from '../../hooks/useKeyboardShortcuts';
import { useAuthStore } from '../../store/authStore';

export default function DealersPage() {
  // ========== LOCAL STATE ==========
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
  const [search, setSearch] = useState('');           // Search query
  const [statusFilter, setStatusFilter] = useState(''); // Status filter
  const [formOpen, setFormOpen] = useState(false);    // Form dialog open/close
  const [editData, setEditData] = useState(null);     // Data for editing
  const [deleteId, setDeleteId] = useState(null);     // ID for deletion confirmation
  
  // ========== HOOKS ==========
  const queryClient = useQueryClient();
  const notify = useNotify();
  const { handleError } = useApiError();
  const { hasRole } = useAuthStore();
  const isAdmin = hasRole('ADMIN');

  // Keyboard shortcuts: Ctrl+N to add new, Escape to close
  useKeyboardShortcuts({
    onNew: isAdmin ? () => { setEditData(null); setFormOpen(true); } : undefined,
    onClose: () => setFormOpen(false),
  });

  // ========== DATA FETCHING (React Query) ==========
  // Fetch dealers with server-side pagination, search, and filtering
  const { data, isLoading } = useQuery({
    queryKey: ['dealers', paginationModel.page, paginationModel.pageSize, search, statusFilter],
    queryFn: () => dealerApi.getAll({
      page: paginationModel.page,
      size: paginationModel.pageSize,
      search,
      status: statusFilter || undefined,
    }),
    select: (res) => res.data.data,
    placeholderData: keepPreviousData,  // Keep old data while fetching new page (smooth UX)
  });

  // ========== MUTATIONS ==========
  // Delete dealer mutation
  const deleteMutation = useMutation({
    mutationFn: (id) => dealerApi.delete(id),
    onSuccess: () => {
      notify.success('Dealer deactivated');
      queryClient.invalidateQueries({ queryKey: ['dealers'] });  // Refetch dealers
      setDeleteId(null);
    },
    onError: handleError,
  });

  // ========== DATA GRID COLUMNS ==========
  const columns = [
    { field: 'dealerCode', headerName: 'Code', width: 130 },
    { field: 'dealerName', headerName: 'Name', flex: 1 },
    { field: 'city', headerName: 'City', width: 110 },
    { field: 'region', headerName: 'Region', width: 110 },
    { field: 'phone', headerName: 'Phone', width: 130 },
    { field: 'managerName', headerName: 'Manager', width: 140 },
    {
      // Status column with colored chips
      field: 'status', headerName: 'Status', width: 120,
      renderCell: ({ value }) => (
        <Chip label={value} size="small"
          color={value === 'ACTIVE' ? 'success' : value === 'SUSPENDED' ? 'warning' : 'default'} />
      ),
    },
    {
      // Actions column (edit, delete) - only visible to ADMIN
      field: 'actions', headerName: 'Actions', width: 100, sortable: false,
      renderCell: ({ row }) => (
        <>
          {isAdmin && (
            <Tooltip title="Edit">
              <IconButton size="small" onClick={() => { setEditData(row); setFormOpen(true); }}>
                <Edit fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
          {isAdmin && (
            <Tooltip title="Deactivate">
              <IconButton size="small" color="error" onClick={() => setDeleteId(row.id)}>
                <Delete fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </>
      ),
    },
  ];

  // ========== RENDER ==========
  return (
    <Box>
      {/* Page header with Add button (ADMIN only) */}
      <PageHeader title="Dealers" onAdd={isAdmin ? () => { setEditData(null); setFormOpen(true); } : undefined} />

      {/* Search and filter controls */}
      <Box display="flex" gap={2} mb={2} flexWrap="wrap" sx={{ 
        flexDirection: { xs: 'column', sm: 'row' },
        gap: { xs: 1.5, sm: 2 }
      }}>
        <SearchBar placeholder="Search by name, code, city, region, manager..."
          onSearch={(v) => { setSearch(v); setPaginationModel(m => ({ ...m, page: 0 })); }} />
        <TextField select size="small" label="Status" value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPaginationModel(m => ({ ...m, page: 0 })); }}
          sx={{ minWidth: { xs: '100%', sm: 140 } }}>
          <MenuItem value="">All Status</MenuItem>
          <MenuItem value="ACTIVE">Active</MenuItem>
          <MenuItem value="INACTIVE">Inactive</MenuItem>
          <MenuItem value="SUSPENDED">Suspended</MenuItem>
        </TextField>
      </Box>

      {/* Keyboard shortcut hint - hide on mobile */}
      <Box display={{ xs: 'none', sm: 'flex' }} justifyContent="space-between" alignItems="center" mb={1}>
        <Typography variant="caption" color="text.secondary">
          Tip: Press <strong>Ctrl+N</strong> to add new dealer.
        </Typography>
      </Box>

      {/* Data grid with server-side pagination and inline editing */}
      <DataGrid
        rows={data?.content || []}
        columns={columns}
        rowCount={data?.totalElements ?? 0}
        loading={isLoading}
        paginationMode="server"  // Server-side pagination
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        pageSizeOptions={[5, 10, 25, 50]}
        autoHeight
        disableRowSelectionOnClick
        // Inline editing (double-click cell to edit) - ADMIN only
        processRowUpdate={isAdmin ? async (newRow) => {
          await dealerApi.update(newRow.id, newRow);
          notify.success('Dealer updated');
          queryClient.invalidateQueries({ queryKey: ['dealers'] });
          return newRow;
        } : undefined}
        onProcessRowUpdateError={handleError}
      />

      {/* Form dialog for create/edit */}
      <DealerFormDialog open={formOpen} onClose={() => setFormOpen(false)} editData={editData} />
      
      {/* Confirmation dialog for delete */}
      <ConfirmDialog open={!!deleteId} message="Deactivate this dealer?"
        onConfirm={() => deleteMutation.mutate(deleteId)} onCancel={() => setDeleteId(null)} />
    </Box>
  );
}
