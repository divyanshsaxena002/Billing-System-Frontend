import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createItem } from '../services/api';

export default function AddItem() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    sellingPrice: '',
    status: 'Active',
  });
  const [submitting, setSubmitting] = useState(false);

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleCreate = async () => {
    if (!form.name?.trim()) return;
    try {
      setSubmitting(true);
      await createItem({
        item_name: form.name.trim(),
        price:     form.sellingPrice === '' ? 0 : Number(form.sellingPrice),
        is_active: form.status === 'Active' ? 'Y' : 'N',
      });
      navigate('/items');
    } catch (err) {
      console.error('Failed to create item', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="form-stack form-stack--item">
      <h2 className="page-title mb-3" style={{ marginBottom: '1.5rem' }}>
        Add Item
      </h2>
      <div className="form-group">
        <label htmlFor="item-name">Item Name</label>
        <input
          id="item-name"
          className="input"
          required
          value={form.name}
          onChange={update('name')}
        />
      </div>
      <div className="form-group">
        <label htmlFor="item-price">Selling Price</label>
        <input
          id="item-price"
          className="input"
          type="number"
          min={0}
          step={0.01}
          value={form.sellingPrice}
          onChange={update('sellingPrice')}
        />
      </div>
      <div className="form-group">
        <label htmlFor="item-status">Status</label>
        <select id="item-status" className="select" value={form.status} onChange={update('status')}>
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
