import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Box, Paper, Typography, ToggleButtonGroup, ToggleButton,
  TextField, InputAdornment, Chip, CircularProgress,
  FormControl, InputLabel, Select, MenuItem, Button, Divider,
} from '@mui/material';
import { Search, Refresh } from '@mui/icons-material';
import axiosInstance from '../../api/axiosInstance';
import PageHeader from '../../components/common/PageHeader';

const LEVEL_COLORS = {
  ERROR: 'error',
  WARN:  'warning',
  INFO:  'info',
  DEBUG: 'default',
};

function getLevel(line) {
  for (const lvl of ['ERROR', 'WARN', 'INFO', 'DEBUG']) {
    if (line.includes(` ${lvl} `)) return lvl;
  }
  return null;
}

export default function LogsPage() {
  const [logType, setLogType]     = useState('application');
  const [filterLevel, setFilter]  = useState('ALL');
  const [search, setSearch]       = useState('');
  const [lines, setLines]         = useState(300);

  const { data, isLoading, refetch, isFetching } = useQuery({
    queryKey: ['logs', logType, lines],
    queryFn: () => axiosInstance.get('/v1/logs', { params: { type: logType, lines } }),
    select: (res) => res.data.lines,
    refetchInterval: 30000, // auto-refresh every 30s
  });

  const displayed = (data || []).filter((line) => {
    const levelMatch = filterLevel === 'ALL' || line.includes(` ${filterLevel} `);
    const searchMatch = !search || line.toLowerCase().includes(search.toLowerCase());
    return levelMatch && searchMatch;
  });

  return (
    <Box>
      <PageHeader title="System Logs" />

      {/* Controls */}
      <Box display="flex" gap={2} flexWrap="wrap" alignItems="center" mb={2}>
        <ToggleButtonGroup value={logType} exclusive size="small"
          onChange={(_, v) => v && setLogType(v)}>
          <ToggleButton value="application">Application</ToggleButton>
          <ToggleButton value="error">Errors Only</ToggleButton>
        </ToggleButtonGroup>

        <FormControl size="small" sx={{ minWidth: 130 }}>
          <InputLabel>Level</InputLabel>
          <Select value={filterLevel} label="Level" onChange={(e) => setFilter(e.target.value)}>
            <MenuItem value="ALL">All Levels</MenuItem>
            <MenuItem value="ERROR">ERROR</MenuItem>
            <MenuItem value="WARN">WARN</MenuItem>
            <MenuItem value="INFO">INFO</MenuItem>
            <MenuItem value="DEBUG">DEBUG</MenuItem>
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Last Lines</InputLabel>
          <Select value={lines} label="Last Lines" onChange={(e) => setLines(e.target.value)}>
            <MenuItem value={100}>100</MenuItem>
            <MenuItem value={300}>300</MenuItem>
            <MenuItem value={500}>500</MenuItem>
            <MenuItem value={1000}>1000</MenuItem>
          </Select>
        </FormControl>

        <TextField size="small" placeholder="Search logs..."
          value={search} onChange={(e) => setSearch(e.target.value)}
          InputProps={{ startAdornment: <InputAdornment position="start"><Search fontSize="small" /></InputAdornment> }}
          sx={{ minWidth: 220 }} />

        <Button variant="outlined" size="small" startIcon={<Refresh />}
          onClick={() => refetch()} disabled={isFetching}>
          Refresh
        </Button>

        <Typography variant="caption" color="text.secondary">
          Showing {displayed.length} / {(data || []).length} lines
          {isFetching && <CircularProgress size={12} sx={{ ml: 1 }} />}
        </Typography>
      </Box>

      {/* Log output */}
      <Paper variant="outlined" sx={{
        bgcolor: '#0d1117', color: '#c9d1d9',
        fontFamily: 'monospace', fontSize: '0.75rem',
        p: 2, maxHeight: '65vh', overflowY: 'auto',
        borderRadius: 2,
      }}>
        {isLoading ? (
          <Box display="flex" justifyContent="center" p={4}>
            <CircularProgress />
          </Box>
        ) : displayed.length === 0 ? (
          <Typography color="grey.500">No log entries match your filter.</Typography>
        ) : (
          displayed.map((line, i) => {
            const level = getLevel(line);
            const color = level === 'ERROR' ? '#ff7b72'
                        : level === 'WARN'  ? '#e3b341'
                        : level === 'INFO'  ? '#79c0ff'
                        : level === 'DEBUG' ? '#8b949e'
                        : '#c9d1d9';
            return (
              <Box key={i} sx={{ color, lineHeight: 1.6, whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
                {line}
              </Box>
            );
          })
        )}
      </Paper>

      <Typography variant="caption" color="text.secondary" mt={1} display="block">
        Auto-refreshes every 30 seconds. Only visible to ADMIN.
      </Typography>
    </Box>
  );
}
