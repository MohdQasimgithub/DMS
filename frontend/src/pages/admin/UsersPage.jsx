import { useState } from 'react';
import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Chip, IconButton, Tooltip } from '@mui/material';
import { Edit, Delete, LockOpen } from '@mui/icons-material';
import PageHeader from '../../components/common/PageHeader';
import SearchBar from '../../components/common/SearchBar';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import UserFormDialog from './UserFormDialog';
import { userApi } from '../../api/userApi';
import { useNotify } from '../../hooks/useNotify';
import { useApiError } from '../../hooks/useApiError';
import { useAuthStore } from '../../store/authStore';

// ============================================
// UsersPage - User management (Admin & Dealer)
// ============================================
// Features: Server-side pagination, search, unlock account, role-based access
// Admin: Can manage all users
// Dealer: Can only manage employees

export default function UsersPage() {
  // ============================================
  // State Management
  // ============================================
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
  const [search, setSearch] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const queryClient = useQueryClient();
  const notify = useNotify();
  const { handleError } = useApiError();
  const { hasRole } = useAuthStore();
  const isAdmin = hasRole('ADMIN');

  // ============================================
  // Data Fetching - Server-side pagination
  // ============================================
  const { data, isLoading } = useQuery({
    queryKey: ['users', paginationModel.page, paginationModel.pageSize, search],
    queryFn: () => userApi.getAll({ page: paginationModel.page, size: paginationModel.pageSize, search }),
    select: (res) => res.data.data,
    placeholderData: keepPreviousData,
  });

  // ============================================
  // Mutations
  // ============================================
  
  // Delete/deactivate user
  const deleteMutation = useMutation({
    mutationFn: (id) => userApi.delete(id),
    onSuccess: () => {
      notify.success('User deactivated');
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setDeleteId(null);
    },
    onError: handleError,
  });

  // Unlock account (after 5 failed login attempts)
  const unlockMutation = useMutation({
    mutationFn: (id) => userApi.unlock(id),
    onSuccess: () => {
      notify.success('Account unlocked');
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: handleError,
  });

  // ============================================
  // DataGrid Column Definitions
  // ============================================
  const columns = [
    { field: 'username', headerName: 'Username', width: 130 },
    { field: 'fullName', headerName: 'Full Name', flex: 1 },
    { field: 'email', headerName: 'Email', flex: 1 },
    {
      // Display multiple roles as chips
      field: 'roles', headerName: 'Roles', width: 200,
      renderCell: ({ value }) => (
        <Box display="flex" gap={0.5} flexWrap="wrap">
          {(value || []).map((r) => <Chip key={r} label={r} size="small" color="primary" variant="outlined" />)}
        </Box>
      ),
    },
    {
      // Status: Locked (red) / Active (green) / Inactive (gray)
      field: 'active', headerName: 'Status', width: 100,
      renderCell: ({ row }) => (
        <Chip size="small"
          label={row.accountLocked ? 'Locked' : row.active ? 'Active' : 'Inactive'}
          color={row.accountLocked ? 'error' : row.active ? 'success' : 'default'} />
      ),
    },
    {
      // Action buttons: Edit, Unlock (if locked), Deactivate
      field: 'actions', headerName: 'Actions', width: 130, sortable: false,
      renderCell: ({ row }) => (
        <>
          <Tooltip title="Edit">
            <IconButton size="small" onClick={() => { setEditData(row); setFormOpen(true); }}>
              <Edit fontSize="small" />
            </IconButton>
          </Tooltip>
          {/* Show unlock button only if account is locked */}
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

  // ============================================
  // Render
  // ============================================
  return (
    <Box>
      {/* Dynamic page header based on role */}
      <PageHeader
        title={isAdmin ? 'Users' : 'Manage Employees'}
        subtitle={isAdmin ? undefined : 'You can create and manage employee accounts'}
        onAdd={() => { setEditData(null); setFormOpen(true); }}
      />
      
      {/* Search bar */}
      <Box mb={2}>
        <SearchBar placeholder="Search by username, full name, email..."
          onSearch={(v) => { setSearch(v); setPaginationModel(m => ({ ...m, page: 0 })); }} />
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
        pageSizeOptions={[5, 10, 25]}
        autoHeight
        disableRowSelectionOnClick
      />
      
      {/* Form dialog for create/edit */}
      <UserFormDialog open={formOpen} onClose={() => setFormOpen(false)} editData={editData} isDealer={!isAdmin} />
      
      {/* Delete confirmation dialog */}
      <ConfirmDialog
        open={!!deleteId}
        message="Deactivate this user account?"
        onConfirm={() => deleteMutation.mutate(deleteId)}
        onCancel={() => setDeleteId(null)}
      />
    </Box>
  );
}
