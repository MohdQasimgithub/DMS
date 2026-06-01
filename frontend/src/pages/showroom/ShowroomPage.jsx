import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Box, Grid, Card, CardContent, CardActions,
  Typography, Chip, Button, TextField, MenuItem, InputAdornment,
  Skeleton, Divider,
} from '@mui/material';
import {
  DirectionsCar, DriveEta, ContactMail,
  LocalGasStation, Speed, ColorLens, CalendarMonth,
  AttachMoney,
} from '@mui/icons-material';
import { vehicleApi } from '../../api/vehicleApi';
import SearchBar from '../../components/common/SearchBar';
import TestDriveFormDialog from '../testdrive/TestDriveFormDialog';
import EnquiryFormDialog from '../enquiry/EnquiryFormDialog';

// Unsplash car images — verified working, no CORS issues
const MODEL_IMAGES = {
  'IONIQ 6':       'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800&q=80',
  'IONIQ 5':       'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=800&q=80',
  'Tucson':        'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800&q=80',
  'Santa Fe':      'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&q=80',
  'Sonata':        'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&q=80',
  'Elantra':       'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=800&q=80',
  'Kona':          'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&q=80',
  'Kona Electric': 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=800&q=80',
  'Palisade':      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80',
  'Staria':        'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=800&q=80',
  'Venue':         'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&q=80',
};

const FALLBACK = 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=800&q=80';

// Fallback placeholder with car silhouette
// Fallback already defined above with MODEL_IMAGES

const statusConfig = {
  AVAILABLE:  { label: 'Available',  color: '#10b981', bg: '#d1fae5' },
  RESERVED:   { label: 'Reserved',   color: '#f59e0b', bg: '#fef3c7' },
  SOLD:       { label: 'Sold',       color: '#ef4444', bg: '#fee2e2' },
  IN_TRANSIT: { label: 'In Transit', color: '#3b82f6', bg: '#dbeafe' },
};

function VehicleCard({ vehicle, onTestDrive, onEnquiry }) {
  const [imgError, setImgError] = useState(false);
  const imgSrc = imgError ? FALLBACK : (MODEL_IMAGES[vehicle.model] || FALLBACK);
  const status = statusConfig[vehicle.status] || statusConfig.AVAILABLE;
  const canBook = vehicle.status === 'AVAILABLE' || vehicle.status === 'RESERVED';

  return (
    <Card sx={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      transition: 'transform 0.2s, box-shadow 0.2s',
      '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 12px 40px rgba(0,44,95,0.12)' },
    }}>
      {/* Image with fixed 16:9 aspect ratio — always same height regardless of image */}
      <Box sx={{
        position: 'relative',
        width: '100%',
        paddingTop: '56.25%', // 16:9
        overflow: 'hidden',
        bgcolor: '#f1f5f9',
        flexShrink: 0,        // never shrink the image area
      }}>
        <Box
          component="img"
          src={imgSrc}
          alt={vehicle.model}
          onError={() => setImgError(true)}
          sx={{
            position: 'absolute',
            top: 0, left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center',
          }}
        />
        {/* Status badge */}
        <Box sx={{
          position: 'absolute', top: 12, right: 12,
          px: 1.5, py: 0.4, borderRadius: 5,
          bgcolor: status.bg, color: status.color,
          fontSize: '0.7rem', fontWeight: 700,
          backdropFilter: 'blur(4px)',
        }}>
          {status.label}
        </Box>
        {/* Model year badge */}
        <Box sx={{
          position: 'absolute', top: 12, left: 12,
          px: 1.5, py: 0.4, borderRadius: 5,
          bgcolor: 'rgba(0,44,95,0.85)', color: '#fff',
          fontSize: '0.7rem', fontWeight: 700,
        }}>
          {vehicle.modelYear}
        </Box>
      </Box>

      <CardContent sx={{ flex: 1, p: 2, display: 'flex', flexDirection: 'column' }}>
        {/* Title */}
        <Typography variant="h6" fontWeight={800} color="text.primary" lineHeight={1.2}>
          {vehicle.model}
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={1.5}>
          {vehicle.variant}
        </Typography>

        {/* Price */}
        <Typography variant="h6" fontWeight={800} color="primary.main" mb={1.5}>
          ₩{vehicle.price ? Number(vehicle.price).toLocaleString() : 'Contact for price'}
        </Typography>

        <Divider sx={{ mb: 1.5 }} />

        {/* Specs grid */}
        <Grid container spacing={1}>
          <Grid item xs={6}>
            <Box display="flex" alignItems="center" gap={0.8}>
              <ColorLens sx={{ fontSize: 15, color: '#94a3b8' }} />
              <Typography variant="caption" color="text.secondary" noWrap>{vehicle.color || '—'}</Typography>
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box display="flex" alignItems="center" gap={0.8}>
              <CalendarMonth sx={{ fontSize: 15, color: '#94a3b8' }} />
              <Typography variant="caption" color="text.secondary">{vehicle.modelYear}</Typography>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Box display="flex" alignItems="center" gap={0.8}>
              <DirectionsCar sx={{ fontSize: 15, color: '#94a3b8' }} />
              <Typography variant="caption" color="text.secondary" noWrap>
                VIN: {vehicle.vin}
              </Typography>
            </Box>
          </Grid>
          {vehicle.dealerName && (
            <Grid item xs={12}>
              <Box display="flex" alignItems="center" gap={0.8}>
                <Speed sx={{ fontSize: 15, color: '#94a3b8' }} />
                <Typography variant="caption" color="text.secondary" noWrap>
                  {vehicle.dealerName}
                </Typography>
              </Box>
            </Grid>
          )}
        </Grid>
      </CardContent>

      {/* Actions */}
      <CardActions sx={{ p: 2, pt: 0, gap: 1 }}>
        <Button
          variant="contained"
          size="small"
          startIcon={<DriveEta />}
          onClick={() => onTestDrive(vehicle)}
          disabled={!canBook}
          fullWidth
          sx={{
            background: canBook ? 'linear-gradient(135deg, #002C5F, #1a4a7a)' : undefined,
            fontSize: '0.78rem', py: 0.8,
          }}
        >
          Test Drive
        </Button>
        <Button
          variant="outlined"
          size="small"
          startIcon={<ContactMail />}
          onClick={() => onEnquiry(vehicle)}
          fullWidth
          sx={{ fontSize: '0.78rem', py: 0.8, borderColor: '#e2e8f0', color: '#64748b' }}
        >
          Enquire
        </Button>
      </CardActions>
    </Card>
  );
}

