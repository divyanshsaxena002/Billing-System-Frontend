import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import { fetchItems, updateItemStatus, updateAllItemsStatus } from '../services/api';

export default function Items() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const [updatingAll, setUpdatingAll] = useState(false);

  const activeCount = items.filter(i => i.status === 'Active').length;
  const inactiveCount = items.length - activeCount;
  const allActive = items.length > 0 && activeCount === items.length;

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        setLoadError(null);
        setLoading(true);
        const list = await fetchItems();
        if (!cancelled) setItems(list);
      } catch (err) {
        console.error('Failed to fetch items', err);
        if (!cancelled) {
          setLoadError('Could not load items.');
          setItems([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleToggleStatus = async (item) => {
    try {
      setUpdatingId(item.id);
      const newStatus = item.status === 'Active' ? 'Inactive' : 'Active';
      
      // Update local state immediately for better UX
      setItems(items.map(i => 
        i.id === item.id ? { ...i, status: newStatus } : i
      ));

      // Call API to persist the change
      await updateItemStatus(item.id);
    } catch (err) {
      console.error('Failed to update item status', err);
      // Revert the change on error
      setItems(items.map(i => 
        i.id === item.id ? item : i
      ));
      setLoadError(err.response?.data?.error || 'Failed to update item status');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleToggleAll = async () => {
    const isActivating = !allActive;
    if (!window.confirm(`Are you sure you want to ${isActivating ? 'activate' : 'deactivate'} ALL items?`)) {
      return;
    }
    
    try {
      setUpdatingAll(true);
      const newStatus = isActivating ? 'Active' : 'Inactive';
      
      const previousState = [...items];
      setItems(items.map(i => ({ ...i, status: newStatus })));
      
      try {
        await updateAllItemsStatus(isActivating);
      } catch (err) {
        setItems(previousState);
        throw err;
      }
    } catch (err) {
      console.error('Failed to update all items', err);
      setLoadError(err.response?.data?.error || 'Failed to update all items');
    } finally {
      setUpdatingAll(false);
    }
  };

  return (
    <div>
      <div className="page-header" style={{ marginBottom: '0.5rem' }}>
        <h2 className="page-title page-title--lg">ITEMS</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          {items.length > 0 && !loading && !loadError && (
            <label style={{ display: 'flex', alignItems: 'center', cursor: updatingAll ? 'not-allowed' : 'pointer', opacity: updatingAll ? 0.6 : 1 }}>
              <span style={{ marginRight: '8px', fontSize: '0.9rem', fontWeight: 600, color: allActive ? '#059669' : '#b91c1c' }}>
                 {allActive ? 'All Active' : 'All Inactive'}
              </span>
              <div style={{ position: 'relative', width: '40px', height: '24px', backgroundColor: allActive ? '#10b981' : '#ef4444', borderRadius: '12px', transition: 'background-color 0.3s' }}>
                <div style={{ position: 'absolute', top: '2px', left: allActive ? '18px' : '2px', width: '20px', height: '20px', backgroundColor: 'white', borderRadius: '50%', transition: 'left 0.3s', boxShadow: '0 1px 3px rgba(0,0,0,0.3)' }} />
              </div>
              <input 
                  type="checkbox" 
                  checked={allActive} 
                  onChange={handleToggleAll} 
                  style={{ display: 'none' }}
                  disabled={updatingAll}
              />
            </label>
          )}
          <button type="button" className="btn btn--primary" onClick={() => navigate('/add-item')} disabled={updatingAll}>
            + ADD
          </button>
        </div>
      </div>

      {items.length > 0 && !loading && !loadError && (
        <p className="text-muted" style={{ marginBottom: '1.5rem', fontSize: '0.9rem' }}>
          <strong>{activeCount}</strong> Active &bull; <strong>{inactiveCount}</strong> Inactive
        </p>
      )}
      {loading ? (
        <div className="spinner-wrap">
          <div className="spinner" />
        </div>
      ) : loadError ? (
        <p className="text-error">{loadError}</p>
      ) : (
        <div className="grid grid--3">
          {items.map((item) => (
            <Card key={item.id}>
              <div className="card-row">
                <h3 className="card-row__title">{item.name || '—'}</h3>
                <label style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  cursor: updatingId === item.id ? 'not-allowed' : 'pointer',
                  opacity: updatingId === item.id ? 0.6 : 1,
                }}>
                  <div style={{
                    position: 'relative',
                    width: '40px',
                    height: '24px',
                    backgroundColor: item.status === 'Active' ? '#10b981' : '#ef4444',
                    borderRadius: '12px',
                    transition: 'background-color 0.3s'
                  }}>
                    <div style={{
                      position: 'absolute',
                      top: '2px',
                      left: item.status === 'Active' ? '18px' : '2px',
                      width: '20px',
                      height: '20px',
                      backgroundColor: 'white',
                      borderRadius: '50%',
                      transition: 'left 0.3s',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.3)'
                    }} />
                  </div>
                  <input 
                      type="checkbox" 
                      checked={item.status === 'Active'} 
                      onChange={() => handleToggleStatus(item)} 
                      style={{ display: 'none' }}
                      disabled={updatingId === item.id}
                  />
                  <span style={{ 
                    marginLeft: '8px', 
                    fontSize: '0.85rem', 
                    fontWeight: 600, 
                    color: item.status === 'Active' ? '#059669' : '#b91c1c' 
                  }}>
                     {item.status}
                  </span>
                </label>
              </div>
              <p className="text-muted mt-2">
                Selling price:{' '}
                <span className="fw-700" style={{ color: 'var(--text)' }}>
                  ₹{item.sellingPrice.toLocaleString('en-IN')}
                </span>
              </p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
