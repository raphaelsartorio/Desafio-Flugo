import React from 'react';
import { Box, List, ListItemIcon, ListItemText, Typography, ListItemButton } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import GroupIcon from '@mui/icons-material/Group';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import Logo from '../assets/logo2.png';

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isCollaborators = location.pathname.startsWith('/colaboradores');

  return (
    <Box sx={{ bgcolor: '#FAFBFC', borderRight: '2px dotted #F0F0F0', p: 2 }}>
      <Box display="flex" alignItems="center" mb={4}>
        <img src={Logo} alt="Flugo Logo" style={{ width: 100, marginLeft: 16 }} />
      </Box>
      <List>
        <ListItemButton
          selected={isCollaborators}
          onClick={() => navigate('/colaboradores')}
          sx={{
            borderRadius: 2,
            bgcolor: 'transparent',
            '&:hover': { bgcolor: 'transparent' },
            '&.Mui-selected': { bgcolor: 'transparent', '&:hover': { bgcolor: 'transparent' } },
          }}
        >
          <ListItemIcon sx={{ minWidth: 0, mr: 1 }}>
            <GroupIcon sx={{ color: '#A3AED0' }} />
          </ListItemIcon>
          <ListItemText primary={<Typography fontWeight={500} color="#1A202C">Colaboradores</Typography>} />
          <ChevronRightIcon sx={{ color: '#A3AED0', ml: 1 }} />
        </ListItemButton>
      </List>
    </Box>
  );
};

export default Sidebar;
