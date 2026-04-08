import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Box, Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, IconButton, Tooltip, TextField, Chip,
} from '@mui/material';
import { Edit, Save, Cancel } from '@mui/icons-material';
import PageHeader from '../../components/common/PageHeader';
import axiosInstance from '../../api/axiosInstance';
import { useNotify } from '../../hooks/useNotify';
import { useApiError } from '../../hooks/useApiError';

export default function ConfigsPage() {
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState('');
  const queryClient = useQueryClient();
  const notify = useNotify();
  const { handleError } = useApiError();

  const { data: configs, isLoading } = useQuery({
    queryKey: ['configs'],
    queryFn: () => axiosInstance.get('/v1/configs'),
    select: (res) => res.data.data,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, value }) => axiosInstance.put(`/v1/configs/${id}`, null, { params: { value } }),
    onSuccess: () => {
      notify.success('Config updated');
      queryClient.invalidateQueries(['configs']);
      setEditingId(null);
    },
    onError: handleError,
  });

  return (
    <Box>
      <PageHeader title="Configurations" />
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Key</TableCell>
              <TableCell>Value</TableCell>
              <TableCell>Group</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Editable</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(configs || []).map((config) => (
              <TableRow key={config.id} hover>
                <TableCell><strong>{config.configKey}</strong></TableCell>
                <TableCell>
                  {editingId === config.id ? (
                    <TextField size="small" value={editValue} onChange={(e) => setEditValue(e.target.value)} />
                  ) : config.configValue}
                </TableCell>
                <TableCell>{config.configGroup}</TableCell>
                <TableCell>{config.description}</TableCell>
                <TableCell>
                  <Chip label={config.editable ? 'Yes' : 'No'} size="small"
                    color={config.editable ? 'success' : 'default'} />
                </TableCell>
                <TableCell>
                  {config.editable && (
                    editingId === config.id ? (
                      <>
                        <Tooltip title="Save">
                          <IconButton size="small" color="primary"
                            onClick={() => updateMutation.mutate({ id: config.id, value: editValue })}>
                            <Save fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Cancel">
                          <IconButton size="small" onClick={() => setEditingId(null)}>
                            <Cancel fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </>
                    ) : (
                      <Tooltip title="Edit">
                        <IconButton size="small"
                          onClick={() => { setEditingId(config.id); setEditValue(config.configValue); }}>
                          <Edit fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