function CardSkeleton() {
  return (
    <Card>
      {/* 16:9 aspect ratio skeleton */}
      <Box sx={{ width: '100%', paddingTop: '56.25%', position: 'relative' }}>
        <Skeleton variant="rectangular" sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }} />
      </Box>
      <CardContent>
        <Skeleton width="60%" height={28} />
        <Skeleton width="40%" height={20} sx={{ mt: 0.5 }} />
        <Skeleton width="50%" height={28} sx={{ mt: 1 }} />
        <Skeleton width="100%" height={60} sx={{ mt: 1 }} />
      </CardContent>
      <CardActions sx={{ p: 2, pt: 0, gap: 1 }}>
        <Skeleton variant="rectangular" width="100%" height={34} sx={{ borderRadius: 1 }} />
        <Skeleton variant="rectangular" width="100%" height={34} sx={{ borderRadius: 1 }} />
      </CardActions>
    </Card>
  );
}

export default function ShowroomPage() {
  const [search, setSearch] = useState('');
  const [modelFilter, setModelFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('AVAILABLE');
  const [page, setPage] = useState(0);
  const [testDriveVehicle, setTestDriveVehicle] = useState(null);
  const [enquiryVehicle, setEnquiryVehicle] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ['showroom', page, search, modelFilter, statusFilter],
    queryFn: () => vehicleApi.getAll({
      page, size: 12,
      search: search || modelFilter || undefined,
      status: statusFilter || undefined,
    }),
    select: r => r.data.data,
  });

  const { data: models } = useQuery({
    queryKey: ['vehicle-models'],
    queryFn: () => vehicleApi.getModels(),
    select: r => r.data.data,
  });

  return (
    <Box>
      {/* Header */}
      <Box sx={{
        background: 'linear-gradient(135deg, #002C5F 0%, #1a4a7a 60%, #00AAD2 100%)',
        borderRadius: 3, p: { xs: 2.5, sm: 4 }, mb: 3, position: 'relative', overflow: 'hidden',
      }}>
        <Box sx={{ position: 'absolute', top: -60, right: -60, width: 250, height: 250, borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />
        <Box position="relative">
          <Typography variant="h4" sx={{ color: '#fff', fontWeight: 800, mb: 0.5 }}>
            Vehicle Showroom
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.65)' }}>
            Browse our latest Hyundai lineup — book a test drive or submit an enquiry directly
          </Typography>
          <Box display="flex" gap={2} mt={2} flexWrap="wrap">
            {['IONIQ 6', 'IONIQ 5', 'Tucson', 'Santa Fe', 'Sonata'].map(m => (
              <Chip key={m} label={m} size="small" onClick={() => setModelFilter(m === modelFilter ? '' : m)}
                sx={{
                  bgcolor: modelFilter === m ? '#00AAD2' : 'rgba(255,255,255,0.15)',
                  color: '#fff', fontWeight: 600, fontSize: '0.72rem', cursor: 'pointer',
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.25)' },
                }} />
            ))}
          </Box>
        </Box>
      </Box>

      {/* Filters */}
      <Box display="flex" gap={2} mb={3} flexWrap="wrap" alignItems="center">
        <SearchBar
          placeholder="Search by model, variant, color, VIN..."
          onSearch={(v) => { setSearch(v); setPage(0); }}
        />
        <TextField select size="small" label="Model" value={modelFilter}
          onChange={e => { setModelFilter(e.target.value); setPage(0); }}
          sx={{ minWidth: 160, '& .MuiOutlinedInput-root': { bgcolor: '#fff' } }}>
          <MenuItem value="">All Models</MenuItem>
          {(models || []).map(m => <MenuItem key={m} value={m}>{m}</MenuItem>)}
        </TextField>
        <TextField select size="small" label="Availability" value={statusFilter}
          onChange={e => { setStatusFilter(e.target.value); setPage(0); }}
          sx={{ minWidth: 150, '& .MuiOutlinedInput-root': { bgcolor: '#fff' } }}>
          <MenuItem value="">All</MenuItem>
          <MenuItem value="AVAILABLE">Available</MenuItem>
          <MenuItem value="RESERVED">Reserved</MenuItem>
          <MenuItem value="IN_TRANSIT">In Transit</MenuItem>
        </TextField>
        <Typography variant="body2" color="text.secondary" ml="auto">
          {data?.totalElements || 0} vehicles found
        </Typography>
      </Box>

      {/* Vehicle Grid */}
      <Grid container spacing={2.5} alignItems="stretch">
        {isLoading
          ? Array.from({ length: 8 }).map((_, i) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={i}><CardSkeleton /></Grid>
            ))
          : (data?.content || []).map(vehicle => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={vehicle.id}>
                <VehicleCard
                  vehicle={vehicle}
                  onTestDrive={v => setTestDriveVehicle(v)}
                  onEnquiry={v => setEnquiryVehicle(v)}
                />
              </Grid>
            ))
        }
        {!isLoading && !data?.content?.length && (
          <Grid item xs={12}>
            <Box textAlign="center" py={8}>
              <DirectionsCar sx={{ fontSize: 64, color: '#e2e8f0', mb: 2 }} />
              <Typography variant="h6" color="text.secondary">No vehicles found</Typography>
              <Typography variant="body2" color="text.disabled">Try adjusting your filters</Typography>
            </Box>
          </Grid>
        )}
      </Grid>

      {/* Pagination */}
      {data && data.totalPages > 1 && (
        <Box display="flex" justifyContent="center" gap={1} mt={4}>
          {Array.from({ length: data.totalPages }).map((_, i) => (
            <Button key={i} size="small" variant={page === i ? 'contained' : 'outlined'}
              onClick={() => setPage(i)}
              sx={{ minWidth: 36, px: 1, borderColor: '#e2e8f0',
                ...(page === i ? { background: 'linear-gradient(135deg, #002C5F, #1a4a7a)' } : { color: '#64748b' }) }}>
              {i + 1}
            </Button>
          ))}
        </Box>
      )}

      {/* Test Drive Dialog — pre-filled with selected vehicle */}
      <TestDriveFormDialog
        open={!!testDriveVehicle}
        onClose={() => setTestDriveVehicle(null)}
        editData={null}
        preselectedVehicle={testDriveVehicle}
      />

      {/* Enquiry Dialog — pre-filled with selected vehicle */}
      <EnquiryFormDialog
        open={!!enquiryVehicle}
        onClose={() => setEnquiryVehicle(null)}
        editData={null}
        preselectedVehicle={enquiryVehicle}
      />
    </Box>
  );
}
