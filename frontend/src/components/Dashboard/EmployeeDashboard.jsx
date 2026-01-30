import { useState, useEffect } from 'react';
import { Container, Grid, Button, Typography, Box, Chip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import DashboardCard from './DashboardCard';
import PersonalizationPanel from './PersonalizationPanel';
import api from '../../services/api';
import { format } from 'date-fns';

const EmployeeDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [recommendations, setRecommendations] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadDashboard();
    loadRecommendations();
  }, []);

  const loadDashboard = async () => {
    try {
      const response = await api.get('/dashboard');
      setDashboardData(response.data);
    } catch (error) {
      console.error('Failed to load dashboard:', error);
    }
  };

  const loadRecommendations = async () => {
    try {
      const response = await api.get('/recommendations');
      setRecommendations(response.data);
    } catch (error) {
      console.error('Failed to load recommendations:', error);
    }
  };

  const handleConfigUpdate = (newConfig) => {
    setDashboardData((prev) => ({
      ...prev,
      config: newConfig,
    }));
  };

  if (!dashboardData) {
    return <div>Loading...</div>;
  }

  const config = dashboardData.config || {
    show_leaves: true,
    show_learning: true,
    show_compliance: true,
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4">Employee Dashboard</Typography>
        <Button variant="contained" onClick={() => navigate('/leave/apply')}>
          Apply for Leave
        </Button>
      </Box>

      <PersonalizationPanel config={config} onUpdate={handleConfigUpdate} />

      <Grid container spacing={3}>
        {config.show_leaves && (
          <Grid item xs={12} md={6}>
            <DashboardCard title="Leave Status">
              {dashboardData.leave_requests && dashboardData.leave_requests.length > 0 ? (
                <Box>
                  {dashboardData.leave_requests.map((leave) => (
                    <Box key={leave.id} sx={{ mb: 2, p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                      <Typography variant="body2">
                        {format(new Date(leave.from_date), 'MMM dd, yyyy')} - {format(new Date(leave.to_date), 'MMM dd, yyyy')}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {leave.reason}
                      </Typography>
                      <Chip
                        label={leave.status}
                        color={leave.status === 'Approved' ? 'success' : leave.status === 'Rejected' ? 'error' : 'warning'}
                        size="small"
                        sx={{ mt: 1 }}
                      />
                    </Box>
                  ))}
                </Box>
              ) : (
                <Typography color="text.secondary">No leave requests</Typography>
              )}
            </DashboardCard>
          </Grid>
        )}

        {config.show_learning && recommendations && (
          <Grid item xs={12} md={6}>
            <DashboardCard title="Learning Recommendations">
              {recommendations.learning_content && recommendations.learning_content.length > 0 ? (
                <Box>
                  {recommendations.learning_content.slice(0, 3).map((content) => (
                    <Box key={content.id} sx={{ mb: 2, p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                      <Typography variant="subtitle2">{content.title}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {content.description}
                      </Typography>
                      <Chip label={content.level} size="small" sx={{ mt: 1 }} />
                    </Box>
                  ))}
                </Box>
              ) : (
                <Typography color="text.secondary">No recommendations available</Typography>
              )}
            </DashboardCard>
          </Grid>
        )}

        {config.show_compliance && recommendations && (
          <Grid item xs={12} md={6}>
            <DashboardCard title="Compliance Reminders">
              {recommendations.compliance_policies && recommendations.compliance_policies.length > 0 ? (
                <Box>
                  {recommendations.compliance_policies.map((policy) => (
                    <Box key={policy.id} sx={{ mb: 2, p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                      <Typography variant="subtitle2">{policy.title}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Due: {format(new Date(policy.due_date), 'MMM dd, yyyy')}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              ) : (
                <Typography color="text.secondary">No compliance reminders</Typography>
              )}
            </DashboardCard>
          </Grid>
        )}
      </Grid>
    </Container>
  );
};

export default EmployeeDashboard;
