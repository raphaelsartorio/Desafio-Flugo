import React, { useMemo, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Avatar, Typography, Chip, Box, TableSortLabel } from '@mui/material';
import { db } from '../../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
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
  fontSize: 12,
        borderRadius: 1.5,
        px: 0.5,
        py: 0.5,
      }}
      size="small"
    />
  );
};


type Order = 'asc' | 'desc';
type OrderBy = keyof Collaborator;

const CollaboratorsTable: React.FC<CollaboratorsTableProps> = ({ collaborators }) => {
  const navigate = useNavigate();

  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState<OrderBy>('name');

  const handleRequestSort = (property: OrderBy) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const comparator = useMemo(() => {
    return (a: Collaborator, b: Collaborator) => {
      const aRaw = a[orderBy];
      const bRaw = b[orderBy];
      const aVal = (aRaw ?? '').toString();
      const bVal = (bRaw ?? '').toString();
      const cmp = aVal.localeCompare(bVal, 'pt-BR', { sensitivity: 'base' });
      return order === 'desc' ? -cmp : cmp;
    };
  }, [order, orderBy]);

  const rows = useMemo(() => {
    return [...collaborators].sort(comparator);
  }, [collaborators, comparator]);


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
        <Table sx={{ '& td, & th': { fontSize: 12 } }}>
          <TableHead>
            <TableRow sx={{ bgcolor: '#f4f6f8' }}>
              <TableCell sortDirection={orderBy === 'name' ? order : false as any}>
                <TableSortLabel
                  active={orderBy === 'name'}
                  direction={orderBy === 'name' ? order : 'asc'}
                  onClick={() => handleRequestSort('name')}
                >
                  <b>Nome</b>
                </TableSortLabel>
              </TableCell>
              <TableCell sortDirection={orderBy === 'email' ? order : false as any}>
                <TableSortLabel
                  active={orderBy === 'email'}
                  direction={orderBy === 'email' ? order : 'asc'}
                  onClick={() => handleRequestSort('email')}
                >
                  <b>Email</b>
                </TableSortLabel>
              </TableCell>
              <TableCell sortDirection={orderBy === 'department' ? order : false as any}>
                <TableSortLabel
                  active={orderBy === 'department'}
                  direction={orderBy === 'department' ? order : 'asc'}
                  onClick={() => handleRequestSort('department')}
                >
                  <b>Departamento</b>
                </TableSortLabel>
              </TableCell>
              <TableCell align="right" sortDirection={orderBy === 'status' ? order : false as any}>
                <TableSortLabel
                  active={orderBy === 'status'}
                  direction={orderBy === 'status' ? order : 'asc'}
                  onClick={() => handleRequestSort('status')}
                >
                  <b>Status</b>
                </TableSortLabel>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((colab) => (
              <TableRow
                key={colab.email}
                hover
                onClick={() => handleEdit(colab)}
                sx={{ cursor: 'pointer' }}
              >
                <TableCell>
                  <Box display="flex" alignItems="center">
                    <Avatar src={colab.avatar} sx={{ width: 32, height: 32, mr: 1 }} />
                    <Typography sx={{ fontSize: 12 }}>{colab.name}</Typography>
                  </Box>
                </TableCell>
                <TableCell>{colab.email}</TableCell>
                <TableCell>{colab.department}</TableCell>
                <TableCell align="right">
                  <StatusBadge status={colab.status} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default CollaboratorsTable;
