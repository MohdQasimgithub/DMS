import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Box, Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, IconButton, Tooltip, Chip,
} from '@mui/material';
import { Edit, Delete, SubdirectoryArrowRight } from '@mui/icons-material';
import PageHeader from '../../components/common/PageHeader';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import MenuFormDialog from './MenuFormDialog';
import { menuApi } from '../../api/menuApi';
import { useNotify } from '../../hooks/useNotify';
import { useApiError } from '../../hooks/useApiError';

export default function MenusPage() {
  const [formOpen, setFormOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const queryClient = useQueryClient();
  const notify = useNotify();
  const { handleError } = useApiError();

  const { data: menus, isLoading } = useQuery({
    queryKey: ['menus-all'],
    queryFn: () => menuApi.getAll(),
    select: (res) => res.data.data,
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => menuApi.delete(id),
    onSuccess: () => { notify.success('Menu deactivated'); queryClient.invalidateQueries(['menus-all']); setDeleteId(null); },
    onError: handleError,
  });

  return (
    <Box>
      <PageHeader title="Menus" onAdd={() => { setEditData(null); setFormOpen(true); }} />
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Menu Name</TableCell>
              <TableCell>Code</TableCell>
              <TableCell>URL</TableCell>
              <TableCell>Order</TableCell>
              <TableCell>Parent</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(menus || []).map((menu) => (
              <TableRow key={menu.id} hover>
                <TableCell>
                  {menu.parentId && <SubdirectoryArrowRight fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />}
                  {menu.menuName}
                </TableCell>
                <TableCell>{menu.menuCode}</TableCell>
                <TableCell>{menu.url || '-'}</TableCell>
                <TableCell>{menu.sortOrder}</TableCell>
                <TableCell>{menu.parentId ? `#${menu.parentId}` : 'Root'}</TableCell>
                <TableCell>
                  <Chip label={menu.active ? 'Active' : 'Inactive'} size="small"
                    color={menu.active ? 'success' : 'default'} />
                </TableCell>
                <TableCell>
                  <Tooltip title="Edit">
                    <IconButton size="small" onClick={() => { setEditData(menu); setFormOpen(true); }}>
                      <Edit fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Deactivate">
                    <IconButton size="small" color="error" onClick={() => setDeleteId(menu.id)}>
                      <Delete fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <MenuFormDialog open={formOpen} onClose={() => setFormOpen(false)} editData={editData} />
      <ConfirmDialog
        open={!!deleteId}
        message="Deactivate this menu item?"
        onConfirm={() => deleteMutation.mutate(deleteId)}
        onCancel={() => setDeleteId(null)}
      />
    </Box>
  );
}
