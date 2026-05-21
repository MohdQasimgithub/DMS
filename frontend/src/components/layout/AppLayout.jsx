// ============================================================================
// APP LAYOUT - Main application layout with sidebar navigation
// ============================================================================
// Features: Responsive drawer, role-based menu, user profile, nested routes
// ============================================================================

import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  Box, Drawer, AppBar, Toolbar, Typography, IconButton,
  List, ListItem, ListItemButton, ListItemIcon, ListItemText,
  Collapse, Avatar, Menu, MenuItem, Divider, Tooltip, Chip,
} from '@mui/material';
import {
  Menu as MenuIcon, Dashboard, Store, DirectionsCar,
  AdminPanelSettings, People, Security, MenuOpen,
  Settings, ExpandLess, ExpandMore, Logout,
  DriveEta, ContactMail, ChevronRight,
  History, Storefront,
} from '@mui/icons-material';
import { useAuthStore } from '../../store/authStore';

const DRAWER_WIDTH = 256;

// Navigation menu structure with role-based access
const navItems = [
  { label: 'Dashboard', icon: <Dashboard />, path: '/dashboard' },
  { label: 'Showroom', icon: <Storefront />, path: '/showroom' },
  // Only ADMIN sees the Dealers list
  { label: 'Dealers', icon: <Store />, path: '/dealers', roles: ['ADMIN'] },
  { label: 'Vehicles', icon: <DirectionsCar />, path: '/vehicles', roles: ['ADMIN', 'DEALER'] },
  // All roles can access Test Drives and Enquiries (filtered by backend)
  { label: 'Test Drives', icon: <DriveEta />, path: '/test-drives', roles: ['ADMIN', 'DEALER', 'EMPLOYEE'] },
  { label: 'Enquiries', icon: <ContactMail />, path: '/enquiries', roles: ['ADMIN', 'DEALER', 'EMPLOYEE'] },
  {
    // Admin section with nested menu
    label: 'Administration', icon: <AdminPanelSettings />, roles: ['ADMIN'],
    children: [
      { label: 'Users', icon: <People />, path: '/admin/users' },
      { label: 'Roles', icon: <Security />, path: '/admin/roles' },
      { label: 'Menus', icon: <MenuOpen />, path: '/admin/menus' },
      { label: 'Configurations', icon: <Settings />, path: '/admin/configs' },
      { label: 'Login History', icon: <History />, path: '/admin/login-history' },
    ],
  },
  // Dealer gets limited management - only user creation
  { label: 'Manage Employees', icon: <People />, path: '/admin/users', roles: ['DEALER'] },
];

// Role badge colors
const roleColors = { ADMIN: '#ef4444', DEALER: '#3b82f6', EMPLOYEE: '#10b981' };

