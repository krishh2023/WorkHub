import { Card, CardContent, Typography, Box } from '@mui/material';

const DashboardCard = ({ title, children, sx = {} }) => {
  return (
    <Card sx={{ mb: 2, ...sx }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
        {children}
      </CardContent>
    </Card>
  );
};

export default DashboardCard;
