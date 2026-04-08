import { Grid, Card, CardContent, Typography, Box } from '@mui/material';
import { Store, DirectionsCar, People, TrendingUp } from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import { dealerApi } from '../api/dealerApi';
import { vehicleApi } from '../api/vehicleApi';
import { userApi } from '../api/userApi';

function StatCard({ title, value, icon, color }) {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography color="text.secondary" variant="body2">{title}</Typography>
            <Typography variant="h4" fontWeight="bold">{value ?? '—'}</Typography>
          </Box>
          <Box sx={{ bgcolor: `${color}.light`, p: 1.5, borderRadius: 2 }}>
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const { data: dealers } = useQuery({
    queryKey: ['dealers-count'],
    queryFn: () => dealerApi.getAll({ size: 1 }),
    select: (res) => res.data.data.totalElements,
  });

  const { data: vehicles } = useQuery({
    queryKey: ['vehicles-count'],
    queryFn: () => vehicleApi.getAll({ size: 1 }),
    select: (res) => res.data.data.totalElements,
  });

  const { data: users } = useQuery({
    queryKey: ['users-count'],
    queryFn: () => userApi.getAll({ size: 1 }),
    select: (res) => res.data.data.totalElements,
  });

  return (
    <Box>
      <Typography variant="h5" fontWeight="bold" mb={3}>Dashboard</Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Total Dealers" value={dealers} icon={<Store color="primary" />} color="primary" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Total Vehicles" value={vehicles} icon={<DirectionsCar color="success" />} color="success" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Total Users" value={users} icon={<People color="warning" />} color="warning" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="System Status" value="Online" icon={<TrendingUp color="info" />} color="info" />
        </Grid>
      </Grid>
    </Box>
  );
}
