import React, { useEffect, useMemo, useState } from 'react';
import { Breadcrumbs, Link, Typography, Box } from '@mui/material';
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

  const { isEditRoute, collabId } = useMemo(() => {
    if (pathnames.length >= 3 && pathnames[0] === 'colaboradores' && pathnames[2] === 'editar') {
      return { isEditRoute: true, collabId: pathnames[1] } as const;
    }
    return { isEditRoute: false, collabId: '' } as const;
  }, [pathnames]);

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
    let stateName: string | null = null;
    if (state && typeof state === 'object' && 'collaborator' in state) {
      const collaborator = (state as { collaborator?: { name?: string; nome?: string } }).collaborator;
      stateName = collaborator?.name ?? collaborator?.nome ?? null;
    }
    if (stateName) {
      setCollabName(stateName);
      return () => {
        active = false;
      };
    }

    (async () => {
      try {
        const ref = doc(db, 'colaboradores', collabId);
        const snap = await getDoc(ref);
        if (!active) return;
        if (snap.exists()) {
          const d = snap.data() as Partial<{ name: string; nome: string }> | undefined;
          setCollabName(d?.name || d?.nome || null);
        } else {
          setCollabName(null);
        }
      } catch {
        if (active) setCollabName(null);
      }
    })();

    return () => {
      active = false;
    };
  }, [isEditRoute, collabId, location]);

  let to = '';
  return (
    <Box mb={3} ml={1}>
      <Breadcrumbs aria-label="breadcrumb">
        <Link
          underline="hover"
          color="inherit"
          onClick={() => navigate('/')}
          sx={{ cursor: 'pointer' }}
        >
          Início
        </Link>
        {pathnames.map((value, index) => {
          to += '/' + value;
          const isLast = index === pathnames.length - 1;
          if (isEditRoute && index === 1) {
            return (
              <Typography color="text.primary" key={to} fontWeight={500}>
                {collabName || value}
              </Typography>
            );
          }

          if (isEditRoute && isLast) {
            return (
              <Typography color="text.primary" key={to} fontWeight={600}>
                Editar
              </Typography>
            );
          }

          return isLast ? (
            <Typography color="text.primary" key={to} fontWeight={600}>
              {breadcrumbNameMap[to] || value}
            </Typography>
          ) : (
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
