
import React, { useEffect, useMemo, useState } from 'react';
import {
  Box, Button, Step, StepLabel, Stepper, Typography, TextField, Switch, FormControlLabel, Paper, LinearProgress, Dialog, DialogTitle, DialogContent, DialogActions, MenuItem, Select, InputLabel, FormControl
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material/Select';
import { useNavigate } from 'react-router-dom';
import { db } from '../../firebase';
import { collection, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import ConfirmDeleteDialog from './ConfirmDeleteDialog';

const steps = ['Infos Básicas', 'Infos Profissionais'];


interface BasicInfo {
  name: string;
  email: string;
  active: boolean;
}

interface ProfessionalInfo {
  department: string;
}


const initialBasicInfo: BasicInfo = {
  name: '',
  email: '',
  active: true,
};

const initialProfessionalInfo: ProfessionalInfo = {
  department: ''
};


const DEPARTMENTS = [
  'Design',
  'TI',
  'Produto',
  'Marketing',
];


export interface CollaboratorFormData {
  name: string;
  email: string;
  department: string;
  status: 'Ativo' | 'Inativo';
  avatar?: string;
}

interface CollaboratorMultiStepFormProps {
  mode?: 'create' | 'edit';
  initialData?: CollaboratorFormData | null;
  docId?: string;
  onDone?: () => void;
}

const CollaboratorMultiStepForm: React.FC<CollaboratorMultiStepFormProps> = ({ mode = 'create', initialData = null, docId, onDone }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [basicInfo, setBasicInfo] = useState<BasicInfo>(initialBasicInfo);
  const [professionalInfo, setProfessionalInfo] = useState<ProfessionalInfo>(initialProfessionalInfo);
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [basicErrors, setBasicErrors] = useState<{ name?: string; email?: string }>({});
  const [profErrors, setProfErrors] = useState<{ department?: string }>({});
  const navigate = useNavigate();

  const prefilled = useMemo(() => initialData ?? null, [initialData]);
  useEffect(() => {
    if (mode === 'edit' && prefilled) {
      setBasicInfo({
        name: prefilled.name ?? '',
        email: prefilled.email ?? '',
        active: prefilled.status === 'Ativo',
      });
      setProfessionalInfo({
        department: prefilled.department ?? ''
      });
    }
  }, [mode, prefilled]);


  const validateBasic = () => {
    const errors: { name?: string; email?: string } = {};
    if (!basicInfo.name.trim()) errors.name = 'Título é obrigatório';
    if (!basicInfo.email.trim()) {
      errors.email = 'E-mail é obrigatório';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(basicInfo.email)) {
        errors.email = 'Digite um e-mail válido';
      }
    }
    setBasicErrors(errors);
    return Object.keys(errors).length === 0;
  };

 
  const validateProf = () => {
    const errors: { department?: string } = {};
    if (!professionalInfo.department.trim()) errors.department = 'Departamento é obrigatório';
    setProfErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const saveCollaborator = async () => {
    const collaborator = {
      name: basicInfo.name,
      email: basicInfo.email,
      department: professionalInfo.department,
      status: basicInfo.active ? 'Ativo' : 'Inativo',
      avatar: prefilled?.avatar ?? '',
    } as CollaboratorFormData;
    if (mode === 'edit' && docId) {
      await updateDoc(doc(db, 'colaboradores', docId), collaborator as any);
    } else {
      await addDoc(collection(db, 'colaboradores'), collaborator);
    }
  };

  const handleNext = async () => {
    if (activeStep === 0) {
      if (validateBasic()) setActiveStep((prev) => prev + 1);
    } else if (activeStep === 1) {
      if (validateProf()) {
  await saveCollaborator();
  setSuccessDialogOpen(true);
      }
    }
  };

  const handleBack = () => setActiveStep((prev) => prev - 1);

  const handleBasicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setBasicInfo((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    setBasicErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleProfessionalChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setProfessionalInfo((prev) => ({ ...prev, [name]: value }));
    setProfErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const progress = (activeStep / (steps.length - 1)) * 50;
  const handleBackToList = () => navigate('/colaboradores');
  const handleOpenDelete = () => setDeleteDialogOpen(true);
  const handleCloseDelete = () => setDeleteDialogOpen(false);
  const handleConfirmDelete = async () => {
    if (!docId) return;
    await deleteDoc(doc(db, 'colaboradores', docId));
    setDeleteDialogOpen(false);
    (onDone ? onDone() : navigate('/colaboradores'));
  };

  return (
    <Box>
      <Box sx={{ mb: 2 }}>
        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{ height: 4, borderRadius: 2, bgcolor: '#E6F4EA', '& .MuiLinearProgress-bar': { bgcolor: '#4ADE80' } }}
        />
        <Box display="flex" justifyContent="flex-end" mt={0.5} mr={1}>
          <Typography fontSize={14} color="#A0AEC0">{Math.round(progress)}%</Typography>
        </Box>
      </Box>

      <Paper elevation={0} sx={{ p: 0, borderRadius: 3, minHeight: 500, display: 'flex', alignItems: 'stretch', }}>
        <Box sx={{ width: 'auto', py: 5, px: 3 }}>
          <Stepper activeStep={activeStep} orientation="vertical">
            {steps.map((label, idx) => (
              <Step key={label} completed={activeStep > idx}>
                <StepLabel
                  sx={{
                    '& .MuiStepIcon-root': {
                      color: (activeStep === idx || activeStep > idx) ? '#22C55E !important' : '#CBD5E1',
                      fontSize: 28,
                    },
                  }}
                >
                  {label}
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>
        <Box flex={1} display="flex" flexDirection="column" justifyContent="flex-start" alignItems="stretch" px={4} py={2} height="100%">
          {activeStep === 0 && (
            <Box display="flex" flexDirection="column" flex={1} justifyContent="flex-start" alignItems="stretch" height="100%" gap={2} pb={8}>
              <Typography variant="h5" fontWeight={600} color="#4A5568" mb={1} mt={2}>
                Informações Básicas
              </Typography>
              <TextField
                label="Título"
                name="name"
                value={basicInfo.name}
                onChange={handleBasicChange}
                fullWidth
                required
                error={!!basicErrors.name}
                helperText={basicErrors.name}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    '& fieldset': {
                      borderColor: !basicErrors.name && basicInfo.name ? '#22C55E' : '',
                    },
                    '&:hover fieldset': {
                      borderColor: !basicErrors.name && basicInfo.name ? '#22C55E' : '',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: !basicErrors.name && basicInfo.name ? '#22C55E' : '',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: !basicErrors.name && basicInfo.name ? '#22C55E' : '',
                  },
                  '& .Mui-focused.MuiInputLabel-root': {
                    color: !basicErrors.name && basicInfo.name ? '#22C55E' : '',
                  },
                }}
              />
              <TextField
                label="E-mail"
                name="email"
                value={basicInfo.email}
                onChange={handleBasicChange}
                fullWidth
                required
                error={!!basicErrors.email}
                helperText={basicErrors.email}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    '& fieldset': {
                      borderColor: !basicErrors.email && basicInfo.email ? '#22C55E' : '',
                    },
                    '&:hover fieldset': {
                      borderColor: !basicErrors.email && basicInfo.email ? '#22C55E' : '',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: !basicErrors.email && basicInfo.email ? '#22C55E' : '',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: !basicErrors.email && basicInfo.email ? '#22C55E' : '',
                  },
                  '& .Mui-focused.MuiInputLabel-root': {
                    color: !basicErrors.email && basicInfo.email ? '#22C55E' : '',
                  },
                }}
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={basicInfo.active}
                    onChange={handleBasicChange}
                    name="active"
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': {
                        color: '#22c55e',
                      },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                        backgroundColor: '#22c55e',
                      },
                    }}
                  />
                }
                label={
                  <Typography fontWeight={500} color="#1A202C">
                    {mode === 'edit' ? 'Ativar' : 'Ativar ao criar'}
                  </Typography>
                }
                sx={{ mt: 1 }}
              />
            </Box>
          )}

          {activeStep === 1 && (
            <Box display="flex" flexDirection="column" flex={1} justifyContent="flex-start" alignItems="stretch" height="100%" gap={2} pb={8}>
              <Typography variant="h5" fontWeight={600} color="#4A5568" mb={1} mt={2}>
                Informações Profissionais
              </Typography>
              <FormControl fullWidth required error={!!profErrors.department} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}>
                <InputLabel 
                  id="department-label"
                  sx={{
                    color: !profErrors.department && professionalInfo.department ? '#22C55E' : undefined,
                    '&.Mui-focused': {
                      color: !profErrors.department && professionalInfo.department ? '#22C55E' : undefined,
                    },
                  }}
                >Selecione um departamento</InputLabel>
                <Select
                  labelId="department-label"
                  label="Selecione um departamento"
                  name="department"
                  value={professionalInfo.department}
                  onChange={handleProfessionalChange}
                  inputProps={{ style: { fontSize: 18 } }}
                  sx={{
                    '& .MuiSelect-select': {
                      textAlign: 'left',
                      justifyContent: 'flex-start',
                    },
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: !profErrors.department && professionalInfo.department ? '#22C55E' : undefined,
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: !profErrors.department && professionalInfo.department ? '#22C55E' : undefined,
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: !profErrors.department && professionalInfo.department ? '#22C55E' : undefined,
                    },
                  }}
                >
                  {DEPARTMENTS.map((dep) => (
                    <MenuItem key={dep} value={dep}>{dep}</MenuItem>
                  ))}
                </Select>
                {profErrors.department && (
                  <Typography color="error" fontSize={12} mt={0.5}>{profErrors.department}</Typography>
                )}
              </FormControl>
            </Box>
          )}

          <Box bgcolor="#fff" py={2} px={2}>
            <Box display="flex" justifyContent="space-between" alignItems="center" gap={0}>
              <Box display="flex" alignItems="center" gap={1.5}>
                {activeStep !== 1 && (
                  <Button onClick={handleBackToList} sx={{ color: '#A0AEC0', fontWeight: 600, fontSize: 16, px: 2.5, borderRadius: 2, textTransform: 'none' }}>
                    Voltar
                  </Button>
                )}
                {activeStep === 1 && (
                  <Button onClick={handleBack} sx={{ color: '#A0AEC0', fontWeight: 600, fontSize: 16, px: 2.5, borderRadius: 2, textTransform: 'none' }}>
                    Voltar
                  </Button>
                )}
              </Box>
              {activeStep === 0 ? (
                <Button
                  variant="contained"
                  onClick={handleNext}
                  sx={{ backgroundColor: '#22c55e', borderRadius: 2, px: 5, fontWeight: 600, fontSize: 16, textTransform: 'none' }}
                >
                  Próximo
                </Button>
              ) : (
                <Box display="flex" alignItems="center" gap={1.5}>
                  {mode === 'edit' && docId && (
                    <Button
                      color="error"
                      onClick={handleOpenDelete}
                      sx={{ fontWeight: 600, fontSize: 16, px: 2.5, borderRadius: 2, textTransform: 'none', }}
                    >
                      Excluir
                    </Button>
                  )}
                  <Button
                    variant="contained"
                    color="success"
                    sx={{ backgroundColor: '#22c55e', borderRadius: 2, px: 5, fontWeight: 600, fontSize: 16, textTransform: 'none' }}
                    onClick={handleNext}
                  >
                    Concluir
                  </Button>
                </Box>
              )}
            </Box>
          </Box>

          <Dialog open={successDialogOpen} onClose={() => { setSuccessDialogOpen(false); (onDone ? onDone() : navigate('/colaboradores')); }}>
            <DialogTitle>{mode === 'edit' ? 'Colaborador atualizado!' : 'Colaborador cadastrado!'}</DialogTitle>
            <DialogContent>
              <Typography>O colaborador foi {mode === 'edit' ? 'atualizado' : 'cadastrado'} com sucesso.</Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => { setSuccessDialogOpen(false); (onDone ? onDone() : navigate('/colaboradores')); }} variant="contained" color="success">
                OK
              </Button>
            </DialogActions>
          </Dialog>

          <ConfirmDeleteDialog
            open={deleteDialogOpen}
            onClose={handleCloseDelete}
            onDelete={handleConfirmDelete}
            collaboratorName={prefilled?.name}
          />
        </Box>
      </Paper>
    </Box>
  );
};

export default CollaboratorMultiStepForm;
