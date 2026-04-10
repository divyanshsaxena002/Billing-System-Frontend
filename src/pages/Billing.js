import { useEffect, useMemo, useState } from 'react';
import { fetchCustomers, fetchItems, createInvoice, fetchInvoiceById } from '../services/api';
import Card from '../components/Card';
import InvoiceView from '../components/InvoiceView';

const GST_RATE = 0.18;

export default function Billing() {
  const [customerId, setCustomerId] = useState('');
  const [itemId, setItemId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [lines, setLines] = useState([]);

  const [customers, setCustomers] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [invoiceSubmitting, setInvoiceSubmitting] = useState(false);
  const [generatedInvoice, setGeneratedInvoice] = useState(null);
  const [invoiceError, setInvoiceError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        setLoadError(null);
        setLoading(true);
        const [customerList, itemList] = await Promise.all([fetchCustomers(), fetchItems()]);
        if (!cancelled) {
          setCustomers(customerList);
          setItems(itemList);
        }
      } catch (err) {
        console.error('Failed to fetch billing data', err);
        if (!cancelled) {
          setLoadError(err.userMessage || 'Could not load customers or items. Is the backend running?');
          setCustomers([]);
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

  const selectedItem = useMemo(() => items.find((i) => i.id === itemId), [items, itemId]);

  const subtotal = useMemo(
    () => lines.reduce((sum, row) => sum + row.quantity * row.unitPrice, 0),
    [lines],
  );
  const gstAmount = subtotal * GST_RATE;
  const finalAmount = subtotal + gstAmount;

  const addLine = () => {
    if (!itemId || !selectedItem) return;
    const qty = Math.max(1, Number(quantity) || 1);
    setLines((prev) => {
      const existing = prev.findIndex((l) => l.itemId === itemId);
      if (existing >= 0) {
        const next = [...prev];
        next[existing] = {
          ...next[existing],
          quantity: next[existing].quantity + qty,
        };
        return next;
      }
      return [
        ...prev,
        {
          id: `${itemId}-${Date.now()}`,
          itemId,
          itemName: selectedItem.name,
          quantity: qty,
          unitPrice: selectedItem.sellingPrice,
        },
      ];
    });
    setQuantity(1);
  };

  const removeLine = (id) => setLines((prev) => prev.filter((l) => l.id !== id));

  const generateInvoice = async () => {
    if (!customerId) {
      window.alert('Please select a customer.');
      return;
    }
    if (lines.length === 0) {
      window.alert('Add at least one line to the cart.');
      return;
    }
    try {
      setInvoiceSubmitting(true);
      setGeneratedInvoice(null);
      setInvoiceError(null);
      const payload = {
        cust_id: String(customerId).trim(),
        items: lines.map((l) => ({
          item_id: String(l.itemId).trim(),
          quantity: l.quantity,
        })),
      };
      const data = await createInvoice(payload);
      const ref = data.invoice_id ?? data.invoiceId;
      const full = await fetchInvoiceById(ref);
      setGeneratedInvoice(full);
      setLines([]);
    } catch (err) {
      console.error('Failed to create invoice', err);
      setInvoiceError(err.userMessage || 'Could not generate invoice. Please try again.');
    } finally {
      setInvoiceSubmitting(false);
    }
  };

  return (
    <div>
      <h2 className="page-title mb-3" style={{ marginBottom: '1.5rem' }}>
        Billing
      </h2>
      {loadError && <p className="text-error mb-2">{loadError}</p>}
      {invoiceError && <p className="text-error mb-2">{invoiceError}</p>}
      <div className="grid grid--billing">
        <div>
          <Card>
            <p className="text-muted" style={{ margin: '0 0 1rem', fontSize: '0.8rem', fontWeight: 500 }}>
              Add to cart
            </p>
            {loading ? (
              <div className="spinner-wrap" style={{ padding: '2rem 0' }}>
                <div className="spinner spinner--sm" />
              </div>
            ) : (
              <div className="flex-col-gap">
                <div className="form-group">
                  <label htmlFor="bill-customer">Customer</label>
                  <select
                    id="bill-customer"
                    className="select"
                    value={customerId}
                    onChange={(e) => setCustomerId(e.target.value)}
                  >
                    <option value="">Select customer</option>
                    {customers.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="bill-item">Item</label>
                  <select
                    id="bill-item"
                    className="select"
                    value={itemId}
                    onChange={(e) => setItemId(e.target.value)}
                  >
                    <option value="">Select item</option>
                    {items.map((i) => (
                      <option key={i.id} value={i.id}>
                        {i.name} — ₹{i.sellingPrice.toLocaleString('en-IN')}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="bill-qty">Quantity</label>
                  <input
                    id="bill-qty"
                    className="input"
                    type="number"
                    min={1}
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                  />
                </div>
                <button type="button" className="btn btn--primary btn--align-start" onClick={addLine}>
                  Add
                </button>
              </div>
            )}
          </Card>
        </div>
        <div>
          <Card contentClassName="card__body--flush">
            <div className="card__pad">
              <h3 className="card-row__title" style={{ margin: 0 }}>
                Cart
              </h3>
            </div>
            <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr>
                    <th>Item Name</th>
                    <th className="text-right">Quantity</th>
                    <th className="text-right">Price</th>
                    <th className="text-center" style={{ width: 56 }}>
                      {' '}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {lines.length === 0 ? (
                    <tr>
                      <td colSpan={4}>
                        <p className="text-muted" style={{ margin: '1rem 0', textAlign: 'center' }}>
                          No items in cart yet.
                        </p>
                      </td>
                    </tr>
                  ) : (
                    lines.map((row) => (
                      <tr key={row.id}>
                        <td>{row.itemName}</td>
                        <td className="text-right">{row.quantity}</td>
                        <td className="text-right">₹{(row.quantity * row.unitPrice).toLocaleString('en-IN')}</td>
                        <td className="text-center">
                          <button type="button" className="icon-btn" aria-label="Remove" onClick={() => removeLine(row.id)}>
                            ×
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <hr className="divider" />
            <div className="card__pad flex-col-gap-sm">
              <div className="summary-row">
                <span className="text-muted">Total (before GST)</span>
                <span className="fw-700">₹{subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="summary-row">
                <span className="text-muted">GST ({GST_RATE * 100}%)</span>
                <span className="fw-700">₹{gstAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="summary-row summary-row--emphasis">
                <span className="summary-label">Final Amount</span>
                <span className="summary-value summary-value--primary">
                  ₹{finalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <button
                type="button"
                className="btn btn--primary btn--block mt-1"
                style={{ marginTop: '0.5rem' }}
                onClick={generateInvoice}
                disabled={invoiceSubmitting}
              >
                Generate Invoice
              </button>
            </div>
          </Card>
        </div>
      </div>

      {generatedInvoice && (
        <div className="mt-2">
          <Card>
            <InvoiceView invoice={generatedInvoice} />
          </Card>
        </div>
      )}
    </div>
  );
}
