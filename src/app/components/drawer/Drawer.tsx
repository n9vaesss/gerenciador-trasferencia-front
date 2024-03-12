'use client';

import React, { useEffect } from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import LogoutIcon from '@mui/icons-material/Logout';
import { useRouter } from 'next/navigation';
import Cookie from 'js-cookie';
import { toast } from 'react-toastify';
import { useMyContext } from '@/app/contexts/MyContext';
import { Theme, CSSObject } from '@mui/material/styles';
import { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';

const drawerWidth = 240;


console.log("a")

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  }),
);


export default function MiniDrawer({ children }: any) {
  const theme = useTheme();

  const [open, setOpen] = React.useState(false);
  const [arr_roles, setArr_roles] = React.useState<string[]>([]);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const { load }: any = useMyContext();

  useEffect(() => {
    const timeout = setTimeout(() => {
      const roles = [];
      for (let i = 0; i < 3; i++) {
        roles.push(Cookie.get(`role_user${i}`));
      }
      setArr_roles(roles);

      if (roles.length === 0) {
        console.log('Arr_roles está vazio. Recarregando a página...');
        window.location.reload();
      }
    }, 1000);

    return () => clearTimeout(timeout);
  }, []);

  const router = useRouter();

  const handlesubmit = (icons: any) => {
    if (load) {
      console.log('carregando....');
    } else {
      if (icons.path === '/') {
        Cookie.remove('auth_token');
        for (let i = 0; i < 4; i++) {
          Cookie.remove(`role_user${i}`);
        }
        Cookie.remove('username');
        Cookie.remove('loja_registro');
        toast.success('Usuario deslogado!');
        router.push('/');
      } else {
        router.push(icons.path);
      }
    }
  };

  const icons = [
    {
      name: 'Pagina inicial',
      obj: <LogoutIcon />,
      path: '/dashboard',
      permissao: 'USUARIO',
    },
    {
      name: 'Administrador',
      obj: <LogoutIcon />,
      path: '/dashboard/admin',
      permissao: 'ADMINISTRADOR',
    },
    {
      name: 'Transferencia',
      obj: <LogoutIcon />,
      path: '/dashboard/transferencia',
      permissao: 'TRANSFERENCIA',
    },
    {
      name: 'Sair',
      obj: <LogoutIcon />,
      path: '/',
      permissao: 'USUARIO',
    },
  ];

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{
              marginRight: 5,
              ...(open && { display: 'none' }),
            }}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'rtl' ? (
              <ChevronRightIcon />
            ) : (
              <ChevronLeftIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          {arr_roles.length > 0 &&
            icons.map((icon) => (
              <ListItem
                key={icon.name}
                disablePadding
                sx={
                  arr_roles.some((role: any) => role === icon.permissao)
                    ? { display: 'block' }
                    : { display: 'none' }
                }
                onClick={() => handlesubmit(icon)}
              >
                <ListItemButton
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? 'initial' : 'center',
                    px: 2.5,
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 3 : 'auto',
                      justifyContent: 'center',
                    }}
                  >
                    {icon.obj}
                  </ListItemIcon>
                  <ListItemText
                    primary={icon.name}
                    sx={{ opacity: open ? 1 : 0 }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
        </List>

        <Divider />
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, mt: 1, ml: 1 }}>
        <DrawerHeader />
        {children}
      </Box>
    </Box>
  );
}
