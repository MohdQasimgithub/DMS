import { useState } from 'react';
import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Chip, IconButton, Tooltip, MenuItem, TextField } from '@mui/material';
import { Edit, Close } from '@mui/icons-material';
import PageHeader from '../../components/common/PageHeader';
import SearchBar from '../../components/common/SearchBar';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import EnquiryFormDialog from './EnquiryFormDialog';
import { enquiryApi } from '../../api/enquiryApi';
import { useNotify } from '../../hooks/useNotify';
import { useApiError } from '../../hooks/useApiError';
import { useAuthStore } from '../../store/authStore';
import { formatDateTime } from '../../utils/dateUtils';

const statusColors = { NEW: 'info', IN_PROGRESS: 'warning', RESOLVED: 'success', CLOSED: 'default' };
const typeColors = { PURCHASE: 'primary', TEST_DRIVE: 'secondary', FINANCING: 'warning', SERVICE: 'info', GENERAL: 'default' };

export default function EnquiriesPage() {
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [closeId, setCloseId] = useState(null);
  const queryClient = useQueryClient();
  const notify = useNotify();
  const { handleError } = useApiError();
  const { hasRole } = useAuthStore();
  const isEmployee = hasRole('EMPLOYEE') && !hasRole('ADMIN') && !hasRole('DEALER');

  const { data, isLoading } = useQuery({
    queryKey: ['enquiries', paginationModel.page, paginationModel.pageSize, search, statusFilter, typeFilter],
    queryFn: () => enquiryApi.getAll({
      page: paginationModel.page,
      size: paginationModel.pageSize,
      search,
      status: statusFilter || undefined,
      type: typeFilter || undefined,
    }),
    select: (res) => res.data.data,
    placeholderData: keepPreviousData,
  });

  const closeMutation = useMutation({
    mutationFn: (id) => enquiryApi.delete(id),
    onSuccess: () => {
      notify.success('Enquiry closed');
      queryClient.invalidateQueries({ queryKey: ['enquiries'] });
      setCloseId(null);
    },
    onError: handleError,
  });

  const columns = [
    { field: 'customerName', headerName: 'Customer', width: 140 },
    { field: 'customerPhone', headerName: 'Phone', width: 130 },
    { field: 'vehicleModel', headerName: 'Vehicle', width: 120 },
    { field: 'dealerName', headerName: 'Dealer', flex: 1 },
    {
      field: 'enquiryType', headerName: 'Type', width: 120,
      renderCell: ({ value }) => <Chip label={value?.replace('_', ' ')} size="small" color={typeColors[value] || 'default'} />,
    },
    {
      field: 'status', headerName: 'Status', width: 120,
      renderCell: ({ value }) => <Chip label={value?.replace('_', ' ')} size="small" color={statusColors[value] || 'default'} />,
    },
    { field: 'createdAt', headerName: 'Received', width: 160, valueFormatter: (value) => formatDateTime(value) },
    {
      field: 'actions', headerName: 'Actions', width: 100, sortable: false,
      renderCell: ({ row }) => (
        <>
          <Tooltip title="Edit / Respond">
            <IconButton size="small" onClick={() => { setEditData(row); setFormOpen(true); }}>
              <Edit fontSize="small" />
            </IconButton>
          </Tooltip>
          {row.status !== 'CLOSED' && (
            <Tooltip title="Close">
              <IconButton size="small" color="error" onClick={() => setCloseId(row.id)}>
                <Close fontSize="small" />
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
        title={isEmployee ? 'My Enquiries' : 'Enquiries'}
        subtitle={isEmployee ? 'You can only see and manage your own submissions' : undefined}
        onAdd={() => { setEditData(null); setFormOpen(true); }}
        addLabel="New Enquiry"
      />

      <Box display="flex" gap={2} mb={2} flexWrap="wrap" sx={{
        flexDirection: { xs: 'column', sm: 'row' },
        gap: { xs: 1.5, sm: 2 }
      }}>
        <SearchBar placeholder="Search by customer, phone, vehicle, dealer..."
          onSearch={(v) => { setSearch(v); setPaginationModel(m => ({ ...m, page: 0 })); }} />
        <TextField select size="small" label="Status" value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPaginationModel(m => ({ ...m, page: 0 })); }}
          sx={{ minWidth: { xs: '100%', sm: 140 } }}>
          <MenuItem value="">All Status</MenuItem>
          <MenuItem value="NEW">New</MenuItem>
          <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
          <MenuItem value="RESOLVED">Resolved</MenuItem>
          <MenuItem value="CLOSED">Closed</MenuItem>
        </TextField>
        <TextField select size="small" label="Type" value={typeFilter}
          onChange={(e) => { setTypeFilter(e.target.value); setPaginationModel(m => ({ ...m, page: 0 })); }}
          sx={{ minWidth: { xs: '100%', sm: 140 } }}>
          <MenuItem value="">All Types</MenuItem>
          <MenuItem value="PURCHASE">Purchase</MenuItem>
          <MenuItem value="TEST_DRIVE">Test Drive</MenuItem>
          <MenuItem value="FINANCING">Financing</MenuItem>
          <MenuItem value="SERVICE">Service</MenuItem>
          <MenuItem value="GENERAL">General</MenuItem>
        </TextField>
      </Box>

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

      <EnquiryFormDialog open={formOpen} onClose={() => setFormOpen(false)} editData={editData} />
      <ConfirmDialog open={!!closeId} title="Close Enquiry" message="Mark this enquiry as closed?"
        onConfirm={() => closeMutation.mutate(closeId)} onCancel={() => setCloseId(null)} />
    </Box>
  );
}
