import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import { fetchCustomers } from '../services/api';

export default function Customers() {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

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

  return (
    <div>
      <div className="page-header">
        <h2 className="page-title page-title--lg">CUSTOMERS</h2>

        <button type="button" className="btn btn--primary" onClick={() => navigate('/add-customer')}>
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
          {customers.map((c) => (
            <Card key={c.id}>
              <div className="card-row">
                <h3 className="card-row__title">{c.name || '—'}</h3>

                <span
                  className={c.status === 'Active' ? 'badge badge--active' : 'badge badge--inactive'}
                >
                  {c.status}
                </span>
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
