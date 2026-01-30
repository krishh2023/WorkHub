import { useState, useEffect } from 'react';
import { Container, Typography, Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, Grid } from '@mui/material';
import DashboardCard from './DashboardCard';
import api from '../../services/api';
import { format } from 'date-fns';

const ManagerDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const response = await api.get('/dashboard');
      setDashboardData(response.data);
    } catch (error) {
      console.error('Failed to load dashboard:', error);
    }
  };

  const handleApprove = async (leaveId, status) => {
    try {
      await api.post('/leave/approve', { leave_id: leaveId, status });
      loadDashboard();
    } catch (error) {
      console.error('Failed to update leave:', error);
      alert(error.response?.data?.detail || 'Failed to update leave');
    }
  };

  if (!dashboardData) {
    return <div>Loading...</div>;
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Manager Dashboard
      </Typography>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} md={6}>
          <DashboardCard title="Team Members">
            {dashboardData.team_members && dashboardData.team_members.length > 0 ? (
              <Box>
                {dashboardData.team_members.map((member) => (
                  <Box key={member.id} sx={{ mb: 1, p: 1 }}>
                    <Typography variant="body1">{member.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {member.email}
                    </Typography>
                  </Box>
                ))}
              </Box>
            ) : (
              <Typography color="text.secondary">No team members</Typography>
            )}
          </DashboardCard>
        </Grid>

        <Grid item xs={12}>
          <DashboardCard title="Pending Leave Requests">
            {dashboardData.pending_leaves && dashboardData.pending_leaves.length > 0 ? (
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Employee</TableCell>
                      <TableCell>From Date</TableCell>
                      <TableCell>To Date</TableCell>
                      <TableCell>Reason</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {dashboardData.pending_leaves.map((leave) => (
                      <TableRow key={leave.id}>
                        <TableCell>{leave.employee_name || 'N/A'}</TableCell>
                        <TableCell>{format(new Date(leave.from_date), 'MMM dd, yyyy')}</TableCell>
                        <TableCell>{format(new Date(leave.to_date), 'MMM dd, yyyy')}</TableCell>
                        <TableCell>{leave.reason}</TableCell>
                        <TableCell>
                          <Chip label={leave.status} color="warning" size="small" />
                        </TableCell>
                        <TableCell>
                          <Button
                            size="small"
                            color="success"
                            onClick={() => handleApprove(leave.id, 'Approved')}
                            sx={{ mr: 1 }}
                          >
                            Approve
                          </Button>
                          <Button
                            size="small"
                            color="error"
                            onClick={() => handleApprove(leave.id, 'Rejected')}
                          >
                            Reject
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Typography color="text.secondary">No pending leave requests</Typography>
            )}
          </DashboardCard>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ManagerDashboard;
