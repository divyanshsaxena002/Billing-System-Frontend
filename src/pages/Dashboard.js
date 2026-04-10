import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Card from '../components/Card';
import { fetchInvoicesAll, fetchInvoiceById } from '../services/api';
import InvoiceView from '../components/InvoiceView';
import { FiFileText, FiDollarSign, FiPercent, FiSearch, FiCheckCircle } from 'react-icons/fi';

export default function Dashboard() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [searchId, setSearchId] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [searchError, setSearchError] = useState(null);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        setLoadError(null);
        setLoading(true);
        const list = await fetchInvoicesAll();
        if (!cancelled) setInvoices(list);
      } catch (err) {
        console.error('Failed to fetch invoices', err);
        if (!cancelled) {
          setLoadError(err.userMessage || 'Could not load invoices. Is the backend running?');
          setInvoices([]);
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

  const handleSearch = async () => {
    const raw = searchId.trim();
    if (!raw) {
      setSearchError('Enter an invoice ID (e.g. INVC000001) or numeric id.');
      setSearchResult(null);
      return;
    }
    try {
      setSearching(true);
      setSearchError(null);
      const data = await fetchInvoiceById(raw);
      setSearchResult(data);
    } catch (err) {
      console.error('Failed to fetch invoice', err);
      setSearchResult(null);
      setSearchError(err.userMessage || 'Invoice not found or request failed.');
    } finally {
      setSearching(false);
    }
  };

  const formatDate = (v) => {
    if (!v) return '—';
    const d = new Date(v);
    return Number.isNaN(d.getTime()) ? '—' : d.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Calculate Summary metrics
  const totalInvoicesCount = invoices.length;
  let totalRevenue = 0;
  let totalGstCollected = 0;

  invoices.forEach((inv) => {
    const amt = Number(inv.total_amount ?? inv.final_amount ?? 0);
    totalRevenue += amt;
    if (inv.gst_applied) {
      const sub = amt / 1.18;
      totalGstCollected += (amt - sub);
    }
  });

  return (
    <div>
      <h2 className="page-title page-title--lg" style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>Dashboard</h2>
      <p className="page-desc">Overview of your billing and invoices.</p>
      
      {/* Search Row */}
      <div className="search-row" style={{ marginBottom: '2rem' }}>
        <div className="form-group" style={{ flex: 1, maxWidth: '400px' }}>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input
              id="invoice-search"
              className="input"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              placeholder="Search by ID (e.g. INVC000001)"
              style={{ boxShadow: 'var(--card-shadow)', border: 'none' }}
            />
            <button type="button" className="btn btn--primary" onClick={handleSearch} disabled={searching} style={{ padding: '0.6rem 1.5rem' }}>
              <FiSearch /> Search
            </button>
          </div>
        </div>
      </div>
      {searchError && <p className="text-error mb-2">{searchError}</p>}
      {searchResult && (
        <div className="mb-3">
          <Card>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '1rem', marginBottom: '1rem' }}>
              <h3 className="card-row__title" style={{ margin: 0 }}>Search Result</h3>
              <button className="btn btn--outline-danger" onClick={() => setSearchResult(null)}>Clear</button>
            </div>
            <InvoiceView invoice={searchResult} />
          </Card>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid--3 mb-3">
        <Card style={{ borderLeft: '4px solid var(--primary)' }}>
          <div className="tile-row">
            <div className="tile-icon" style={{ background: 'rgba(79, 70, 229, 0.1)', color: 'var(--primary)' }}>
              <FiFileText size={24} />
            </div>
            <div>
              <p className="text-muted" style={{ margin: '0 0 0.25rem' }}>Total Invoices</p>
              <h3 className="tile-title" style={{ fontSize: '1.5rem', margin: 0 }}>{totalInvoicesCount}</h3>
            </div>
          </div>
        </Card>
        <Card style={{ borderLeft: '4px solid #10b981' }}>
          <div className="tile-row">
            <div className="tile-icon" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
              <FiDollarSign size={24} />
            </div>
            <div>
              <p className="text-muted" style={{ margin: '0 0 0.25rem' }}>Total Revenue</p>
              <h3 className="tile-title" style={{ fontSize: '1.5rem', margin: 0 }}>
                ₹{totalRevenue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </h3>
            </div>
          </div>
        </Card>
        <Card style={{ borderLeft: '4px solid #f59e0b' }}>
          <div className="tile-row">
            <div className="tile-icon" style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' }}>
              <FiPercent size={24} />
            </div>
            <div>
              <p className="text-muted" style={{ margin: '0 0 0.25rem' }}>GST Collected</p>
              <h3 className="tile-title" style={{ fontSize: '1.5rem', margin: 0 }}>
                ₹{totalGstCollected.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </h3>
            </div>
          </div>
        </Card>
      </div>

      {/* Invoice List */}
      <h3 className="page-title" style={{ marginTop: '2rem', marginBottom: '1rem', fontSize: '1.4rem' }}>Recent Invoices</h3>
      
      {loading ? (
        <div className="spinner-wrap">
          <div className="spinner" />
        </div>
      ) : loadError ? (
        <p className="text-error">{loadError}</p>
      ) : (
        <Card contentClassName="card__body--flush">
          <div className="table-wrap">
            <table className="table" style={{ borderCollapse: 'separate', borderSpacing: '0 0.5rem', padding: '0 1rem' }}>
              <thead>
                <tr>
                  <th style={{ borderBottom: 'none' }}>Invoice ID</th>
                  <th style={{ borderBottom: 'none' }}>Customer</th>
                  <th style={{ borderBottom: 'none' }}>Date</th>
                  <th style={{ borderBottom: 'none' }}>Status</th>
                  <th className="text-right" style={{ borderBottom: 'none' }}>Amount</th>
                </tr>
              </thead>
              <tbody>
                {invoices.length === 0 ? (
                  <tr>
                    <td colSpan={5}>
                      <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                        <FiFileText size={48} color="#cbd5e1" style={{ marginBottom: '1rem' }} />
                        <h4 style={{ margin: '0 0 0.5rem', color: 'var(--text)' }}>No invoices yet</h4>
                        <p className="text-muted" style={{ margin: 0 }}>
                          When you generate an invoice, it will appear here.
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  invoices.map((inv) => (
                    <tr 
                      key={inv.id ?? inv.invoice_id}
                      style={{
                        background: '#fff',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
                        transition: 'transform 0.15s, box-shadow 0.15s',
                        cursor: 'pointer',
                        borderRadius: '8px',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.06)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'none';
                        e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.02)';
                      }}
                    >
                      <td style={{ borderTopLeftRadius: '8px', borderBottomLeftRadius: '8px', borderBottom: 'none', padding: '1rem' }}>
                        <Link
                          to={`/invoice/${encodeURIComponent(inv.invoice_id)}`}
                          style={{ color: 'var(--primary)', fontWeight: 700, textDecoration: 'none' }}
                        >
                          {inv.invoice_id}
                        </Link>
                      </td>
                      <td style={{ borderBottom: 'none', padding: '1rem', fontWeight: 500 }}>{inv.cust_name || inv.cust_id || '—'}</td>
                      <td className="text-muted" style={{ borderBottom: 'none', padding: '1rem' }}>{formatDate(inv.created_at)}</td>
                      <td style={{ borderBottom: 'none', padding: '1rem' }}>
                        <span style={{ 
                          display: 'inline-flex', 
                          alignItems: 'center', 
                          gap: '0.3rem', 
                          background: 'rgba(16, 185, 129, 0.1)', 
                          color: '#059669', 
                          padding: '0.3rem 0.6rem', 
                          borderRadius: '20px', 
                          fontSize: '0.75rem', 
                          fontWeight: 700 
                        }}>
                          <FiCheckCircle /> Generated
                        </span>
                      </td>
                      <td className="text-right" style={{ borderTopRightRadius: '8px', borderBottomRightRadius: '8px', borderBottom: 'none', padding: '1rem', fontWeight: 800, color: 'var(--text)' }}>
                        ₹{Number(inv.total_amount ?? inv.final_amount).toLocaleString('en-IN', {
                          minimumFractionDigits: 2,
                        })}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
