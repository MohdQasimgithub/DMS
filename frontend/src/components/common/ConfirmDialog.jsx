import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, Box } from '@mui/material';
import { WarningAmber } from '@mui/icons-material';

export default function ConfirmDialog({ open, title, message, onConfirm, onCancel }) {
  return (
    <Dialog open={open} onClose={onCancel} maxWidth="xs" fullWidth
      PaperProps={{ sx: { borderRadius: 3, p: 0.5 } }}>
      <DialogTitle sx={{ pb: 1 }}>
        <Box display="flex" alignItems="center" gap={1.5}>
          <Box sx={{ width: 36, height: 36, borderRadius: 2, bgcolor: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <WarningAmber sx={{ color: '#ef4444', fontSize: 20 }} />
          </Box>
          {title || 'Confirm Action'}
        </Box>
      </DialogTitle>
      <DialogContent sx={{ pt: 0 }}>
        <DialogContentText sx={{ fontSize: '0.9rem', color: '#64748b' }}>
          {message || 'Are you sure you want to proceed? This action cannot be undone.'}
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
        <Button onClick={onCancel} variant="outlined" sx={{ borderColor: '#e2e8f0', color: '#64748b', '&:hover': { borderColor: '#94a3b8', bgcolor: '#f8fafc' } }}>
          Cancel
        </Button>
        <Button onClick={onConfirm} variant="contained" color="error"
          sx={{ background: 'linear-gradient(135deg, #ef4444, #dc2626)', '&:hover': { background: 'linear-gradient(135deg, #dc2626, #b91c1c)' } }}>
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
}
