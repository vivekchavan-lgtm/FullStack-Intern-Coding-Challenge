import { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import ChangePassword from '../components/ChangePassword';

function UserDashboard() {
  const [stores, setStores] = useState([]);
  const [myRatings, setMyRatings] = useState({}); // store_id -> rating
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ name: '', address: '' });
  const [message, setMessage] = useState({ type: '', text: '' });
  
  // Rating modal state
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [selectedStore, setSelectedStore] = useState(null);
  const [ratingValue, setRatingValue] = useState(0);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const storesRes = await api.get('/stores');
      setStores(storesRes.data);
      
      const ratingsRes = await api.get('/ratings/my');
      const ratingsMap = {};
      ratingsRes.data.forEach(r => {
        ratingsMap[r.store_id] = r.rating;
      });
      setMyRatings(ratingsMap);
      
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to load stores data.' });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.name) params.append('name', filters.name);
      if (filters.address) params.append('address', filters.address);
      
      const res = await api.get(`/stores/search?${params.toString()}`);
      setStores(res.data);
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to search stores.' });
    }
  };

  const openRatingModal = (store) => {
    setSelectedStore(store);
    const existingRating = myRatings[store.id];
    setRatingValue(existingRating ? existingRating : 0);
    setIsUpdating(!!existingRating);
    setShowRatingModal(true);
  };

  const submitRating = async () => {
    if (ratingValue < 1 || ratingValue > 5) {
      setMessage({ type: 'error', text: 'Rating must be between 1 and 5' });
      return;
    }
    
    try {
      if (isUpdating) {
        await api.put(`/ratings/${selectedStore.id}`, { rating: ratingValue });
        setMessage({ type: 'success', text: 'Rating updated successfully!' });
      } else {
        await api.post('/ratings', { store_id: selectedStore.id, rating: ratingValue });
        setMessage({ type: 'success', text: 'Rating submitted successfully!' });
      }
      setShowRatingModal(false);
      fetchData(); // refresh data to get new average and my rating
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to submit rating.' });
    }
  };

  if (loading) return <div className="loader-container"><div className="loader"></div></div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>User Dashboard</h1>
      </div>

      {message.text && (
        <div className={`notification ${message.type}`}>
          {message.text}
          <button style={{float: 'right', background:'none', border:'none', color:'inherit', cursor:'pointer'}} onClick={() => setMessage({type:'', text:''})}>✕</button>
        </div>
      )}

      {/* Search Bar */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <h3 style={{ marginBottom: '1rem' }}>Search Stores</h3>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <input 
            type="text" 
            className="form-input" 
            placeholder="Store Name" 
            style={{ flex: 1, minWidth: '200px' }}
            value={filters.name}
            onChange={(e) => setFilters({...filters, name: e.target.value})}
          />
          <input 
            type="text" 
            className="form-input" 
            placeholder="Address" 
            style={{ flex: 1, minWidth: '200px' }}
            value={filters.address}
            onChange={(e) => setFilters({...filters, address: e.target.value})}
          />
          <button className="btn btn-primary" onClick={handleSearch}>Search</button>
          <button className="btn btn-secondary" onClick={() => {setFilters({name:'', address:''}); fetchData();}}>Reset</button>
        </div>
      </div>

      {/* Stores List */}
      <h2 style={{ marginBottom: '1.5rem' }}>Available Stores</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {stores.map(store => (
          <div key={store.id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ marginBottom: '0.5rem', color: 'var(--primary)' }}>{store.name}</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1rem', flex: 1 }}>{store.address}</p>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Overall Rating:</span>
              <div className="star-rating">
                ★ {store.average_rating ? parseFloat(store.average_rating).toFixed(1) : (store.rating ? parseFloat(store.rating).toFixed(1) : 'N/A')}
              </div>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Your Rating:</span>
              <div className="star-rating" style={{ color: myRatings[store.id] ? '#fbbf24' : 'var(--text-muted)' }}>
                {myRatings[store.id] ? `★ ${myRatings[store.id]}` : 'Not rated'}
              </div>
            </div>
            
            <button 
              className={`btn ${myRatings[store.id] ? 'btn-secondary' : 'btn-primary'}`} 
              style={{ width: '100%' }}
              onClick={() => openRatingModal(store)}
            >
              {myRatings[store.id] ? 'Modify Rating' : 'Submit Rating'}
            </button>
          </div>
        ))}
        {stores.length === 0 && <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '2rem' }}>No stores found.</div>}
      </div>

      {/* Rating Modal */}
      {showRatingModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.8)',
          display: 'flex', justifyContent: 'center', alignItems: 'center',
          zIndex: 1000, backdropFilter: 'blur(4px)'
        }}>
          <div className="card" style={{ width: '100%', maxWidth: '400px' }}>
            <h2 style={{ marginBottom: '1rem' }}>{isUpdating ? 'Update' : 'Submit'} Rating</h2>
            <p style={{ marginBottom: '1.5rem', color: 'var(--text-muted)' }}>{selectedStore?.name}</p>
            
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginBottom: '2rem', fontSize: '2rem' }}>
              {[1, 2, 3, 4, 5].map(star => (
                <span 
                  key={star}
                  onClick={() => setRatingValue(star)}
                  style={{ 
                    cursor: 'pointer', 
                    color: star <= ratingValue ? '#fbbf24' : 'var(--text-muted)',
                    transition: 'color 0.2s'
                  }}
                >
                  ★
                </span>
              ))}
            </div>
            
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setShowRatingModal(false)}>Cancel</button>
              <button className="btn btn-primary" style={{ flex: 1 }} onClick={submitRating}>Submit</button>
            </div>
          </div>
        </div>
      )}

      {/* Settings / Profile */}
      <ChangePassword />
    </div>
  );
}

export default UserDashboard;