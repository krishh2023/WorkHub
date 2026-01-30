import { useState, useEffect } from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, LinearProgress } from '@mui/material';
import api from '../../services/api';

const LeaveBalances = () => {
  const [balances, setBalances] = useState([]);

  useEffect(() => {
    loadBalances();
  }, []);

  const loadBalances = async () => {
    try {
      const response = await api.get('/leave/balances');
      setBalances(response.data);
    } catch (error) {
      console.error('Failed to load balances:', error);
    }
  };

  return (
    <Paper elevation={2} sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Team Leave Balances
      </Typography>
      {balances.length > 0 ? (
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Employee</TableCell>
                <TableCell align="right">Total</TableCell>
                <TableCell align="right">Used</TableCell>
                <TableCell align="right">Remaining</TableCell>
                <TableCell>Progress</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {balances.map((balance) => {
                const usagePercent = (balance.used_leaves / balance.total_leaves) * 100;
                return (
                  <TableRow key={balance.user_id}>
                    <TableCell>{balance.user_name}</TableCell>
                    <TableCell align="right">{balance.total_leaves}</TableCell>
                    <TableCell align="right">{balance.used_leaves}</TableCell>
                    <TableCell align="right">
                      <Typography
                        variant="body2"
                        color={balance.remaining_leaves < 5 ? 'error' : 'text.primary'}
                        sx={{ fontWeight: 'bold' }}
                      >
                        {balance.remaining_leaves}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ width: '100%' }}>
                        <LinearProgress
                          variant="determinate"
                          value={usagePercent}
                          color={usagePercent > 80 ? 'error' : usagePercent > 60 ? 'warning' : 'primary'}
                        />
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography color="text.secondary">No leave balance data available</Typography>
      )}
    </Paper>
  );
};

export default LeaveBalances;
