import { Box, Grid, Card, CardContent, Typography, Chip, Avatar, LinearProgress, Divider, List, ListItem, ListItemAvatar, ListItemText, Alert } from '@mui/material';
import { Store, DirectionsCar, People, DriveEta, ContactMail, TrendingUp, TrendingDown, Schedule, AddCircleOutline } from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import { dealerApi } from '../api/dealerApi';
import { vehicleApi } from '../api/vehicleApi';
import { userApi } from '../api/userApi';
import { testDriveApi } from '../api/testDriveApi';
import { enquiryApi } from '../api/enquiryApi';
import { useAuthStore } from '../store/authStore';

const statusColors = { AVAILABLE: '#10b981', RESERVED: '#f59e0b', SOLD: '#ef4444', IN_TRANSIT: '#3b82f6' };

function StatCard({ title, value, subtitle, icon, color, trend, trendLabel }) {
  return (
    <Card sx={{ height: '100%', position: 'relative', overflow: 'hidden' }}>
      <CardContent sx={{ p: 2.5 }}>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
          <Box>
            <Typography variant="caption" fontWeight={600} color="text.secondary"
              sx={{ textTransform: 'uppercase', letterSpacing: '0.06em', fontSize: '0.7rem' }}>
              {title}
            </Typography>
            <Typography variant="h4" fontWeight={800} color="text.primary" mt={0.5} lineHeight={1}>
              {value ?? <LinearProgress sx={{ width: 60, mt: 1 }} />}
            </Typography>
            {subtitle && <Typography variant="caption" color="text.secondary" mt={0.5} display="block">{subtitle}</Typography>}
            {trendLabel && (
              <Box display="flex" alignItems="center" gap={0.5} mt={1}>
                {trend >= 0 ? <TrendingUp sx={{ fontSize: 14, color: '#10b981' }} /> : <TrendingDown sx={{ fontSize: 14, color: '#ef4444' }} />}
                <Typography variant="caption" sx={{ color: trend >= 0 ? '#10b981' : '#ef4444', fontWeight: 600 }}>{trendLabel}</Typography>
              </Box>
            )}
          </Box>
          <Avatar sx={{ width: 48, height: 48, bgcolor: `${color}15`, borderRadius: 2 }}>
            <Box sx={{ color }}>{icon}</Box>
          </Avatar>
        </Box>
      </CardContent>
      <Box sx={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 3, bgcolor: `${color}30` }}>
        <Box sx={{ height: '100%', width: '60%', bgcolor: color, borderRadius: '0 2px 2px 0' }} />
      </Box>
    </Card>
  );
}

