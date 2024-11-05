'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
} from '@mui/material';
import { verifyAndChangePatientPassword } from '@/app/lib/data';

export default function PatientConfigPage() {
  const [openConfig, setOpenConfig] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const params = useParams();
  const id_paciente = params.id;

  const handleChangePassword = async () => {
    try {
      setLoading(true);
      setError('');
      
      const result = await verifyAndChangePatientPassword(Number(id_paciente), currentPassword, newPassword);
      
      if (!result) {
        throw new Error('No se pudo cambiar la contraseña');
      }

      handleCloseConfig();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cambiar contraseña');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenConfig = () => setOpenConfig(true);
  const handleCloseConfig = () => {
    setOpenConfig(false);
    setCurrentPassword('');
    setNewPassword('');
    setError('');
  };

  return (
    <Box sx={{ p: 3 }}>
      <Button variant="contained" onClick={handleOpenConfig}>
        Cambiar Contraseña
      </Button>

      <Dialog open={openConfig} onClose={handleCloseConfig}>
        <DialogTitle>Cambiar Contraseña</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Contraseña Actual"
            type="password"
            fullWidth
            variant="outlined"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            error={!!error}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Nueva Contraseña"
            type="password"
            fullWidth
            variant="outlined"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            error={!!error}
            helperText={error}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfig}>Cancelar</Button>
          <Button 
            onClick={handleChangePassword} 
            variant="contained"
            disabled={loading || !currentPassword || !newPassword}
          >
            {loading ? 'Guardando...' : 'Guardar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}