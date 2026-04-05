import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import { fetchItems } from '../services/api';

export default function Items() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

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

  return (
    <div>
      <div className="page-header">
        <h2 className="page-title page-title--lg">ITEMS</h2>
        <button type="button" className="btn btn--primary" onClick={() => navigate('/add-item')}>
          + ADD
        </button>
      </div>
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
                <span className={item.status === 'Active' ? 'badge badge--active' : 'badge badge--inactive'}>
                  {item.status}
                </span>
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
