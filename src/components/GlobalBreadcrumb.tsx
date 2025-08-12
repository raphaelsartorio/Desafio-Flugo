import React, { useEffect, useMemo, useState } from 'react';
import { Breadcrumbs, Link, Typography, Box } from '@mui/material';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { useLocation, useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';

const breadcrumbNameMap: Record<string, string> = {
  '/colaboradores': 'Colaboradores',
  '/colaboradores/novo': 'Cadastrar Colaborador',
};

const GlobalBreadcrumb: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const pathnames = location.pathname.split('/').filter((x) => x);

  const isEditRoute = useMemo(() => {
    return pathnames.length >= 3 && pathnames[0] === 'colaboradores' && pathnames[2] === 'editar';
  }, [pathnames]);

  const collabId = isEditRoute ? pathnames[1] : '';
  const [collabName, setCollabName] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    if (!isEditRoute || !collabId) {
      setCollabName(null);
      return () => {
        active = false;
      };
    }

    const state = (location as { state?: unknown }).state;
    if (state && typeof state === 'object' && 'collaborator' in state) {
      const collaborator = (state as { collaborator?: { name?: string; nome?: string } }).collaborator;
      const stateName = collaborator?.name ?? collaborator?.nome ?? null;
      if (stateName) {
        setCollabName(stateName);
      }
    }

    (async () => {
      try {
        const ref = doc(db, 'colaboradores', collabId);
        const snap = await getDoc(ref);
        if (!active) return;
        if (snap.exists()) {
          const d = snap.data() as Partial<{ name: string; nome: string }> | undefined;
          setCollabName((prev) => prev ?? d?.name ?? d?.nome ?? null);
        }
      } catch {
      }
    })();

    return () => {
      active = false;
    };
  }, [isEditRoute, collabId, location]);

  let to = '';
  return (
    <Box mb={1} ml={4}>
      <Breadcrumbs
        aria-label="breadcrumb"
        separator={<FiberManualRecordIcon sx={{ fontSize: 8, mx: 1, color: 'text.disabled' }} />}
      >
        <Link
          underline="hover"
          color="inherit"
          onClick={() => navigate('/colaboradores')}
          sx={{ cursor: 'pointer' }}
        >
          Colaboradores
        </Link>
        {pathnames.map((value, index) => {
          to += '/' + value;
          const isLast = index === pathnames.length - 1;

          if (index === 0 && value === 'colaboradores') {
            return null;
          }
          if (isEditRoute) {
            if (index === 1) {
              return null;
            }
            if (isLast) {
              return (
                <Typography color="text.primary" key={to}>
                  {`Editar Colaborador${collabName ? `: ${collabName}` : ''}`}
                </Typography>
              );
            }
          }

          if (!isEditRoute && isLast) {
            return (
              <Typography color="text.primary" key={to}>
                {breadcrumbNameMap[to] || value}
              </Typography>
            );
          }

          return (
            <Link
              underline="hover"
              color="inherit"
              onClick={() => navigate(to)}
              key={to}
              sx={{ cursor: 'pointer' }}
            >
              {breadcrumbNameMap[to] || value}
            </Link>
          );
        })}
      </Breadcrumbs>
    </Box>
  );
};

export default GlobalBreadcrumb;
