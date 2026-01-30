import { useState } from 'react';
import { Container, Typography, Box, Tabs, Tab } from '@mui/material';
import UserManagement from '../Admin/UserManagement';
import ComplianceManagement from '../Admin/ComplianceManagement';
import LearningManagement from '../Admin/LearningManagement';

const HRDashboard = () => {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        HR Admin Panel
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mt: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="User Management" />
          <Tab label="Compliance Policies" />
          <Tab label="Learning Content" />
        </Tabs>
      </Box>

      <Box sx={{ mt: 3 }}>
        {tabValue === 0 && <UserManagement />}
        {tabValue === 1 && <ComplianceManagement />}
        {tabValue === 2 && <LearningManagement />}
      </Box>
    </Container>
  );
};

export default HRDashboard;
