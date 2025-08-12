import React from 'react';
import { Box, Avatar } from '@mui/material';

const Header: React.FC = () => (
  <Box display="flex" justifyContent="flex-end" alignItems="center" p={2}>
    <Avatar src="https://randomuser.me/api/portraits/women/90.jpg" sx={{ width: 40, height: 40, border: '2px solid #E5E9F2' }} />
  </Box>
);

export default Header;
