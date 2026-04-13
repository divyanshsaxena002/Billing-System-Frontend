import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import { fetchCustomers, updateCustomerStatus, updateAllCustomersStatus } from '../services/api';

export default function Customers() {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const [updatingAll, setUpdatingAll] = useState(false);

  const activeCount = customers.filter(c => c.status === 'Active').length;
  const inactiveCount = customers.length - activeCount;
  const allActive = customers.length > 0 && activeCount === customers.length;

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        setLoadError(null);
        setLoading(true);
        const list = await fetchCustomers();
        if (!cancelled) setCustomers(list);
      } catch (err) {
        console.error('Failed to fetch customers', err);
        if (!cancelled) {
          setLoadError('Could not load customers.');
          setCustomers([]);
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

  const handleToggleStatus = async (customer) => {
    try {
      setUpdatingId(customer.id);
      const newStatus = customer.status === 'Active' ? 'Inactive' : 'Active';
      
      // Update local state immediately for better UX
      setCustomers(customers.map(c => 
        c.id === customer.id ? { ...c, status: newStatus } : c
      ));

      // Call API to persist the change
      await updateCustomerStatus(customer.id);
    } catch (err) {
      console.error('Failed to update customer status', err);
      // Revert the change on error
      setCustomers(customers.map(c => 
        c.id === customer.id ? customer : c
      ));
      setLoadError(err.response?.data?.error || 'Failed to update customer status');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleToggleAll = async () => {
    const isActivating = !allActive;
    if (!window.confirm(`Are you sure you want to ${isActivating ? 'activate' : 'deactivate'} ALL customers?`)) {
      return;
    }
    
    try {
      setUpdatingAll(true);
      const newStatus = isActivating ? 'Active' : 'Inactive';
      
      const previousState = [...customers];
      setCustomers(customers.map(c => ({ ...c, status: newStatus })));
      
      try {
        await updateAllCustomersStatus(isActivating);
      } catch (err) {
        setCustomers(previousState);
        throw err;
      }
    } catch (err) {
      console.error('Failed to update all customers', err);
      setLoadError(err.response?.data?.error || 'Failed to update all customers');
    } finally {
      setUpdatingAll(false);
    }
  };

  return (
    <div>
      <div className="page-header" style={{ marginBottom: '0.5rem' }}>
        <h2 className="page-title page-title--lg">CUSTOMERS</h2>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          {customers.length > 0 && !loading && !loadError && (
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
          <button type="button" className="btn btn--primary" onClick={() => navigate('/add-customer')} disabled={updatingAll}>
            + ADD
          </button>
        </div>
      </div>

      {customers.length > 0 && !loading && !loadError && (
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
          {customers.map((c) => (
            <Card key={c.id}>
              <div className="card-row">
                <h3 className="card-row__title">{c.name || '—'}</h3>

                <label style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  cursor: updatingId === c.id ? 'not-allowed' : 'pointer',
                  opacity: updatingId === c.id ? 0.6 : 1,
                }}>
                  <div style={{
                    position: 'relative',
                    width: '40px',
                    height: '24px',
                    backgroundColor: c.status === 'Active' ? '#10b981' : '#ef4444',
                    borderRadius: '12px',
                    transition: 'background-color 0.3s'
                  }}>
                    <div style={{
                      position: 'absolute',
                      top: '2px',
                      left: c.status === 'Active' ? '18px' : '2px',
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
                      checked={c.status === 'Active'} 
                      onChange={() => handleToggleStatus(c)} 
                      style={{ display: 'none' }}
                      disabled={updatingId === c.id}
                  />
                  <span style={{ 
                    marginLeft: '8px', 
                    fontSize: '0.85rem', 
                    fontWeight: 600, 
                    color: c.status === 'Active' ? '#059669' : '#b91c1c' 
                  }}>
                     {c.status}
                  </span>
                </label>
              </div>

              <p className="text-muted mt-15" style={{ lineHeight: 1.5 }}>
                {c.address || '—'}
              </p>

              <p className="text-caption mt-1">
                PAN: {c.pan || '—'} · GST: {c.gst || '—'}
              </p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
