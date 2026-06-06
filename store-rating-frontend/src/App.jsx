import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/UserDashboard';
import OwnerDashboard from './pages/OwnerDashboard';

// Protected Route Wrapper
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { role, loading } = useAuth();
  
  if (loading) return <div className="loader-container"><div className="loader"></div></div>;
  if (!role) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(role)) return <Navigate to="/" replace />;
  
  return children;
};

function App() {
  const { role, loading } = useAuth();

  if (loading) return <div className="loader-container"><div className="loader"></div></div>;

  return (
    <div className="app-container">
      {role && <Navbar />}
      
      <main className="main-content">
        <Routes>
          <Route path="/login" element={!role ? <Login /> : <Navigate to="/" replace />} />
          <Route path="/signup" element={!role ? <Signup /> : <Navigate to="/" replace />} />
          
          <Route 
            path="/admin/*" 
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/owner/*" 
            element={
              <ProtectedRoute allowedRoles={['OWNER']}>
                <OwnerDashboard />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/user/*" 
            element={
              <ProtectedRoute allowedRoles={['USER']}>
                <UserDashboard />
              </ProtectedRoute>
            } 
          />
          
          {/* Default Redirect */}
          <Route 
            path="/" 
            element={
              role === 'ADMIN' ? <Navigate to="/admin" replace /> :
              role === 'OWNER' ? <Navigate to="/owner" replace /> :
              role === 'USER' ? <Navigate to="/user" replace /> :
              <Navigate to="/login" replace />
            } 
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;