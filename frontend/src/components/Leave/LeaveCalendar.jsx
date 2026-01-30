import { useState, useEffect } from 'react';
import { Box, Typography, Paper, Chip, Alert } from '@mui/material';
import api from '../../services/api';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from 'date-fns';

const LeaveCalendar = () => {
  const [calendarData, setCalendarData] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date());

  useEffect(() => {
    loadCalendar();
  }, [selectedMonth]);

  const loadCalendar = async () => {
    try {
      const start = startOfMonth(selectedMonth);
      const end = endOfMonth(selectedMonth);
      const response = await api.get('/leave/team-calendar', {
        params: {
          start_date: format(start, 'yyyy-MM-dd'),
          end_date: format(end, 'yyyy-MM-dd')
        }
      });
      setCalendarData(response.data);
    } catch (error) {
      console.error('Failed to load calendar:', error);
    }
  };

  if (!calendarData) {
    return <div>Loading calendar...</div>;
  }

  const monthStart = startOfMonth(selectedMonth);
  const monthEnd = endOfMonth(selectedMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getEventsForDate = (date) => {
    return calendarData.events.filter(event => {
      const eventStart = new Date(event.from_date);
      const eventEnd = new Date(event.to_date);
      return date >= eventStart && date <= eventEnd;
    });
  };

  const getStatusColor = (status) => {
    if (status === 'Approved') return 'success';
    if (status === 'Pending') return 'warning';
    return 'default';
  };

  return (
    <Paper elevation={2} sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Team Leave Calendar
      </Typography>
      
      {calendarData.conflicts && calendarData.conflicts.length > 0 && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          {calendarData.conflicts.length} date(s) have multiple team members on leave
        </Alert>
      )}

      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 1, mt: 2 }}>
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <Typography key={day} variant="subtitle2" align="center" sx={{ fontWeight: 'bold' }}>
            {day}
          </Typography>
        ))}
        
        {days.map(day => {
          const events = getEventsForDate(day);
          return (
            <Box
              key={day.toISOString()}
              sx={{
                minHeight: 80,
                border: '1px solid #e0e0e0',
                p: 0.5,
                bgcolor: events.some(e => e.has_conflict) ? '#ffebee' : 'white'
              }}
            >
              <Typography variant="caption" sx={{ fontWeight: 'bold' }}>
                {format(day, 'd')}
              </Typography>
              {events.map(event => (
                <Chip
                  key={event.leave_id}
                  label={`${event.employee_name.substring(0, 8)}...`}
                  size="small"
                  color={getStatusColor(event.status)}
                  sx={{ fontSize: '0.65rem', height: 18, mt: 0.5, display: 'block' }}
                />
              ))}
            </Box>
          );
        })}
      </Box>
    </Paper>
  );
};

export default LeaveCalendar;
