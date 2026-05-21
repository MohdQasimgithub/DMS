import { Box, Typography, Button, Breadcrumbs } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

// ============================================
// PageHeader - Reusable page header component
// ============================================
// Displays page title, optional subtitle, and Add button
export default function PageHeader({ title, subtitle, onAdd, addLabel = 'Add New' }) {
  return (
    <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
      {/* Title and subtitle */}
      <Box>
        <Typography variant="h5" fontWeight={800} color="text.primary" lineHeight={1.2}>
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="body2" color="text.secondary" mt={0.3}>{subtitle}</Typography>
        )}
      </Box>
      
      {/* Add button with gradient styling */}
      {onAdd && (
        <Button variant="contained" startIcon={<AddIcon />} onClick={onAdd}
          sx={{
            background: 'linear-gradient(135deg, #002C5F, #1a4a7a)',
            '&:hover': { background: 'linear-gradient(135deg, #001a3a, #002C5F)' },
            px: 2.5, py: 1,
          }}>
          {addLabel}
        </Button>
      )}
    </Box>
  );
}