export default function AppLayout() {
  // Local state
  const [mobileOpen, setMobileOpen] = useState(false);  // Mobile drawer toggle
  const [adminOpen, setAdminOpen] = useState(false);    // Admin submenu toggle
  const [anchorEl, setAnchorEl] = useState(null);       // User menu anchor
  
  // Global state and navigation
  const { user, logout, hasRole } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  // Logout handler
  const handleLogout = () => { 
    logout(); 
    navigate('/login'); 
  };

  // Check if current path is active
  const isActive = (path) => location.pathname === path;
  
  // Check if any admin submenu item is active
  const isAdminActive = navItems.find(i => i.children)?.children?.some(c => isActive(c.path));

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#002C5F' }}>
      {/* Logo */}
      <Box sx={{ p: 3, pb: 2 }}>
        <Box display="flex" alignItems="center" gap={1.5}>
          <Box sx={{
            width: 36, height: 36, borderRadius: 2,
            background: 'linear-gradient(135deg, #00AAD2, #0088aa)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <DirectionsCar sx={{ color: '#fff', fontSize: 20 }} />
          </Box>
          <Box>
            <Typography variant="subtitle1" sx={{ color: '#fff', fontWeight: 700, lineHeight: 1.2, fontSize: '0.95rem' }}>
              Hyundai AutoEver
            </Typography>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.7rem' }}>
              Dealer Management
            </Typography>
          </Box>
        </Box>
      </Box>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)', mx: 2 }} />

      {/* Nav */}
      <Box sx={{ flex: 1, overflowY: 'auto', py: 1.5 }}>
        <List dense disablePadding>
          {navItems.map((item) => {
            if (item.roles && !item.roles.some((r) => hasRole(r))) return null;

            if (item.children) {
              return (
                <Box key={item.label}>
                  <ListItem disablePadding>
                    <ListItemButton
                      onClick={() => setAdminOpen(!adminOpen)}
                      sx={{
                        mx: 1, borderRadius: 2, py: 1,
                        color: isAdminActive ? '#fff' : 'rgba(255,255,255,0.65)',
                        background: isAdminActive ? 'rgba(255,255,255,0.1)' : 'transparent',
                        '&:hover': { background: 'rgba(255,255,255,0.08)', color: '#fff' },
                      }}>
                      <ListItemIcon sx={{ minWidth: 36, color: 'inherit' }}>{item.icon}</ListItemIcon>
                      <ListItemText primary={item.label} primaryTypographyProps={{ fontSize: '0.875rem', fontWeight: 500 }} />
                      {adminOpen ? <ExpandLess sx={{ fontSize: 18 }} /> : <ExpandMore sx={{ fontSize: 18 }} />}
                    </ListItemButton>
                  </ListItem>
                  <Collapse in={adminOpen} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                      {item.children.map((child) => (
                        <ListItem key={child.path} disablePadding>
                          <ListItemButton
                            onClick={() => navigate(child.path)}
                            sx={{
                              mx: 1, pl: 3, borderRadius: 2, py: 0.8,
                              color: isActive(child.path) ? '#fff' : 'rgba(255,255,255,0.55)',
                              background: isActive(child.path) ? 'rgba(0,170,210,0.25)' : 'transparent',
                              borderLeft: isActive(child.path) ? '3px solid #00AAD2' : '3px solid transparent',
                              '&:hover': { background: 'rgba(255,255,255,0.06)', color: '#fff' },
                            }}>
                            <ListItemIcon sx={{ minWidth: 30, color: 'inherit', '& svg': { fontSize: 18 } }}>{child.icon}</ListItemIcon>
                            <ListItemText primary={child.label} primaryTypographyProps={{ fontSize: '0.82rem', fontWeight: isActive(child.path) ? 600 : 400 }} />
                          </ListItemButton>
                        </ListItem>
                      ))}
                    </List>
                  </Collapse>
                </Box>
              );
            }

            return (
              <ListItem key={item.path} disablePadding>
                <ListItemButton
                  onClick={() => navigate(item.path)}
                  sx={{
                    mx: 1, borderRadius: 2, py: 1,
                    color: isActive(item.path) ? '#fff' : 'rgba(255,255,255,0.65)',
                    background: isActive(item.path) ? 'rgba(0,170,210,0.2)' : 'transparent',
                    borderLeft: isActive(item.path) ? '3px solid #00AAD2' : '3px solid transparent',
                    '&:hover': { background: 'rgba(255,255,255,0.08)', color: '#fff' },
                  }}>
                  <ListItemIcon sx={{ minWidth: 36, color: 'inherit' }}>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.label} primaryTypographyProps={{ fontSize: '0.875rem', fontWeight: isActive(item.path) ? 600 : 400 }} />
                  {isActive(item.path) && <ChevronRight sx={{ fontSize: 16, opacity: 0.7 }} />}
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Box>

      {/* User profile at bottom */}
      <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)', mx: 2 }} />
      <Box sx={{ p: 2 }}>
        <Box display="flex" alignItems="center" gap={1.5} sx={{
          p: 1.5, borderRadius: 2, cursor: 'pointer',
          '&:hover': { background: 'rgba(255,255,255,0.06)' },
        }} onClick={(e) => setAnchorEl(e.currentTarget)}>
          <Avatar sx={{ width: 34, height: 34, bgcolor: '#00AAD2', fontSize: '0.85rem', fontWeight: 700 }}>
            {user?.username?.[0]?.toUpperCase()}
          </Avatar>
          <Box flex={1} minWidth={0}>
            <Typography variant="body2" sx={{ color: '#fff', fontWeight: 600, fontSize: '0.82rem', noWrap: true }}>
              {user?.fullName || user?.username}
            </Typography>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.7rem' }}>
              {(user?.roles || []).join(', ')}
            </Typography>
          </Box>
          <ExpandMore sx={{ color: 'rgba(255,255,255,0.4)', fontSize: 18 }} />
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f0f2f5' }}>
      {/* AppBar */}
      <AppBar position="fixed" elevation={0} sx={{
        zIndex: (t) => t.zIndex.drawer + 1,
        bgcolor: '#fff',
        borderBottom: '1px solid #e2e8f0',
        width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` },
        ml: { sm: `${DRAWER_WIDTH}px` },
      }}>
        <Toolbar sx={{ minHeight: '60px !important', px: { xs: 2, sm: 3 } }}>
          <IconButton edge="start" onClick={() => setMobileOpen(!mobileOpen)}
            sx={{ mr: 2, display: { sm: 'none' }, color: '#64748b' }}>
            <MenuIcon />
          </IconButton>

          {/* Breadcrumb title */}
          <Box flex={1}>
            <Typography variant="h6" sx={{ color: '#1e293b', fontWeight: 700, fontSize: '1rem' }}>
              {navItems.flatMap(i => i.children || [i]).find(i => i.path === location.pathname)?.label || 'Dashboard'}
            </Typography>
          </Box>

          {/* Right actions */}
          <Box display="flex" alignItems="center" gap={1}>
            <Tooltip title={user?.fullName || user?.username}>
              <IconButton onClick={(e) => setAnchorEl(e.currentTarget)} sx={{ p: 0.5 }}>
                <Avatar sx={{ width: 34, height: 34, bgcolor: '#002C5F', fontSize: '0.85rem', fontWeight: 700 }}>
                  {user?.username?.[0]?.toUpperCase()}
                </Avatar>
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>

      {/* User menu */}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}
        PaperProps={{ sx: { mt: 1, minWidth: 200, borderRadius: 2, boxShadow: '0 10px 40px rgba(0,0,0,0.12)', border: '1px solid #f1f5f9' } }}>
        <Box sx={{ px: 2, py: 1.5 }}>
          <Typography variant="subtitle2" fontWeight={700}>{user?.fullName || user?.username}</Typography>
          <Typography variant="caption" color="text.secondary">{user?.username}</Typography>
          <Box display="flex" gap={0.5} mt={0.5} flexWrap="wrap">
            {(user?.roles || []).map(r => (
              <Chip key={r} label={r} size="small" sx={{ height: 18, fontSize: '0.65rem', bgcolor: roleColors[r] || '#64748b', color: '#fff', fontWeight: 700 }} />
            ))}
          </Box>
        </Box>
        <Divider />
        <MenuItem onClick={handleLogout} sx={{ color: '#ef4444', fontWeight: 600, fontSize: '0.875rem', py: 1.2 }}>
          <Logout sx={{ mr: 1.5, fontSize: 18 }} /> Sign Out
        </MenuItem>
      </Menu>

      {/* Sidebar */}
      <Box component="nav" sx={{ width: { sm: DRAWER_WIDTH }, flexShrink: { sm: 0 } }}>
        <Drawer variant="temporary" open={mobileOpen} onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{ display: { xs: 'block', sm: 'none' }, '& .MuiDrawer-paper': { width: DRAWER_WIDTH, border: 'none' } }}>
          {drawer}
        </Drawer>
        <Drawer variant="permanent"
          sx={{ display: { xs: 'none', sm: 'block' }, '& .MuiDrawer-paper': { width: DRAWER_WIDTH, border: 'none', boxSizing: 'border-box' } }}
          open>
          {drawer}
        </Drawer>
      </Box>

      {/* Main content */}
      <Box component="main" sx={{
        flexGrow: 1,
        width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` },
        mt: '60px',
        p: { xs: 2, sm: 3 },
        minHeight: 'calc(100vh - 60px)',
      }}>
        <Outlet />
      </Box>
    </Box>
  );
}
