import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function Navbar() {
  const { role, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        Store Rater App
      </Link>
      
      <div className="navbar-nav">
        {role === 'ADMIN' && (
          <span style={{color: 'var(--text-muted)'}}>Admin Portal</span>
        )}
        {role === 'OWNER' && (
          <span style={{color: 'var(--text-muted)'}}>Owner Dashboard</span>
        )}
        {role === 'USER' && (
          <span style={{color: 'var(--text-muted)'}}>User Portal</span>
        )}
        <button onClick={handleLogout} className="btn btn-secondary" style={{padding: '0.5rem 1rem', fontSize: '0.875rem'}}>
          Log Out
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
