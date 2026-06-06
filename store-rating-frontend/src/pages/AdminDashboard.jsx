import { useState, useEffect } from 'react';
import api from '../services/api';

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({ totalUsers: 0, totalStores: 0, totalRatings: 0 });
  const [users, setUsers] = useState([]);
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [userFilters, setUserFilters] = useState({ name: '', email: '', role: '' });
  const [storeFilters, setStoreFilters] = useState({ name: '', address: '' });

  // Forms
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', address: '', role: 'USER' });
  const [newStore, setNewStore] = useState({ name: '', email: '', address: '' });
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const statsRes = await api.get('/admin/dashboard');
      setStats(statsRes.data);
      
      const usersRes = await api.get('/admin/users');
      setUsers(usersRes.data);
      
      const storesRes = await api.get('/stores');
      setStores(storesRes.data);
    } catch (err) {
      console.error(err);
      setMessage({ type: 'error', text: 'Failed to load dashboard data.' });
    } finally {
      setLoading(false);
    }
  };

  const handleSearchUsers = async () => {
    try {
      const params = new URLSearchParams();
      if (userFilters.name) params.append('name', userFilters.name);
      if (userFilters.email) params.append('email', userFilters.email);
      if (userFilters.role) params.append('role', userFilters.role);
      
      const res = await api.get(`/admin/users?${params.toString()}`);
      setUsers(res.data);
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to search users.' });
    }
  };

  const handleSearchStores = async () => {
    try {
      const params = new URLSearchParams();
      if (storeFilters.name) params.append('name', storeFilters.name);
      if (storeFilters.address) params.append('address', storeFilters.address);
      
      const res = await api.get(`/stores/search?${params.toString()}`);
      setStores(res.data);
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to search stores.' });
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      await api.post('/auth/register', newUser);
      setMessage({ type: 'success', text: 'User created successfully!' });
      setNewUser({ name: '', email: '', password: '', address: '', role: 'USER' });
      fetchDashboardData();
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to create user.' });
    }
  };

  const handleAddStore = async (e) => {
    e.preventDefault();
    try {
      await api.post('/stores', newStore);
      setMessage({ type: 'success', text: 'Store created successfully!' });
      setNewStore({ name: '', email: '', address: '' });
      fetchDashboardData();
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to create store.' });
    }
  };

  if (loading) return <div className="loader-container"><div className="loader"></div></div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Admin Dashboard</h1>
      </div>

      {message.text && (
        <div className={`notification ${message.type}`}>
          {message.text}
          <button style={{float: 'right', background:'none', border:'none', color:'inherit', cursor:'pointer'}} onClick={() => setMessage({type:'', text:''})}>✕</button>
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
        {['dashboard', 'users', 'stores', 'add-user', 'add-store'].map(tab => (
          <button 
            key={tab}
            className={`btn ${activeTab === tab ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab(tab)}
            style={{ textTransform: 'capitalize' }}
          >
            {tab.replace('-', ' ')}
          </button>
        ))}
      </div>

      {/* Dashboard Tab */}
      {activeTab === 'dashboard' && (
        <div className="grid-stats">
          <div className="stat-card">
            <div className="stat-title">Total Users</div>
            <div className="stat-value">{stats.totalUsers || 0}</div>
          </div>
          <div className="stat-card">
            <div className="stat-title">Total Stores</div>
            <div className="stat-value">{stats.totalStores || 0}</div>
          </div>
          <div className="stat-card">
            <div className="stat-title">Total Ratings</div>
            <div className="stat-value">{stats.totalRatings || 0}</div>
          </div>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className="card">
          <h2 style={{ marginBottom: '1.5rem' }}>Users Management</h2>
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
            <input 
              type="text" 
              className="form-input" 
              placeholder="Search by Name" 
              style={{ flex: 1, minWidth: '200px' }}
              value={userFilters.name}
              onChange={(e) => setUserFilters({...userFilters, name: e.target.value})}
            />
            <input 
              type="text" 
              className="form-input" 
              placeholder="Search by Email" 
              style={{ flex: 1, minWidth: '200px' }}
              value={userFilters.email}
              onChange={(e) => setUserFilters({...userFilters, email: e.target.value})}
            />
            <select 
              className="form-input" 
              style={{ flex: 1, minWidth: '150px' }}
              value={userFilters.role}
              onChange={(e) => setUserFilters({...userFilters, role: e.target.value})}
            >
              <option value="">All Roles</option>
              <option value="ADMIN">Admin</option>
              <option value="OWNER">Owner</option>
              <option value="USER">Normal</option>
            </select>
            <button className="btn btn-primary" onClick={handleSearchUsers}>Search</button>
            <button className="btn btn-secondary" onClick={() => {setUserFilters({name:'', email:'', role:''}); fetchDashboardData();}}>Reset</button>
          </div>

          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Address</th>
                  <th>Role</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.address}</td>
                    <td><span style={{ padding: '0.25rem 0.5rem', borderRadius: '4px', backgroundColor: 'var(--surface-hover)', fontSize: '0.875rem' }}>{user.role}</span></td>
                  </tr>
                ))}
                {users.length === 0 && <tr><td colSpan="5" style={{textAlign: 'center'}}>No users found.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Stores Tab */}
      {activeTab === 'stores' && (
        <div className="card">
          <h2 style={{ marginBottom: '1.5rem' }}>Stores Management</h2>
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
            <input 
              type="text" 
              className="form-input" 
              placeholder="Search by Name" 
              style={{ flex: 1, minWidth: '200px' }}
              value={storeFilters.name}
              onChange={(e) => setStoreFilters({...storeFilters, name: e.target.value})}
            />
            <input 
              type="text" 
              className="form-input" 
              placeholder="Search by Address" 
              style={{ flex: 1, minWidth: '200px' }}
              value={storeFilters.address}
              onChange={(e) => setStoreFilters({...storeFilters, address: e.target.value})}
            />
            <button className="btn btn-primary" onClick={handleSearchStores}>Search</button>
            <button className="btn btn-secondary" onClick={() => {setStoreFilters({name:'', address:''}); fetchDashboardData();}}>Reset</button>
          </div>

          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Address</th>
                  <th>Avg Rating</th>
                </tr>
              </thead>
              <tbody>
                {stores.map(store => (
                  <tr key={store.id}>
                    <td>{store.id}</td>
                    <td>{store.name}</td>
                    <td>{store.email}</td>
                    <td>{store.address}</td>
                    <td>
                      <div className="star-rating">
                        ★ {store.rating ? parseFloat(store.rating).toFixed(1) : 'N/A'}
                      </div>
                    </td>
                  </tr>
                ))}
                {stores.length === 0 && <tr><td colSpan="5" style={{textAlign: 'center'}}>No stores found.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add User Form */}
      {activeTab === 'add-user' && (
        <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h2>Add New User</h2>
          <form onSubmit={handleAddUser}>
            <div className="form-group">
              <label>Name</label>
              <input type="text" className="form-input" value={newUser.name} onChange={e => setNewUser({...newUser, name: e.target.value})} required minLength={20} maxLength={60} />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" className="form-input" value={newUser.email} onChange={e => setNewUser({...newUser, email: e.target.value})} required />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input type="password" className="form-input" value={newUser.password} onChange={e => setNewUser({...newUser, password: e.target.value})} required minLength={8} maxLength={16} />
            </div>
            <div className="form-group">
              <label>Address</label>
              <textarea className="form-input" value={newUser.address} onChange={e => setNewUser({...newUser, address: e.target.value})} required maxLength={400}></textarea>
            </div>
            <div className="form-group">
              <label>Role</label>
              <select className="form-input" value={newUser.role} onChange={e => setNewUser({...newUser, role: e.target.value})}>
                <option value="USER">Normal User</option>
                <option value="OWNER">Store Owner</option>
                <option value="ADMIN">System Admin</option>
              </select>
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Create User</button>
          </form>
        </div>
      )}

      {/* Add Store Form */}
      {activeTab === 'add-store' && (
        <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h2>Add New Store</h2>
          <form onSubmit={handleAddStore}>
            <div className="form-group">
              <label>Store Name</label>
              <input type="text" className="form-input" value={newStore.name} onChange={e => setNewStore({...newStore, name: e.target.value})} required minLength={5} maxLength={60} />
            </div>
            <div className="form-group">
              <label>Store Email</label>
              <input type="email" className="form-input" value={newStore.email} onChange={e => setNewStore({...newStore, email: e.target.value})} required />
            </div>
            <div className="form-group">
              <label>Store Address</label>
              <textarea className="form-input" value={newStore.address} onChange={e => setNewStore({...newStore, address: e.target.value})} required maxLength={400}></textarea>
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Create Store</button>
          </form>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;