// ── EMPLOYEE DASHBOARD ────────────────────────────────────────────────────────
function EmployeeDashboard({ user }) {
  const { data: myTestDrives } = useQuery({
    queryKey: ['my-test-drives'],
    queryFn: () => testDriveApi.getAll({ size: 5, status: 'SCHEDULED' }),
    select: r => r.data.data,
  });
  const { data: myEnquiries } = useQuery({
    queryKey: ['my-enquiries'],
    queryFn: () => enquiryApi.getAll({ size: 5, status: 'NEW' }),
    select: r => r.data.data,
  });

  return (
    <Box>
      <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
        As an <strong>Employee</strong>, you can book test drives and submit enquiries. You can only view your own bookings.
      </Alert>
      <Grid container spacing={2.5} mb={3}>
        <Grid item xs={12} sm={6}>
          <StatCard title="My Test Drives" value={myTestDrives?.totalElements}
            subtitle="Bookings you created" icon={<DriveEta />} color="#f59e0b" trend={1} trendLabel="Your bookings" />
        </Grid>
        <Grid item xs={12} sm={6}>
          <StatCard title="My Enquiries" value={myEnquiries?.totalElements}
            subtitle="Enquiries you submitted" icon={<ContactMail />} color="#3b82f6" trend={1} trendLabel="Your submissions" />
        </Grid>
      </Grid>

      <Grid container spacing={2.5}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent sx={{ p: 2.5 }}>
              <Typography variant="subtitle2" fontWeight={700} mb={2}>My Upcoming Test Drives</Typography>
              <List disablePadding>
                {(myTestDrives?.content || []).slice(0, 5).map((td, i) => (
                  <Box key={td.id}>
                    <ListItem disablePadding sx={{ py: 1 }}>
                      <ListItemAvatar>
                        <Avatar sx={{ width: 36, height: 36, bgcolor: '#fef3c7', borderRadius: 2 }}>
                          <Typography variant="caption" fontWeight={800} color="#d97706">{td.customerName?.[0]}</Typography>
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={<Typography variant="body2" fontWeight={600}>{td.customerName}</Typography>}
                        secondary={<Typography variant="caption" color="text.secondary">{td.vehicleModel} · {td.scheduledDate}</Typography>}
                      />
                      <Box display="flex" alignItems="center" gap={0.5}>
                        <Schedule sx={{ fontSize: 14, color: '#f59e0b' }} />
                        <Typography variant="caption" color="text.secondary">{td.scheduledTime || '--:--'}</Typography>
                      </Box>
                    </ListItem>
                    {i < (myTestDrives?.content?.length - 1) && <Divider />}
                  </Box>
                ))}
                {!myTestDrives?.content?.length && (
                  <Box textAlign="center" py={3}>
                    <AddCircleOutline sx={{ fontSize: 32, color: '#e2e8f0', mb: 1 }} />
                    <Typography variant="body2" color="text.secondary">No test drives booked yet</Typography>
                  </Box>
                )}
              </List>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent sx={{ p: 2.5 }}>
              <Typography variant="subtitle2" fontWeight={700} mb={2}>My Recent Enquiries</Typography>
              <List disablePadding>
                {(myEnquiries?.content || []).slice(0, 5).map((e, i) => (
                  <Box key={e.id}>
                    <ListItem disablePadding sx={{ py: 1 }}>
                      <ListItemAvatar>
                        <Avatar sx={{ width: 36, height: 36, bgcolor: '#dbeafe', borderRadius: 2 }}>
                          <Typography variant="caption" fontWeight={800} color="#2563eb">{e.customerName?.[0]}</Typography>
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={<Typography variant="body2" fontWeight={600}>{e.customerName}</Typography>}
                        secondary={<Typography variant="caption" color="text.secondary">{e.enquiryType?.replace('_', ' ')} · {e.dealerName}</Typography>}
                      />
                      <Chip label={e.status} size="small"
                        sx={{ fontSize: '0.62rem', fontWeight: 700, height: 18, bgcolor: '#dbeafe', color: '#2563eb' }} />
                    </ListItem>
                    {i < (myEnquiries?.content?.length - 1) && <Divider />}
                  </Box>
                ))}
                {!myEnquiries?.content?.length && (
                  <Box textAlign="center" py={3}>
                    <AddCircleOutline sx={{ fontSize: 32, color: '#e2e8f0', mb: 1 }} />
                    <Typography variant="body2" color="text.secondary">No enquiries submitted yet</Typography>
                  </Box>
                )}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

// ── ADMIN / DEALER DASHBOARD ──────────────────────────────────────────────────
function AdminDealerDashboard({ user, isAdmin }) {
  const { data: dealers }    = useQuery({ queryKey: ['dealers-count'],  queryFn: () => dealerApi.getAll({ size: 1 }),                    select: r => r.data.data });
  const { data: vehicles }   = useQuery({ queryKey: ['vehicles-count'], queryFn: () => vehicleApi.getAll({ size: 5 }),                   select: r => r.data.data });
  const { data: users }      = useQuery({ queryKey: ['users-count'],    queryFn: () => userApi.getAll({ size: 1 }),                      select: r => r.data.data, enabled: isAdmin });
  const { data: testDrives } = useQuery({ queryKey: ['td-count'],       queryFn: () => testDriveApi.getAll({ size: 5, status: 'SCHEDULED' }), select: r => r.data.data });
  const { data: enquiries }  = useQuery({ queryKey: ['enq-count'],      queryFn: () => enquiryApi.getAll({ size: 5, status: 'NEW' }),    select: r => r.data.data });

  return (
    <>
      <Grid container spacing={2.5} mb={3}>
        <Grid item xs={12} sm={6} lg={isAdmin ? 3 : 4}>
          <StatCard title="Total Dealers" value={dealers?.totalElements} subtitle="Across all regions"
            icon={<Store />} color="#002C5F" trendLabel="+3 this month" trend={1} />
        </Grid>
        <Grid item xs={12} sm={6} lg={isAdmin ? 3 : 4}>
          <StatCard title="Total Vehicles" value={vehicles?.totalElements} subtitle="In inventory"
            icon={<DirectionsCar />} color="#10b981" trendLabel="+12 this week" trend={1} />
        </Grid>
        <Grid item xs={12} sm={6} lg={isAdmin ? 3 : 4}>
          <StatCard title="Scheduled Test Drives" value={testDrives?.totalElements} subtitle="Upcoming bookings"
            icon={<DriveEta />} color="#f59e0b" trendLabel="5 today" trend={1} />
        </Grid>
        {isAdmin && (
          <Grid item xs={12} sm={6} lg={3}>
            <StatCard title="New Enquiries" value={enquiries?.totalElements} subtitle="Awaiting response"
              icon={<ContactMail />} color="#ef4444" trendLabel="Needs attention" trend={-1} />
          </Grid>
        )}
      </Grid>

      <Grid container spacing={2.5}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent sx={{ p: 2.5 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="subtitle2" fontWeight={700}>Recent Vehicles</Typography>
                <Chip label="Live" size="small" sx={{ bgcolor: '#d1fae5', color: '#059669', fontWeight: 700, fontSize: '0.68rem' }} />
              </Box>
              <List disablePadding>
                {(vehicles?.content || []).map((v, i) => (
                  <Box key={v.id}>
                    <ListItem disablePadding sx={{ py: 1 }}>
                      <ListItemAvatar>
                        <Avatar sx={{ width: 38, height: 38, bgcolor: '#f1f5f9', borderRadius: 2 }}>
                          <DirectionsCar sx={{ fontSize: 18, color: '#64748b' }} />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={<Typography variant="body2" fontWeight={600}>{v.model} — {v.variant}</Typography>}
                        secondary={<Typography variant="caption" color="text.secondary">{v.vin}</Typography>}
                      />
                      <Chip label={v.status} size="small"
                        sx={{ fontSize: '0.65rem', fontWeight: 700, height: 20,
                          bgcolor: `${statusColors[v.status]}15`, color: statusColors[v.status] }} />
                    </ListItem>
                    {i < (vehicles?.content?.length - 1) && <Divider />}
                  </Box>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent sx={{ p: 2.5 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="subtitle2" fontWeight={700}>Upcoming Test Drives</Typography>
                <Chip label={`${testDrives?.totalElements || 0} scheduled`} size="small"
                  sx={{ bgcolor: '#fef3c7', color: '#d97706', fontWeight: 700, fontSize: '0.68rem' }} />
              </Box>
              <List disablePadding>
                {(testDrives?.content || []).slice(0, 5).map((td, i) => (
                  <Box key={td.id}>
                    <ListItem disablePadding sx={{ py: 1 }}>
                      <ListItemAvatar>
                        <Avatar sx={{ width: 38, height: 38, bgcolor: '#eff6ff', borderRadius: 2 }}>
                          <Typography variant="caption" fontWeight={800} color="primary">{td.customerName?.[0]}</Typography>
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={<Typography variant="body2" fontWeight={600}>{td.customerName}</Typography>}
                        secondary={<Typography variant="caption" color="text.secondary">{td.vehicleModel} · {td.scheduledDate}</Typography>}
                      />
                      <Box display="flex" alignItems="center" gap={0.5}>
                        <Schedule sx={{ fontSize: 14, color: '#f59e0b' }} />
                        <Typography variant="caption" color="text.secondary">{td.scheduledTime || '--:--'}</Typography>
                      </Box>
                    </ListItem>
                    {i < Math.min((testDrives?.content?.length || 0) - 1, 4) && <Divider />}
                  </Box>
                ))}
                {!testDrives?.content?.length && (
                  <Typography variant="body2" color="text.secondary" textAlign="center" py={2}>No upcoming test drives</Typography>
                )}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {isAdmin && (
          <Grid item xs={12}>
            <Card>
              <CardContent sx={{ p: 2.5 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="subtitle2" fontWeight={700}>New Enquiries</Typography>
                  <Chip label="Needs Response" size="small" sx={{ bgcolor: '#fee2e2', color: '#dc2626', fontWeight: 700, fontSize: '0.68rem' }} />
                </Box>
                <Grid container spacing={1.5}>
                  {(enquiries?.content || []).slice(0, 4).map((e) => (
                    <Grid item xs={12} sm={6} md={3} key={e.id}>
                      <Box sx={{ p: 1.5, borderRadius: 2, border: '1px solid #f1f5f9', bgcolor: '#fafafa' }}>
                        <Typography variant="body2" fontWeight={700} noWrap>{e.customerName}</Typography>
                        <Typography variant="caption" color="text.secondary" noWrap display="block">{e.enquiryType?.replace('_', ' ')}</Typography>
                        <Typography variant="caption" color="text.secondary" noWrap display="block" mt={0.5}>{e.dealerName}</Typography>
                        <Chip label="NEW" size="small" sx={{ mt: 1, height: 18, fontSize: '0.62rem', bgcolor: '#dbeafe', color: '#2563eb', fontWeight: 700 }} />
                      </Box>
                    </Grid>
                  ))}
                  {!enquiries?.content?.length && (
                    <Grid item xs={12}>
                      <Typography variant="body2" color="text.secondary" textAlign="center" py={1}>No new enquiries</Typography>
                    </Grid>
                  )}
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    </>
  );
}

// ── MAIN DASHBOARD ────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const { user, hasRole } = useAuthStore();
  const isAdmin    = hasRole('ADMIN');
  const isEmployee = hasRole('EMPLOYEE') && !isAdmin;

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <Box>
      {/* Welcome banner */}
      <Box sx={{
        background: 'linear-gradient(135deg, #002C5F 0%, #1a4a7a 50%, #00AAD2 100%)',
        borderRadius: 3, p: 3, mb: 3, position: 'relative', overflow: 'hidden',
      }}>
        <Box sx={{ position: 'absolute', top: -40, right: -40, width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
        <Box sx={{ position: 'absolute', bottom: -30, right: 80, width: 120, height: 120, borderRadius: '50%', background: 'rgba(0,170,210,0.15)' }} />
        <Box position="relative">
          <Typography variant="h5" sx={{ color: '#fff', fontWeight: 800 }}>
            {greeting}, {user?.fullName?.split(' ')[0] || user?.username} 👋
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.65)', mt: 0.5 }}>
            {isEmployee
              ? 'You can book test drives and submit enquiries from here.'
              : "Here's what's happening at Hyundai AutoEver today."}
          </Typography>
          <Box display="flex" gap={1} mt={2} flexWrap="wrap">
            {(user?.roles || []).map(r => (
              <Chip key={r} label={r} size="small"
                sx={{ bgcolor: 'rgba(255,255,255,0.15)', color: '#fff', fontWeight: 700, fontSize: '0.7rem' }} />
            ))}
          </Box>
        </Box>
      </Box>

      {/* Role-specific dashboard */}
      {isEmployee
        ? <EmployeeDashboard user={user} />
        : <AdminDealerDashboard user={user} isAdmin={isAdmin} />
      }
    </Box>
  );
}
