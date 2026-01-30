import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/common/Navbar';
import Login from './components/Login';
import EmployeeDashboard from './components/Dashboard/EmployeeDashboard';
import ManagerDashboard from './components/Dashboard/ManagerDashboard';
import HRDashboard from './components/Dashboard/HRDashboard';
import LeaveApplication from './components/Leave/LeaveApplication';
import ProtectedRoute from './components/common/ProtectedRoute';
import Echo from './components/Chatbot/Echo';

const theme = createTheme({
  palette: {
    primary: {
      main: '#3B2F53',
    },
    secondary: {
      main: '#ffffff',
    },
    background: {
      default: '#ffffff',
    },
  },
});

const DashboardRouter = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role === 'hr') {
    return <HRDashboard />;
  } else if (user.role === 'manager') {
    return <ManagerDashboard />;
  } else {
    return <EmployeeDashboard />;
  }
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Navbar />
                  <DashboardRouter />
                  <Echo />
                </ProtectedRoute>
              }
            />
            <Route
              path="/leave/apply"
              element={
                <ProtectedRoute>
                  <Navbar />
                  <LeaveApplication />
                  <Echo />
                </ProtectedRoute>
              }
            />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
