import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';

interface ConfirmDeleteDialogProps {
  open: boolean;
  onClose: () => void;
  onDelete: () => void;
  collaboratorName?: string;
}

const ConfirmDeleteDialog: React.FC<ConfirmDeleteDialogProps> = ({ open, onClose, onDelete, collaboratorName }) => (
  <Dialog open={open} onClose={onClose}>
    <DialogTitle>Confirmar exclusão</DialogTitle>
    <DialogContent>
      <Typography>Tem certeza que deseja excluir {collaboratorName ? `o colaborador "${collaboratorName}"` : 'este colaborador'}?</Typography>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose} color="primary" variant="outlined">Voltar</Button>
      <Button onClick={onDelete} color="error" variant="contained">Excluir</Button>
    </DialogActions>
  </Dialog>
);

export default ConfirmDeleteDialog;
