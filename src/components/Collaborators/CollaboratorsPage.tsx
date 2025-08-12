import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import CollaboratorsTable, { type Collaborator } from './CollaboratorsTable';
import NewCollaboratorButton from './NewCollaboratorButton';
import { useNavigate } from 'react-router-dom';
import { db } from '../../firebase';
import { collection, getDocs } from 'firebase/firestore';

const CollaboratorsPage: React.FC = () => {
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const navigate = useNavigate();
  const handleNew = () => navigate('/colaboradores/novo');

  useEffect(() => {
    const fetchCollaborators = async () => {
      const colRef = collection(db, 'colaboradores');
      const snapshot = await getDocs(colRef);
      const data = snapshot.docs.map(doc => {
        const d = doc.data();
        return {
          name: d.name || d.nome || '',
          email: d.email || '',
          department: d.department || d.departamento || '',
          status: d.status || d.situacao || 'Inativo',
          avatar: d.avatar || '',
        } as Collaborator;
      });
      setCollaborators(data);
    };
    fetchCollaborators();
  }, []);

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5" fontWeight={700} color="#1A202C">Colaboradores</Typography>
        <NewCollaboratorButton onClick={handleNew} />
      </Box>
  <CollaboratorsTable collaborators={collaborators} />
    </Box>
  );
};

export default CollaboratorsPage;