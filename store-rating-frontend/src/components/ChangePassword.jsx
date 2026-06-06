import { useState } from 'react';
import api from '../services/api';

function ChangePassword() {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{8,16})/;
    if (!passwordRegex.test(newPassword)) {
      setMessage({ type: 'error', text: 'New password must be 8-16 chars, 1 uppercase, 1 special char' });
      return;
    }

    setLoading(true);
    try {
      await api.post('/auth/change-password', { oldPassword, newPassword });
      setMessage({ type: 'success', text: 'Password updated successfully!' });
      setOldPassword('');
      setNewPassword('');
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to update password' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card" style={{ marginTop: '2rem', maxWidth: '500px' }}>
      <h3 style={{ marginBottom: '1rem' }}>Change Password</h3>
      
      {message.text && (
        <div className={`notification ${message.type}`} style={{ padding: '0.75rem', fontSize: '0.875rem' }}>
          {message.text}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group" style={{ marginBottom: '1rem' }}>
          <label>Current Password</label>
          <input 
            type="password" 
            className="form-input" 
            value={oldPassword} 
            onChange={e => setOldPassword(e.target.value)} 
            required 
          />
        </div>
        <div className="form-group" style={{ marginBottom: '1rem' }}>
          <label>New Password</label>
          <input 
            type="password" 
            className="form-input" 
            value={newPassword} 
            onChange={e => setNewPassword(e.target.value)} 
            required 
          />
          <small style={{ color: 'var(--text-muted)' }}>8-16 chars, 1 uppercase, 1 special character</small>
        </div>
        <button type="submit" className="btn btn-secondary" disabled={loading}>
          {loading ? 'Updating...' : 'Update Password'}
        </button>
      </form>
    </div>
  );
}

export default ChangePassword;
