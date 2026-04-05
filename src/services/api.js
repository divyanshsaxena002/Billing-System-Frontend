import axios from 'axios';

export const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000',
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000,
});

function normalizeStatus(value) {
  if (typeof value === 'boolean') return value ? 'Active' : 'Inactive';
  if (value == null || value === '') return 'Inactive';
  const u = String(value).trim().toUpperCase();
  if (u === 'Y' || u === 'YES') return 'Active';
  if (u === 'N' || u === 'NO') return 'Inactive';
  const t = String(value).trim().toLowerCase();
  if (t === 'active' || t === 'a' || t === '1' || t === 'true') return 'Active';
  if (t === 'inactive' || t === 'i' || t === '0' || t === 'false') return 'Inactive';
  return String(value).charAt(0).toUpperCase() + String(value).slice(1);
}

/** Map DB row to UI customer (supports cust_* columns and is_active Y/N). */
export function mapCustomer(row) {
  if (!row || typeof row !== 'object') return null;
  const name = row.cust_name ?? row.customer_name ?? row.name ?? '';
  const status =
    row.is_active !== undefined && row.is_active !== null
      ? normalizeStatus(row.is_active)
      : normalizeStatus(row.status);
  return {
    id: String(row.cust_id ?? row.id ?? row.customer_id ?? ''),
    name,
    status,
    address: row.cust_address ?? row.address ?? row.customer_address ?? '',
    pan: row.cust_pan ?? row.pan ?? row.pan_number ?? '',
    gst: row.cust_gst ?? row.gst ?? row.gst_number ?? row.gst_no ?? '',
  };
}

/** Map DB row to UI item. */
export function mapItem(row) {
  if (!row || typeof row !== 'object') return null;
  const rawPrice = row.selling_price ?? row.price ?? row.sellingPrice ?? 0;
  const sellingPrice = typeof rawPrice === 'string' ? parseFloat(rawPrice) : Number(rawPrice);
  const status =
    row.is_active !== undefined && row.is_active !== null
      ? normalizeStatus(row.is_active)
      : normalizeStatus(row.status);
  return {
    id: String(row.item_id ?? row.id ?? ''),
    name: row.item_name ?? row.name ?? row.itemname ?? '',
    sellingPrice: Number.isFinite(sellingPrice) ? sellingPrice : 0,
    status,
  };
}

export async function fetchCustomers() {
  const { data } = await api.get('/customers');
  const rows = Array.isArray(data) ? data : [];
  return rows.map(mapCustomer).filter((c) => c && c.id !== '');
}

export async function fetchItems() {
  const { data } = await api.get('/items');
  const rows = Array.isArray(data) ? data : [];
  return rows.map(mapItem).filter((i) => i && i.id !== '');
}

export async function createCustomer(payload) {
  const { data } = await api.post('/customers', payload);
  return data;
}

export async function createItem(payload) {
  const { data } = await api.post('/items', payload);
  return data;
}

export async function createInvoice(payload) {
  const { data } = await api.post('/invoice/create', payload);
  return data;
}

export async function fetchInvoicesAll() {
  const { data } = await api.get('/invoice/all');
  return Array.isArray(data) ? data : [];
}

export async function fetchInvoiceById(id) {
  const { data } = await api.get(`/invoice/${encodeURIComponent(String(id))}`);
  return data;
}
