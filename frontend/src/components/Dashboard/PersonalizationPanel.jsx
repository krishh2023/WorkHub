import { useState, useEffect } from 'react';
import {
  Paper,
  Typography,
  FormGroup,
  FormControlLabel,
  Switch,
  Button,
  Box
} from '@mui/material';
import api from '../../services/api';

const PersonalizationPanel = ({ config, onUpdate }) => {
  const [localConfig, setLocalConfig] = useState({
    show_leaves: config?.show_leaves ?? true,
    show_learning: config?.show_learning ?? true,
    show_compliance: config?.show_compliance ?? true,
  });

  useEffect(() => {
    if (config) {
      setLocalConfig({
        show_leaves: config.show_leaves,
        show_learning: config.show_learning,
        show_compliance: config.show_compliance,
      });
    }
  }, [config]);

  const handleToggle = (key) => {
    setLocalConfig((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSave = async () => {
    try {
      await api.post('/dashboard/config', localConfig);
      onUpdate(localConfig);
    } catch (error) {
      console.error('Failed to save preferences:', error);
    }
  };

  return (
    <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Personalize Dashboard
      </Typography>
      <FormGroup>
        <FormControlLabel
          control={
            <Switch
              checked={localConfig.show_leaves}
              onChange={() => handleToggle('show_leaves')}
            />
          }
          label="Show Leave Status"
        />
        <FormControlLabel
          control={
            <Switch
              checked={localConfig.show_learning}
              onChange={() => handleToggle('show_learning')}
            />
          }
          label="Show Learning Recommendations"
        />
        <FormControlLabel
          control={
            <Switch
              checked={localConfig.show_compliance}
              onChange={() => handleToggle('show_compliance')}
            />
          }
          label="Show Compliance Reminders"
        />
      </FormGroup>
      <Box sx={{ mt: 2 }}>
        <Button variant="contained" onClick={handleSave}>
          Save Preferences
        </Button>
      </Box>
    </Paper>
  );
};

export default PersonalizationPanel;
