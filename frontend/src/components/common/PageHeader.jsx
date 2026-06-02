import { Box, Typography, Button, Breadcrumbs } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

// ============================================
// PageHeader - Reusable page header component
// ============================================
// Displays page title, optional subtitle, and Add button
export default function PageHeader({ title, subtitle, onAdd, addLabel = 'Add New' }) {
  return (
    <Box display="flex" justifyContent="space-between" alignItems="center" mb={{ xs: 2, sm: 3 }} flexWrap="wrap" gap={2}>
      {/* Title and subtitle */}
      <Box flex={1} minWidth={{ xs: '100%', sm: 'auto' }}>
        <Typography variant="h5" fontWeight={800} color="text.primary" lineHeight={1.2}
          sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="body2" color="text.secondary" mt={0.3}
            sx={{ fontSize: { xs: '0.813rem', sm: '0.875rem' } }}>
            {subtitle}
          </Typography>
        )}
      </Box>
      
      {/* Add button with gradient styling */}
      {onAdd && (
        <Button 
          variant="contained" 
          startIcon={<AddIcon />} 
          onClick={onAdd}
          fullWidth={false}
          sx={{
            background: 'linear-gradient(135deg, #002C5F, #1a4a7a)',
            '&:hover': { background: 'linear-gradient(135deg, #001a3a, #002C5F)' },
            px: { xs: 2, sm: 2.5 }, 
            py: { xs: 0.75, sm: 1 },
            fontSize: { xs: '0.813rem', sm: '0.875rem' },
            minWidth: { xs: 'auto', sm: 'auto' },
          }}>
          <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>{addLabel}</Box>
          <Box component="span" sx={{ display: { xs: 'inline', sm: 'none' } }}>Add</Box>
        </Button>
      )}
    </Box>
  );
}
