import './App.css';
import { Box } from '@mui/material';

import Sidebar from './components/Sidebar';
import Header from './components/Header';
import CollaboratorsPage from './components/Collaborators/CollaboratorsPage';
import CollaboratorCreatePage from './pages/CollaboratorCreatePage';
import CollaboratorEditPage from './pages/CollaboratorEditPage';
import GlobalBreadcrumb from './components/GlobalBreadcrumb';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';


function App() {
  return (
    <BrowserRouter>
      <Box display="flex" minHeight="100vh" bgcolor="#FAFBFC">
        <Sidebar />
        <Box flex={1} display="flex" flexDirection="column">
          <Header />
          <GlobalBreadcrumb />
          <Box flex={1} p={4}>
            <Routes>
              <Route path="/colaboradores" element={<CollaboratorsPage />} />
              <Route path="/colaboradores/novo" element={<CollaboratorCreatePage />} />
              <Route path="/colaboradores/:id/editar" element={<CollaboratorEditPage />} />
              <Route path="*" element={<Navigate to="/colaboradores" replace />} />
            </Routes>
          </Box>
        </Box>
      </Box>
    </BrowserRouter>
  );
}

export default App;
