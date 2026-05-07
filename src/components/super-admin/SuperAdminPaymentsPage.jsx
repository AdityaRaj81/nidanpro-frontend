import { useEffect, useState } from 'react';
import { ArrowLeft, Plus } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../api/axiosConfig';

const initialPayment = {
  subscriptionPlan: 'BASIC',
  amount: '',
  paymentStatus: 'PAID',
  periodStart: '',
  periodEnd: '',
  remarks: '',
};

function getErrorMessage(err, fallback) {
  return err?.response?.data?.message || err?.response?.data?.error || fallback;
}

export default function SuperAdminPaymentsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [lab, setLab] = useState(null);
  const [payments, setPayments] = useState([]);
  const [form, setForm] = useState(initialPayment);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const load = async () => {
    try {
      setError('');
      const [labRes, paymentsRes] = await Promise.all([
        api.get(`/super-admin/labs/${id}`),
        api.get(`/super-admin/labs/${id}/payments`),
      ]);
      setLab(labRes.data);
      setPayments(paymentsRes.data || []);
      setForm((prev) => ({ ...prev, subscriptionPlan: labRes.data.subscriptionPlan || 'BASIC' }));
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to load payment history'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [id]);

  const addPayment = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    try {
      await api.post(`/super-admin/labs/${id}/payments`, {
        ...form,
        amount: Number(form.amount),
        periodStart: form.periodStart || null,
        periodEnd: form.periodEnd || null,
        remarks: form.remarks || null,
      });
      setForm((prev) => ({ ...initialPayment, subscriptionPlan: prev.subscriptionPlan }));
      await load();
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to save payment'));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p className="text-text-secondary">Loading payment history...</p>;
  }

  return (
    <div className="space-y-6">
      <button
        type="button"
        onClick={() => navigate('/super-admin/labs')}
        className="inline-flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-gray-50"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Labs
      </button>

      <div>
        <h2 className="text-3xl font-bold text-text-primary">Payment History</h2>
        <p className="text-text-secondary mt-1">{lab?.labName} ({lab?.labNumber})</p>
      </div>

      {error && <div className="rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

      <form onSubmit={addPayment} className="card p-6 space-y-4">
        <h3 className="text-lg font-semibold text-text-primary flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Add Payment Record
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Plan</label>
            <select className="input-field" value={form.subscriptionPlan} onChange={(e) => setForm((v) => ({ ...v, subscriptionPlan: e.target.value }))}>
              <option value="BASIC">BASIC</option>
              <option value="STANDARD">STANDARD</option>
              <option value="PRO">PRO</option>
              <option value="ENTERPRISE">ENTERPRISE</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Amount</label>
            <input type="number" min="0" step="0.01" className="input-field" value={form.amount} onChange={(e) => setForm((v) => ({ ...v, amount: e.target.value }))} required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Payment Status</label>
            <select className="input-field" value={form.paymentStatus} onChange={(e) => setForm((v) => ({ ...v, paymentStatus: e.target.value }))}>
              <option value="PAID">PAID</option>
              <option value="PENDING">PENDING</option>
              <option value="OVERDUE">OVERDUE</option>
              <option value="SUSPENDED">SUSPENDED</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Period Start</label>
            <input type="date" className="input-field" value={form.periodStart} onChange={(e) => setForm((v) => ({ ...v, periodStart: e.target.value }))} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Period End</label>
            <input type="date" className="input-field" value={form.periodEnd} onChange={(e) => setForm((v) => ({ ...v, periodEnd: e.target.value }))} />
          </div>
          <div className="md:col-span-1">
            <label className="block text-sm font-medium mb-2">Remarks</label>
            <input className="input-field" value={form.remarks} onChange={(e) => setForm((v) => ({ ...v, remarks: e.target.value }))} placeholder="optional" />
          </div>
        </div>

        <button type="submit" disabled={saving} className="px-5 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-medium disabled:opacity-60">
          {saving ? 'Saving...' : 'Save Payment'}
        </button>
      </form>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-border">
                <th className="px-4 py-3 text-left font-semibold">Date</th>
                <th className="px-4 py-3 text-left font-semibold">Plan</th>
                <th className="px-4 py-3 text-left font-semibold">Amount</th>
                <th className="px-4 py-3 text-left font-semibold">Status</th>
                <th className="px-4 py-3 text-left font-semibold">Period</th>
                <th className="px-4 py-3 text-left font-semibold">Remarks</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment) => (
                <tr key={payment.id} className="border-b border-border/70">
                  <td className="px-4 py-3 text-text-secondary">{new Date(payment.createdAt).toLocaleString()}</td>
                  <td className="px-4 py-3">{payment.subscriptionPlan}</td>
                  <td className="px-4 py-3">₹{payment.amount}</td>
                  <td className="px-4 py-3">{payment.paymentStatus}</td>
                  <td className="px-4 py-3 text-text-secondary">{payment.periodStart || '-'} to {payment.periodEnd || '-'}</td>
                  <td className="px-4 py-3 text-text-secondary">{payment.remarks || '-'}</td>
                </tr>
              ))}
              {payments.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-6 py-10 text-center text-text-secondary">No payment history yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
