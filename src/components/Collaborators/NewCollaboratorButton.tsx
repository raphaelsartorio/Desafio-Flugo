
import React from 'react';
import { Button } from '@mui/material';
import type { ButtonProps } from '@mui/material';

interface NewCollaboratorButtonProps extends ButtonProps {}

const NewCollaboratorButton: React.FC<NewCollaboratorButtonProps> = (props) => (
  <Button
  variant="contained"
  sx={{
    backgroundColor: '#22c55e',
    borderRadius: 2,
    px: 3,
    fontWeight: 600,
    textTransform: 'none',
    boxShadow: 'none',
    '&:hover': { backgroundColor: '#16a34a', boxShadow: 1 },
    width: { xs: '100%', sm: 'auto' },
    height: { xs: 'auto', sm: '50px' },
  }}
    {...props}
  >
    Novo Colaborador
  </Button>
);

export default NewCollaboratorButton;
