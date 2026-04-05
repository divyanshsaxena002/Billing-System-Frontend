import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createCustomer } from '../services/api';

export default function AddCustomer() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    address: '',
    pan: '',
    gst: '',
    status: 'Active',
  });
  const [submitting, setSubmitting] = useState(false);

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleCreate = async () => {
    if (!form.name?.trim()) return;
    try {
      setSubmitting(true);
      await createCustomer({
        cust_name: form.name.trim(),
        address: form.address,
        pan: form.pan,
        gst: form.gst,
        is_active: form.status === 'Active',
      });
      navigate('/customers');
    } catch (err) {
      console.error('Failed to create customer', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="form-stack form-stack--narrow">
      <h2 className="page-title mb-3" style={{ marginBottom: '1.5rem' }}>
        Add Customer
      </h2>
      <div className="form-group">
        <label htmlFor="cust-name">Customer Name</label>
        <input
          id="cust-name"
          className="input"
          required
          value={form.name}
          onChange={update('name')}
        />
      </div>
      <div className="form-group">
        <label htmlFor="cust-address">Customer Address</label>
        <textarea
          id="cust-address"
          className="textarea"
          rows={3}
          value={form.address}
          onChange={update('address')}
        />
      </div>
      <div className="form-group">
        <label htmlFor="cust-pan">PAN Number</label>
        <input id="cust-pan" className="input" value={form.pan} onChange={update('pan')} />
      </div>
      <div className="form-group">
        <label htmlFor="cust-gst">GST Number</label>
        <input id="cust-gst" className="input" value={form.gst} onChange={update('gst')} />
      </div>
      <div className="form-group">
        <label htmlFor="cust-status">Status</label>
        <select id="cust-status" className="select" value={form.status} onChange={update('status')}>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>
      <div className="form-actions">
        <button type="button" className="btn btn--outline-danger" onClick={() => navigate(-1)}>
          Cancel
        </button>
        <button type="button" className="btn btn--primary" onClick={handleCreate} disabled={submitting}>
          Create
        </button>
      </div>
    </div>
  );
}
