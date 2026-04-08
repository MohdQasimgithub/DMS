import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  Box, Drawer, AppBar, Toolbar, Typography, IconButton,
  List, ListItem, ListItemButton, ListItemIcon, ListItemText,
  Collapse, Avatar, Menu, MenuItem, Divider, Tooltip,
} from '@mui/material';
import {
  Menu as MenuIcon, Dashboard, Store, DirectionsCar,
  AdminPanelSettings, People, Security, MenuOpen,
  Settings, ExpandLess, ExpandMore, Logout, AccountCircle,
  Article,
} from '@mui/icons-material';
import { useAuthStore } from '../../store/authStore';

const DRAWER_WIDTH = 240;

const navItems = [
  { label: 'Dashboard', icon: <Dashboard />, path: '/dashboard' },
  { label: 'Dealers', icon: <Store />, path: '/dealers', roles: ['ADMIN', 'EMPLOYEE', 'DEALER'] },
  { label: 'Vehicles', icon: <DirectionsCar />, path: '/vehicles', roles: ['ADMIN', 'EMPLOYEE', 'DEALER'] },
  {
    label: 'Administration', icon: <AdminPanelSettings />, roles: ['ADMIN'],
    children: [
      { label: 'Users', icon: <People />, path: '/admin/users' },
      { label: 'Roles', icon: <Security />, path: '/admin/roles' },
      { label: 'Menus', icon: <MenuOpen />, path: '/admin/menus' },
      { label: 'Configurations', icon: <Settings />, path: '/admin/configs' },
      { label: 'Logs', icon: <Article />, path: '/admin/logs' },
    ],
  },
];

export default function AppLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const { user, logout, hasRole } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const drawer = (
    <Box>
      <Toolbar sx={{ bgcolor: 'primary.main' }}>
        <Typography variant="h6" color="white" fontWeight="bold" noWrap>
          Hyundai DMS
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {navItems.map((item) => {
          if (item.roles && !item.roles.some((r) => hasRole(r))) return null;
          if (item.children) {
            return (
              <Box key={item.label}>
                <ListItem disablePadding>
                  <ListItemButton onClick={() => setAdminOpen(!adminOpen)}>
                    <ListItemIcon>{item.icon}</ListItemIcon>
                    <ListItemText primary={item.label} />
                    {adminOpen ? <ExpandLess /> : <ExpandMore />}
                  </ListItemButton>
                </ListItem>
                <Collapse in={adminOpen} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {item.children.map((child) => (
                      <ListItemButton
                        key={child.path}
                        sx={{ pl: 4 }}
                        selected={location.pathname === child.path}
                        onClick={() => navigate(child.path)}
                      >
                        <ListItemIcon>{child.icon}</ListItemIcon>
                        <ListItemText primary={child.label} />
                      </ListItemButton>
                    ))}
                  </List>
                </Collapse>
              </Box>
            );
          }
          return (
            <ListItem key={item.path} disablePadding>
              <ListItemButton
                selected={location.pathname === item.path}
                onClick={() => navigate(item.path)}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <IconButton color="inherit" edge="start" onClick={() => setMobileOpen(!mobileOpen)}
            sx={{ mr: 2, display: { sm: 'none' } }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap sx={{ flexGrow: 1 }}>
            Dealer Management System
          </Typography>
          <Tooltip title={user?.fullName || user?.username}>
            <IconButton onClick={(e) => setAnchorEl(e.currentTarget)} color="inherit">
              <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}>
                {user?.username?.[0]?.toUpperCase()}
              </Avatar>
            </IconButton>
          </Tooltip>
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
            <MenuItem disabled>
              <AccountCircle sx={{ mr: 1 }} />
              <Box>
                <Typography variant="body2" fontWeight="bold">{user?.fullName || user?.username}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {(user?.roles || []).join(', ')}
                </Typography>
              </Box>
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout}>
              <Logout sx={{ mr: 1 }} /> Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Box component="nav" sx={{ width: { sm: DRAWER_WIDTH }, flexShrink: { sm: 0 } }}>
        <Drawer variant="temporary" open={mobileOpen} onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{ display: { xs: 'block', sm: 'none' }, '& .MuiDrawer-paper': { width: DRAWER_WIDTH } }}>
          {drawer}
        </Drawer>
        <Drawer variant="permanent"
          sx={{ display: { xs: 'none', sm: 'block' }, '& .MuiDrawer-paper': { width: DRAWER_WIDTH, boxSizing: 'border-box' } }}
          open>
          {drawer}
        </Drawer>
      </Box>

      <Box component="main" sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` }, mt: 8 }}>
        <Outlet />
      </Box>
    </Box>
  );
}
