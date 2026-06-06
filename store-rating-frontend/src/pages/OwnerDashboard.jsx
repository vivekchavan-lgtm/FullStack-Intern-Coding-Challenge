import { useState, useEffect } from 'react';
import api from '../services/api';
import ChangePassword from '../components/ChangePassword';

function OwnerDashboard() {
  const [stores, setStores] = useState([]);
  const [raters, setRaters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchOwnerData();
  }, []);

  const fetchOwnerData = async () => {
    setLoading(true);
    try {
      const storesRes = await api.get('/owner/dashboard');
      setStores(storesRes.data);

      const ratersRes = await api.get('/owner/raters');
      setRaters(ratersRes.data);
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to load dashboard data.' });
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loader-container"><div className="loader"></div></div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Owner Dashboard</h1>
      </div>

      {message.text && (
        <div className={`notification ${message.type}`}>
          {message.text}
          <button style={{float: 'right', background:'none', border:'none', color:'inherit', cursor:'pointer'}} onClick={() => setMessage({type:'', text:''})}>✕</button>
        </div>
      )}

      {/* Stores Overview */}
      <h2 style={{ marginBottom: '1.5rem' }}>My Stores</h2>
      <div className="grid-stats">
        {stores.map(store => (
          <div key={store.id} className="stat-card">
            <h3 style={{ color: 'var(--primary)', marginBottom: '0.5rem' }}>{store.name}</h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
              <div>
                <div className="stat-title">Total Ratings</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 600 }}>{store.total_ratings}</div>
              </div>
              <div>
                <div className="stat-title">Avg Rating</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 600, color: '#fbbf24' }}>
                  ★ {store.average_rating ? parseFloat(store.average_rating).toFixed(1) : 'N/A'}
                </div>
              </div>
            </div>
          </div>
        ))}
        {stores.length === 0 && (
          <div className="card" style={{ gridColumn: '1/-1', textAlign: 'center' }}>
            <p>You don't own any stores yet.</p>
          </div>
        )}
      </div>

      {/* Raters List */}
      <div className="card" style={{ marginTop: '2rem' }}>
        <h2 style={{ marginBottom: '1.5rem' }}>Recent Ratings</h2>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>User Name</th>
                <th>Email</th>
                <th>Store</th>
                <th>Rating</th>
              </tr>
            </thead>
            <tbody>
              {raters.map((rater, idx) => (
                <tr key={idx}>
                  <td>{rater.name}</td>
                  <td>{rater.email}</td>
                  <td>{rater.store_name}</td>
                  <td>
                    <div className="star-rating">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span key={i} style={{ color: i < rater.rating ? '#fbbf24' : 'var(--text-muted)' }}>★</span>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
              {raters.length === 0 && (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center' }}>No ratings received yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Settings / Profile */}
      <ChangePassword />
    </div>
  );
}

export default OwnerDashboard;