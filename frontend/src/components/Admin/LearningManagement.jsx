import { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Paper,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Alert
} from '@mui/material';
import api from '../../services/api';

const LearningManagement = () => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    tags: '',
    level: 'Beginner',
    description: ''
  });
  const [error, setError] = useState('');

  const handleOpen = () => {
    setOpen(true);
    setFormData({
      title: '',
      tags: '',
      level: 'Beginner',
      description: ''
    });
    setError('');
  };

  const handleClose = () => {
    setOpen(false);
    setError('');
  };

  const handleSubmit = async () => {
    setError('');
    const tagsArray = formData.tags.split(',').map(t => t.trim()).filter(t => t);
    
    try {
      await api.post('/admin/learning', {
        ...formData,
        tags: tagsArray
      });
      handleClose();
      alert('Learning content created successfully');
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create content');
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h6">Learning Content Management</Typography>
        <Button variant="contained" onClick={handleOpen}>
          Add Content
        </Button>
      </Box>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Create Learning Content</DialogTitle>
        <DialogContent>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <TextField
            fullWidth
            margin="normal"
            label="Title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
          <TextField
            fullWidth
            margin="normal"
            label="Tags (comma-separated)"
            value={formData.tags}
            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
            placeholder="React, JavaScript, Frontend"
          />
          <TextField
            fullWidth
            margin="normal"
            select
            label="Level"
            value={formData.level}
            onChange={(e) => setFormData({ ...formData, level: e.target.value })}
            required
          >
            <MenuItem value="Beginner">Beginner</MenuItem>
            <MenuItem value="Intermediate">Intermediate</MenuItem>
            <MenuItem value="Advanced">Advanced</MenuItem>
          </TextField>
          <TextField
            fullWidth
            margin="normal"
            label="Description"
            multiline
            rows={4}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">Create</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default LearningManagement;
