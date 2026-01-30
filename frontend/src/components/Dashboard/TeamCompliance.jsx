import { useState, useEffect } from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Alert } from '@mui/material';
import DashboardCard from './DashboardCard';
import api from '../../services/api';
import { format } from 'date-fns';

const TeamCompliance = ({ teamMembers }) => {
  const [complianceData, setComplianceData] = useState(null);

  useEffect(() => {
    loadCompliance();
  }, []);

  const loadCompliance = async () => {
    try {
      const response = await api.get('/recommendations/team-compliance');
      setComplianceData(response.data);
    } catch (error) {
      console.error('Failed to load compliance:', error);
    }
  };

  if (!complianceData) {
    return <div>Loading compliance data...</div>;
  }

  const upcomingPolicies = complianceData.compliance_policies || [];
  const overduePolicies = upcomingPolicies.filter(
    policy => new Date(policy.due_date) < new Date()
  );
  const dueSoonPolicies = upcomingPolicies.filter(
    policy => {
      const dueDate = new Date(policy.due_date);
      const today = new Date();
      const daysUntilDue = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
      return daysUntilDue <= 30 && daysUntilDue > 0;
    }
  );

  return (
    <DashboardCard title="Team Compliance Status">
      {overduePolicies.length > 0 && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {overduePolicies.length} compliance policy/policies overdue
        </Alert>
      )}
      {dueSoonPolicies.length > 0 && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          {dueSoonPolicies.length} compliance policy/policies due within 30 days
        </Alert>
      )}
      
      {upcomingPolicies.length > 0 ? (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Policy</TableCell>
                <TableCell>Department</TableCell>
                <TableCell>Due Date</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {upcomingPolicies.map((policy) => {
                const dueDate = new Date(policy.due_date);
                const today = new Date();
                const isOverdue = dueDate < today;
                const daysUntilDue = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
                const isDueSoon = daysUntilDue <= 30 && daysUntilDue > 0;

                return (
                  <TableRow key={policy.id}>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        {policy.title}
                      </Typography>
                      {policy.description && (
                        <Typography variant="caption" color="text.secondary">
                          {policy.description}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>{policy.department}</TableCell>
                    <TableCell>{format(dueDate, 'MMM dd, yyyy')}</TableCell>
                    <TableCell>
                      <Chip
                        label={isOverdue ? 'Overdue' : isDueSoon ? 'Due Soon' : 'Upcoming'}
                        color={isOverdue ? 'error' : isDueSoon ? 'warning' : 'default'}
                        size="small"
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography color="text.secondary">No compliance policies assigned to your department</Typography>
      )}
    </DashboardCard>
  );
};

export default TeamCompliance;
