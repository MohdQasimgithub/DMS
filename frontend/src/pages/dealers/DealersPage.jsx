import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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
  const { hasRole } = useAuthStore();
  const isAdmin = hasRole('ADMIN');

  // Keyboard shortcuts: Ctrl+N = new dealer (admin only), Escape = close form
  useKeyboardShortcuts({
    onNew: isAdmin ? () => { setEditData(null); setFormOpen(true); } : undefined,
    onClose: () => setFormOpen(false),
  });

  const { data, isLoading } = useQuery({
    queryKey: ['dealers', page, pageSize, search, statusFilter],
    queryFn: () => dealerApi.getAll({ page, size: pageSize, search, status: statusFilter || undefined }),
    select: (res) => res.data.data,
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => dealerApi.delete(id),
    onSuccess: () => {
      notify.success('Dealer deactivated');
      queryClient.invalidateQueries({ queryKey: ['dealers'] });
      setDeleteId(null);
    },
    onError: handleError,
  });

  const columns = [
    { field: 'dealerCode', headerName: 'Code', width: 130 },
    { field: 'dealerName', headerName: 'Name', flex: 1 },
    { field: 'city', headerName: 'City', width: 110 },
    { field: 'region', headerName: 'Region', width: 110 },
    { field: 'phone', headerName: 'Phone', width: 130 },
    { field: 'managerName', headerName: 'Manager', width: 140 },
    {
      field: 'status', headerName: 'Status', width: 120,
      renderCell: ({ value }) => (
        <Chip label={value} size="small"
          color={value === 'ACTIVE' ? 'success' : value === 'SUSPENDED' ? 'warning' : 'default'} />
      ),
    },
    {
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

  return (
    <Box>
      <PageHeader title="Dealers" onAdd={isAdmin ? () => { setEditData(null); setFormOpen(true); } : undefined} />

      <Box display="flex" gap={2} mb={2} flexWrap="wrap">
        <SearchBar placeholder="Search by name, code, city, region, manager..." onSearch={(v) => { setSearch(v); setPage(0); }} />
        <TextField select size="small" label="Status" value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(0); }} sx={{ minWidth: 140 }}>
          <MenuItem value="">All Status</MenuItem>
          <MenuItem value="ACTIVE">Active</MenuItem>
          <MenuItem value="INACTIVE">Inactive</MenuItem>
          <MenuItem value="SUSPENDED">Suspended</MenuItem>
        </TextField>
      </Box>

      <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
        <Typography variant="caption" color="text.secondary">
          Tip: Press <strong>Ctrl+N</strong> to add new dealer. Double-click status to edit inline.
        </Typography>
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
        processRowUpdate={isAdmin ? async (newRow) => {
          await dealerApi.update(newRow.id, newRow);
          notify.success('Dealer updated');
          queryClient.invalidateQueries({ queryKey: ['dealers'] });
          return newRow;
        } : undefined}
        onProcessRowUpdateError={handleError}
      />

      <DealerFormDialog open={formOpen} onClose={() => setFormOpen(false)} editData={editData} />
      <ConfirmDialog open={!!deleteId} message="Deactivate this dealer?"
        onConfirm={() => deleteMutation.mutate(deleteId)} onCancel={() => setDeleteId(null)} />
    </Box>
  );
}
