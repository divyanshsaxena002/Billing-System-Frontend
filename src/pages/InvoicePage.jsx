import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchInvoiceById } from '../services/api';
import Card from '../components/Card';
import InvoiceView from '../components/InvoiceView';

export default function InvoicePage() {
  const { invoiceRef } = useParams();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      if (!invoiceRef) {
        setError('Missing invoice reference.');
        setLoading(false);
        return;
      }
      try {
        setError(null);
        setLoading(true);
        const data = await fetchInvoiceById(invoiceRef);
        if (!cancelled) setInvoice(data);
      } catch (err) {
        console.error('Failed to load invoice', err);
        if (!cancelled) {
          setError('Invoice not found or could not be loaded.');
          setInvoice(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [invoiceRef]);

  return (
    <div>
      <div className="page-header" style={{ marginBottom: '1rem' }}>
        <h2 className="page-title page-title--lg">Invoice</h2>
        <Link to="/dashboard" className="btn btn--primary">
          Back to dashboard
        </Link>
      </div>

      {loading ? (
        <div className="spinner-wrap">
          <div className="spinner" />
        </div>
      ) : error ? (
        <p className="text-error">{error}</p>
      ) : (
        <Card>
          <InvoiceView invoice={invoice} />
        </Card>
      )}
    </div>
  );
}
