import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  TextField,
  Button,
  Chip,
  Skeleton,
  Alert,
} from '@mui/material';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import BackToDashboard from '../common/BackToDashboard';
import api from '../../services/api';
import { format } from 'date-fns';

const Complaints = () => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const loadMyComplaints = async () => {
    setLoading(true);
    try {
      const res = await api.get('/complaints/my');
      setList(res.data || []);
    } catch (err) {
      console.error('Failed to load complaints:', err);
      setList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMyComplaints();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!subject?.trim() || !description?.trim()) {
      setError('Please enter both subject and description.');
      return;
    }
    setSubmitting(true);
    try {
      await api.post('/complaints', { subject: subject.trim(), description: description.trim() });
      setSubject('');
      setDescription('');
      setSuccess('Complaint submitted. HR will be notified.');
      loadMyComplaints();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to submit complaint.');
    } finally {
      setSubmitting(false);
    }
  };

  const statusColor = (status) => {
    const s = (status || '').toLowerCase();
    if (s === 'resolved' || s === 'closed') return 'success';
    if (s === 'in progress') return 'info';
    return 'warning';
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <BackToDashboard />
      <Typography variant="h5" gutterBottom>
        Raise a complaint
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Report a concern to HR. Your complaint will be tracked and you can view its status below.
      </Typography>

      <Paper variant="outlined" sx={{ p: 2, mb: 3, borderRadius: 2 }}>
        <Typography variant="subtitle1" fontWeight={600} gutterBottom>
          Submit a new complaint
        </Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>{success}</Alert>}
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            margin="normal"
            required
            placeholder="Brief title for your complaint"
          />
          <TextField
            fullWidth
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            margin="normal"
            multiline
            rows={4}
            required
            placeholder="Describe your concern in detail"
          />
          <Button
            type="submit"
            variant="contained"
            color="warning"
            startIcon={<ReportProblemIcon />}
            disabled={submitting}
            sx={{ mt: 2 }}
          >
            {submitting ? 'Submitting...' : 'Submit complaint'}
          </Button>
        </Box>
      </Paper>

      <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
        My complaints
      </Typography>
      {loading ? (
        <Skeleton variant="rectangular" height={120} sx={{ borderRadius: 2 }} />
      ) : list.length === 0 ? (
        <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
          <Typography variant="body2" color="text.secondary">
            You have not submitted any complaints yet.
          </Typography>
        </Paper>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {list.map((c) => (
            <Paper key={c.id} variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1, mb: 1 }}>
                <Typography variant="subtitle1" fontWeight={600}>
                  {c.subject}
                </Typography>
                <Chip label={c.status} color={statusColor(c.status)} size="small" />
              </Box>
              <Typography variant="body2" color="text.secondary">
                {c.description}
              </Typography>
              {c.created_at && (
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                  Submitted {format(new Date(c.created_at), 'MMM d, yyyy HH:mm')}
                </Typography>
              )}
            </Paper>
          ))}
        </Box>
      )}
    </Container>
  );
};

export default Complaints;
