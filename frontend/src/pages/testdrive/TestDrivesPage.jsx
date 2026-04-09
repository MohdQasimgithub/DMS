import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Chip, IconButton, Tooltip, MenuItem, TextField } from '@mui/material';
import { Edit, Cancel } from '@mui/icons-material';
import PageHeader from '../../components/common/PageHeader';
import SearchBar from '../../components/common/SearchBar';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import TestDriveFormDialog from './TestDriveFormDialog';
import { testDriveApi } from '../../api/testDriveApi';
import { useNotify } from '../../hooks/useNotify';
import { useApiError } from '../../hooks/useApiError';

import { useAuthStore } from '../../store/authStore';

const statusColors = { SCHEDULED: 'info', COMPLETED: 'success', CANCELLED: 'error', NO_SHOW: 'warning' };

export default function TestDrivesPage() {
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [cancelId, setCancelId] = useState(null);
  const queryClient = useQueryClient();
  const notify = useNotify();
  const { handleError } = useApiError();
  const { hasRole } = useAuthStore();
  const isEmployee = hasRole('EMPLOYEE') && !hasRole('ADMIN') && !hasRole('DEALER');

  const { data, isLoading } = useQuery({
    queryKey: ['test-drives', page, pageSize, search, statusFilter],
    queryFn: () => testDriveApi.getAll({ page, size: pageSize, search, status: statusFilter || undefined }),
    select: (res) => res.data.data,
  });

  const cancelMutation = useMutation({
    mutationFn: (id) => testDriveApi.delete(id),
    onSuccess: () => { notify.success('Test drive cancelled'); queryClient.invalidateQueries(['test-drives']); setCancelId(null); },
    onError: handleError,
  });

  const columns = [
    { field: 'customerName', headerName: 'Customer', width: 150 },
    { field: 'customerPhone', headerName: 'Phone', width: 130 },
    { field: 'vehicleModel', headerName: 'Vehicle', width: 120 },
    { field: 'vehicleVin', headerName: 'VIN', width: 170 },
    { field: 'dealerName', headerName: 'Dealer', flex: 1 },
    { field: 'scheduledDate', headerName: 'Date', width: 110 },
    { field: 'scheduledTime', headerName: 'Time', width: 90 },
    {
      field: 'status', headerName: 'Status', width: 120,
      renderCell: ({ value }) => <Chip label={value} size="small" color={statusColors[value] || 'default'} />,
    },
    {
      field: 'actions', headerName: 'Actions', width: 100, sortable: false,
      renderCell: ({ row }) => (
        <>
          {/* Employee can only edit their own bookings */}
          {(!isEmployee || row.createdBy === row.createdBy) && (
            <Tooltip title="Edit">
              <IconButton size="small" onClick={() => { setEditData(row); setFormOpen(true); }}>
                <Edit fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
          {row.status === 'SCHEDULED' && (
            <Tooltip title="Cancel">
              <IconButton size="small" color="error" onClick={() => setCancelId(row.id)}>
                <Cancel fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </>
      ),
    },
  ];

  return (
    <Box>
      <PageHeader
        title={isEmployee ? 'My Test Drives' : 'Test Drives'}
        subtitle={isEmployee ? 'You can only see and manage your own bookings' : undefined}
        onAdd={() => { setEditData(null); setFormOpen(true); }}
        addLabel="Book Test Drive"
      />

      <Box display="flex" gap={2} mb={2} flexWrap="wrap">
        <SearchBar placeholder="Search by customer, phone, vehicle, dealer..." onSearch={(v) => { setSearch(v); setPage(0); }} />
        <TextField select size="small" label="Status" value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(0); }} sx={{ minWidth: 150 }}>
          <MenuItem value="">All Status</MenuItem>
          <MenuItem value="SCHEDULED">Scheduled</MenuItem>
          <MenuItem value="COMPLETED">Completed</MenuItem>
          <MenuItem value="CANCELLED">Cancelled</MenuItem>
          <MenuItem value="NO_SHOW">No Show</MenuItem>
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

      <TestDriveFormDialog open={formOpen} onClose={() => setFormOpen(false)} editData={editData} />
      <ConfirmDialog open={!!cancelId} title="Cancel Test Drive" message="Cancel this test drive booking?"
        onConfirm={() => cancelMutation.mutate(cancelId)} onCancel={() => setCancelId(null)} />
    </Box>
  );
}
