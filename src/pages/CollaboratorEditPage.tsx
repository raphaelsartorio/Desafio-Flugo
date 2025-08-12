import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import CollaboratorMultiStepForm, { type CollaboratorFormData } from '../components/Collaborators/CollaboratorMultiStepForm';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Box, CircularProgress, Typography } from '@mui/material';

const CollaboratorEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation() as { state?: { collaborator?: CollaboratorFormData } };
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<CollaboratorFormData | null>(location.state?.collaborator ?? null);

  useEffect(() => {
    const fetchIfNeeded = async () => {
      if (!id) return;
      if (data) return;
      setLoading(true);
      try {
        const ref = doc(db, 'colaboradores', id);
        const snap = await getDoc(ref);
        if (!snap.exists()) {
          navigate('/colaboradores');
          return;
        }
        const d = snap.data() as any;
        setData({
          name: d.name || d.nome || '',
          email: d.email || '',
          department: d.department || d.departamento || '',
          status: d.status || d.situacao || 'Inativo',
          avatar: d.avatar || '',
        });
      } finally {
        setLoading(false);
      }
    };
    fetchIfNeeded();
  }, [id]);

  if (!id) return null;
  if (loading && !data) {
    return (
      <Box display="flex" alignItems="center" justifyContent="center" minHeight={200}>
        <CircularProgress />
      </Box>
    );
  }
  if (!data) {
    return <Typography>Registro não encontrado.</Typography>;
  }

  return (
    <CollaboratorMultiStepForm
      mode="edit"
      initialData={data}
      docId={id}
      onDone={() => navigate('/colaboradores')}
    />
  );
};

export default CollaboratorEditPage;
