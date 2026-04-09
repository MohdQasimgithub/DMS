import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Chip, MenuItem, TextField, Typography, Paper } from '@mui/material';
import { CheckCircle, Cancel, Lock } from '@mui/icons-material';
import PageHeader from '../../components/common/PageHeader';
import SearchBar from '../../components/common/SearchBar';
import { loginHistoryApi } from '../../api/loginHistoryApi';

const statusConfig = {
  SUCCESS: { color: 'success', icon: <CheckCircle sx={{ fontSize: 14 }} />, bg: '#d1fae5', text: '#059669' },
  FAILED:  { color: 'error',   icon: <Cancel sx={{ fontSize: 14 }} />,      bg: '#fee2e2', text: '#dc2626' },
  LOCKED:  { color: 'warning', icon: <Lock sx={{ fontSize: 14 }} />,        bg: '#fef3c7', text: '#d97706' },
};

const roleColors = { ADMIN: '#ef4444', DEALER: '#3b82f6', EMPLOYEE: '#10b981' };

export default function LoginHistoryPage() {
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['login-history', page, pageSize, search, statusFilter],
    queryFn: () => loginHistoryApi.getAll({ page, size: pageSize, search, status: statusFilter || undefined }),
    select: (res) => res.data.data,
    refetchInterval: 30000,
  });

  const columns = [
    {
      field: 'loginTime', headerName: 'Date & Time', width: 180,
      valueFormatter: ({ value }) => value ? new Date(value).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) : '-',
    },
    {
      field: 'username', headerName: 'Username', width: 150,
      renderCell: ({ value }) => (
        <Typography variant="body2" fontWeight={600} color="text.primary">{value}</Typography>
      ),
    },
    {
      field: 'roles', headerName: 'Role(s)', width: 200,
      renderCell: ({ value }) => (
        <Box display="flex" gap={0.5} flexWrap="wrap">
          {(value || '').split(',').map(r => r.trim()).filter(Boolean).map(r => (
            <Chip key={r} label={r} size="small"
              sx={{ height: 18, fontSize: '0.65rem', fontWeight: 700,
                bgcolor: `${roleColors[r] || '#64748b'}20`, color: roleColors[r] || '#64748b' }} />
          ))}
        </Box>
      ),
    },
    {
      field: 'status', headerName: 'Status', width: 130,
      renderCell: ({ value }) => {
        const cfg = statusConfig[value] || {};
        return (
          <Box display="flex" alignItems="center" gap={0.5}
            sx={{ px: 1.5, py: 0.3, borderRadius: 5, bgcolor: cfg.bg, color: cfg.text }}>
            {cfg.icon}
            <Typography variant="caption" fontWeight={700}>{value}</Typography>
          </Box>
        );
      },
    },
    { field: 'ipAddress', headerName: 'IP Address', width: 140 },
    {
      field: 'failureReason', headerName: 'Failure Reason', flex: 1,
      renderCell: ({ value }) => value ? (
        <Typography variant="caption" color="error.main">{value}</Typography>
      ) : (
        <Typography variant="caption" color="success.main">—</Typography>
      ),
    },
  ];

  const successCount = data?.content?.filter(r => r.status === 'SUCCESS').length || 0;
  const failedCount  = data?.content?.filter(r => r.status === 'FAILED').length || 0;
  const lockedCount  = data?.content?.filter(r => r.status === 'LOCKED').length || 0;

  return (
    <Box>
      <PageHeader title="Login History" subtitle="Track all login attempts across all users and roles" />

      {/* Summary chips */}
      <Box display="flex" gap={1.5} mb={2.5} flexWrap="wrap">
        <Paper sx={{ px: 2, py: 1, borderRadius: 2, display: 'flex', alignItems: 'center', gap: 1, border: '1px solid #d1fae5' }}>
          <CheckCircle sx={{ fontSize: 16, color: '#059669' }} />
          <Typography variant="body2" fontWeight={700} color="#059669">{data?.totalElements || 0} Total Records</Typography>
        </Paper>
        <Paper sx={{ px: 2, py: 1, borderRadius: 2, display: 'flex', alignItems: 'center', gap: 1, border: '1px solid #d1fae5' }}>
          <CheckCircle sx={{ fontSize: 16, color: '#059669' }} />
          <Typography variant="body2" fontWeight={600} color="text.secondary">{successCount} Successful</Typography>
        </Paper>
        <Paper sx={{ px: 2, py: 1, borderRadius: 2, display: 'flex', alignItems: 'center', gap: 1, border: '1px solid #fee2e2' }}>
          <Cancel sx={{ fontSize: 16, color: '#dc2626' }} />
          <Typography variant="body2" fontWeight={600} color="text.secondary">{failedCount} Failed</Typography>
        </Paper>
        <Paper sx={{ px: 2, py: 1, borderRadius: 2, display: 'flex', alignItems: 'center', gap: 1, border: '1px solid #fef3c7' }}>
          <Lock sx={{ fontSize: 16, color: '#d97706' }} />
          <Typography variant="body2" fontWeight={600} color="text.secondary">{lockedCount} Locked</Typography>
        </Paper>
      </Box>

      {/* Filters */}
      <Box display="flex" gap={2} mb={2} flexWrap="wrap">
        <SearchBar placeholder="Search by username or role..." onSearch={(v) => { setSearch(v); setPage(0); }} />
        <TextField select size="small" label="Status" value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(0); }} sx={{ minWidth: 140, '& .MuiOutlinedInput-root': { bgcolor: '#fff' } }}>
          <MenuItem value="">All Status</MenuItem>
          <MenuItem value="SUCCESS">Success</MenuItem>
          <MenuItem value="FAILED">Failed</MenuItem>
          <MenuItem value="LOCKED">Locked</MenuItem>
        </TextField>
      </Box>

      <Paper sx={{ borderRadius: 2, overflow: 'hidden', border: '1px solid #f1f5f9' }}>
        <DataGrid
          rows={data?.content || []}
          columns={columns}
          rowCount={data?.totalElements || 0}
          loading={isLoading}
          paginationMode="server"
          paginationModel={{ page, pageSize }}
          onPaginationModelChange={({ page: p, pageSize: ps }) => { setPage(p); setPageSize(ps); }}
          pageSizeOptions={[10, 20, 50]}
          autoHeight
          disableRowSelectionOnClick
          sx={{
            border: 'none',
            '& .MuiDataGrid-row': {
              '&:hover': { bgcolor: '#f8fafc' },
            },
          }}
        />
      </Paper>

      <Typography variant="caption" color="text.secondary" mt={1} display="block">
        Auto-refreshes every 30 seconds. Only visible to ADMIN.
      </Typography>
    </Box>
  );
}
