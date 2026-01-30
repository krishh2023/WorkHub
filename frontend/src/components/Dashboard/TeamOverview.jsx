import { Box, Paper, Typography, Chip, Grid } from '@mui/material';
import DashboardCard from './DashboardCard';
import { format } from 'date-fns';

const TeamOverview = ({ teamMembers, availabilityData }) => {
  if (!teamMembers || teamMembers.length === 0) {
    return (
      <DashboardCard title="Team Members">
        <Typography color="text.secondary">No team members</Typography>
      </DashboardCard>
    );
  }

  return (
    <DashboardCard title="Team Members">
      <Grid container spacing={2}>
        {teamMembers.map((member) => {
          const memberData = availabilityData?.find(m => m.id === member.id) || {};
          const isOnLeave = memberData.availability_status === 'On Leave';
          
          return (
            <Grid item xs={12} sm={6} md={4} key={member.id}>
              <Paper
                elevation={1}
                sx={{
                  p: 2,
                  border: isOnLeave ? '2px solid #f44336' : '1px solid #e0e0e0',
                  bgcolor: isOnLeave ? '#ffebee' : 'white'
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 1 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                    {member.name}
                  </Typography>
                  <Chip
                    label={memberData.availability_status || 'Available'}
                    size="small"
                    color={isOnLeave ? 'error' : 'success'}
                  />
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  {member.email}
                </Typography>
                {member.skills && member.skills.length > 0 && (
                  <Box sx={{ mt: 1 }}>
                    {member.skills.slice(0, 3).map((skill, idx) => (
                      <Chip
                        key={idx}
                        label={skill}
                        size="small"
                        sx={{ mr: 0.5, mb: 0.5, fontSize: '0.7rem' }}
                      />
                    ))}
                    {member.skills.length > 3 && (
                      <Typography variant="caption" color="text.secondary">
                        +{member.skills.length - 3} more
                      </Typography>
                    )}
                  </Box>
                )}
                {memberData.current_leave && (
                  <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
                    On leave: {memberData.current_leave}
                  </Typography>
                )}
              </Paper>
            </Grid>
          );
        })}
      </Grid>
    </DashboardCard>
  );
};

export default TeamOverview;
