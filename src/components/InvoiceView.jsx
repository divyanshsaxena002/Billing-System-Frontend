import { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { FiDownload } from 'react-icons/fi';

/**
 * Printable-style invoice summary from GET /invoice/:id payload (or equivalent shape).
 */
export default function InvoiceView({ invoice }) {
  const invoiceRef = useRef(null);
  const [isDownloading, setIsDownloading] = useState(false);

  if (!invoice) return null;

  const lines = invoice.items || invoice.lines || [];
  const subtotal = lines.reduce((sum, line) => {
    const q = Number(line.quantity) || 0;
    const p = Number(line.price) || 0;
    return sum + q * p;
  }, 0);

  const total = Number(invoice.total_amount ?? invoice.final_amount ?? 0);
  const gstApplied = Boolean(invoice.gst_applied);
  const gstAmount = gstApplied ? Math.max(0, parseFloat((total - subtotal).toFixed(2))) : 0;
  const subRounded = parseFloat(subtotal.toFixed(2));

  const created = invoice.created_at ? new Date(invoice.created_at) : null;
  const dateStr = created && !Number.isNaN(created.getTime()) ? created.toLocaleString() : '—';

  const downloadInvoicePDF = async () => {
    if (!invoiceRef.current) return;
    try {
      setIsDownloading(true);
      const canvas = await html2canvas(invoiceRef.current, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Invoice_${invoice.invoice_id || 'document'}.pdf`);
    } catch (err) {
      console.error('Failed to generate PDF', err);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
        <button 
          className="btn btn--primary" 
          onClick={downloadInvoicePDF} 
          disabled={isDownloading}
        >
          <FiDownload /> {isDownloading ? 'Generating...' : 'Download PDF'}
        </button>
      </div>

      <div className="invoice-view" ref={invoiceRef} style={{ background: '#fff', padding: '1.5rem', borderRadius: '8px' }}>
        <div className="invoice-view__header">
          <h3 className="invoice-view__title">Invoice</h3>
          <p className="invoice-view__meta">
            <strong>Invoice ID:</strong> {invoice.invoice_id || '—'}
          </p>
          <p className="invoice-view__meta">
            <strong>Customer:</strong> {invoice.cust_name || invoice.cust_id || '—'}
          </p>
          <p className="invoice-view__meta">
            <strong>Date:</strong> {dateStr}
          </p>
        </div>

        <div className="table-wrap invoice-view__table">
          <table className="table">
            <thead>
              <tr>
                <th>Item</th>
                <th className="text-right">Qty</th>
                <th className="text-right">Unit price</th>
                <th className="text-right">Line total</th>
              </tr>
            </thead>
            <tbody>
              {lines.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-muted" style={{ textAlign: 'center' }}>
                    No line items
                  </td>
                </tr>
              ) : (
                lines.map((line, idx) => {
                  const q = Number(line.quantity) || 0;
                  const p = Number(line.price) || 0;
                  const lt = q * p;
                  return (
                    <tr key={`${line.item_id}-${idx}`}>
                      <td>{line.item_name || line.item_id || '—'}</td>
                      <td className="text-right">{q}</td>
                      <td className="text-right">₹{p.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                      <td className="text-right">₹{lt.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="invoice-view__totals">
          <div className="summary-row">
            <span className="text-muted">Subtotal</span>
            <span className="fw-700">₹{subRounded.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
          </div>
          <div className="summary-row">
            <span className="text-muted">GST {gstApplied ? '(18%)' : '(not applied)'}</span>
            <span className="fw-700">₹{gstAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
          </div>
          <div className="summary-row summary-row--emphasis">
            <span>Final amount</span>
            <span className="summary-value--primary">
              ₹{total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
