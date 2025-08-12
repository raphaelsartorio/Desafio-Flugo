import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Avatar, Typography, Chip, Box } from '@mui/material';
import ConfirmDeleteDialog from './ConfirmDeleteDialog';
import { db } from '../../firebase';
import { doc, deleteDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

export interface Collaborator {
  name: string;
  email: string;
  department: string;
  status: 'Ativo' | 'Inativo';
  avatar: string;
}

interface CollaboratorsTableProps {
  collaborators: Collaborator[];
  onCollaboratorsChange?: (newList: Collaborator[]) => void;
  onDelete?: (email: string) => void;
}


const StatusBadge = ({ status }: { status: 'Ativo' | 'Inativo' }) => {
  const isActive = status === 'Ativo';
  return (
    <Chip
      label={status}
      sx={{
        backgroundColor: isActive ? '#E6F4EA' : '#FDECEA',
        color: isActive ? '#219653' : '#C62828',
        fontWeight: 600,
        fontSize: 15,
        borderRadius: 1.5,
        px: 2,
        py: 0.5,
      }}
      size="small"
    />
  );
};


const CollaboratorsTable: React.FC<CollaboratorsTableProps> = ({ collaborators, onCollaboratorsChange, onDelete }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedColab, setSelectedColab] = useState<Collaborator | null>(null);

  const navigate = useNavigate();
  console.log('Colaboradores:', collaborators);
  const handleOpenDialog = (colab: Collaborator) => {
    setSelectedColab(colab);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedColab(null);
  };

  const handleDelete = async () => {
    if (!selectedColab) return;
    try {

      const colRef = collection(db, 'colaboradores');
      const q = query(colRef, where('email', '==', selectedColab.email));
      const snap = await getDocs(q);

      if (snap.empty) {
        alert('Documento não encontrado para o e-mail informado.');
        return;
      }

      const docSnap = snap.docs[0];
      const id = docSnap.id;


      await deleteDoc(doc(db, 'colaboradores', id));
      console.log('Colaborador excluído (id):', id, 'dados:', selectedColab);


      if (onDelete) {
        onDelete(selectedColab.email);
      } else if (onCollaboratorsChange) {
        const newList = collaborators.filter(c => c.email !== selectedColab.email);
        onCollaboratorsChange(newList);
      }

      handleCloseDialog();
  } catch (err) {
      alert('Erro ao excluir colaborador.');
    }
  };

  const handleEdit = async (colab: Collaborator) => {
    try {
      const colRef = collection(db, 'colaboradores');
      const q = query(colRef, where('email', '==', colab.email));
      const snap = await getDocs(q);
      if (snap.empty) {
        alert('Documento não encontrado para o e-mail informado.');
        return;
      }
      const id = snap.docs[0].id;
      navigate(`/colaboradores/${id}/editar`, { state: { collaborator: colab } });
    } catch (err) {
      alert('Erro ao iniciar edição do colaborador.');
    }
  };

  return (
    <>
      <TableContainer sx={{ borderRadius: 3, boxShadow: '0 2px 8px #F0F0F0', bgcolor: '#fff' }}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: '#f4f6f8' }}>
              <TableCell><b>Nome</b> &#8595;</TableCell>
              <TableCell><b>Email</b> &#8595;</TableCell>
              <TableCell><b>Departamento</b> &#8595;</TableCell>
              <TableCell align="right"><b>Status</b> &#8595;</TableCell>
              <TableCell align="center"><b>Ações</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {collaborators.map((colab) => (
              <TableRow key={colab.email}>
                <TableCell>
                  <Box display="flex" alignItems="center">
                    <Avatar src={colab.avatar} sx={{ width: 32, height: 32, mr: 1 }} />
                    <Typography fontWeight={600}>{colab.name}</Typography>
                  </Box>
                </TableCell>
                <TableCell>{colab.email}</TableCell>
                <TableCell>{colab.department}</TableCell>
                <TableCell align="right">
                  <StatusBadge status={colab.status} />
                </TableCell>
                <TableCell align="center">
                  <Box display="flex" gap={1} justifyContent="center">
                    <button style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: 4,
                      color: '#1976d2',
                    }} title="Editar" onClick={() => handleEdit(colab)}>
                      <span role="img" aria-label="editar">✏️</span>
                    </button>
                    <button style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: 4,
                      color: '#d32f2f',
                    }} title="Excluir" onClick={() => handleOpenDialog(colab)}>
                      <span role="img" aria-label="excluir">🗑️</span>
                    </button>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <ConfirmDeleteDialog
        open={openDialog}
        onClose={handleCloseDialog}
        onDelete={handleDelete}
        collaboratorName={selectedColab?.name}
      />
    </>
  );
};

export default CollaboratorsTable;
