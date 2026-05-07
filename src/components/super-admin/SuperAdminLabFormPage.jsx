import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../api/axiosConfig';

const initialForm = {
  labName: '',
  labNumber: '',
  subdomain: '',
  customDomain: '',
  logoUrl: '',
  primaryColor: '#1d4ed8',
  secondaryColor: '#10b981',
  subscriptionPlan: 'BASIC',
  subscriptionExpiry: '',
  paymentStatus: 'PENDING',
  active: true,
  adminName: '',
  adminEmail: '',
  adminPassword: '',
  adminPhone: '',
};

function getErrorMessage(err, fallback) {
  return err?.response?.data?.message || err?.response?.data?.error || fallback;
}

export default function SuperAdminLabFormPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isEdit) {
      return;
    }

    const loadLab = async () => {
      try {
        const response = await api.get(`/super-admin/labs/${id}`);
        const lab = response.data;
        setForm((prev) => ({
          ...prev,
          ...lab,
          subscriptionExpiry: lab.subscriptionExpiry || '',
          adminPassword: '',
        }));
      } catch (err) {
        setError(getErrorMessage(err, 'Failed to load lab data'));
      } finally {
        setLoading(false);
      }
    };

    loadLab();
  }, [id, isEdit]);

  const title = useMemo(() => (isEdit ? 'Edit Lab' : 'Add New Lab'), [isEdit]);

  const onSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');

    try {
      const payload = {
        ...form,
        subscriptionExpiry: form.subscriptionExpiry || null,
      };

      if (isEdit) {
        await api.put(`/super-admin/labs/${id}`, payload);
      } else {
        await api.post('/super-admin/labs', payload);
      }

      navigate('/super-admin/labs');
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to save lab'));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p className="text-text-secondary">Loading lab form...</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-text-primary">{title}</h2>
          <p className="text-text-secondary mt-1">Create or update lab details, subscription plan, and owner account.</p>
        </div>
        <button
          type="button"
          onClick={() => navigate('/super-admin/labs')}
          className="inline-flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-gray-50"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Labs
        </button>
      </div>

      {error && <div className="rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

      <form onSubmit={onSubmit} className="card p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Lab Name *</label>
            <input className="input-field" value={form.labName} onChange={(e) => setForm((v) => ({ ...v, labName: e.target.value }))} required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Lab Number *</label>
            <input className="input-field" value={form.labNumber} onChange={(e) => setForm((v) => ({ ...v, labNumber: e.target.value }))} required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Subdomain</label>
            <input className="input-field" value={form.subdomain || ''} onChange={(e) => setForm((v) => ({ ...v, subdomain: e.target.value }))} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Custom Domain</label>
            <input className="input-field" value={form.customDomain || ''} onChange={(e) => setForm((v) => ({ ...v, customDomain: e.target.value }))} />
          </div>
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
            <label className="block text-sm font-medium mb-2">Payment Status</label>
            <select className="input-field" value={form.paymentStatus} onChange={(e) => setForm((v) => ({ ...v, paymentStatus: e.target.value }))}>
              <option value="PENDING">PENDING</option>
              <option value="PAID">PAID</option>
              <option value="OVERDUE">OVERDUE</option>
              <option value="SUSPENDED">SUSPENDED</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Subscription Expiry</label>
            <input type="date" className="input-field" value={form.subscriptionExpiry || ''} onChange={(e) => setForm((v) => ({ ...v, subscriptionExpiry: e.target.value }))} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Owner Name {!isEdit && '*'}</label>
            <input className="input-field" value={form.adminName || ''} onChange={(e) => setForm((v) => ({ ...v, adminName: e.target.value }))} required={!isEdit} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Owner Email {!isEdit && '*'}</label>
            <input type="email" className="input-field" value={form.adminEmail || ''} onChange={(e) => setForm((v) => ({ ...v, adminEmail: e.target.value }))} required={!isEdit} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Owner Password {!isEdit && '*'}</label>
            <input type="password" className="input-field" value={form.adminPassword || ''} onChange={(e) => setForm((v) => ({ ...v, adminPassword: e.target.value }))} required={!isEdit} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Owner Phone</label>
            <input className="input-field" value={form.adminPhone || ''} onChange={(e) => setForm((v) => ({ ...v, adminPhone: e.target.value }))} />
          </div>
        </div>

        <label className="inline-flex items-center gap-3">
          <input type="checkbox" checked={form.active} onChange={(e) => setForm((v) => ({ ...v, active: e.target.checked }))} />
          <span className="text-sm">Lab is active</span>
        </label>

        <div className="flex items-center gap-3">
          <button type="submit" disabled={saving} className="px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium disabled:opacity-60">
            {saving ? 'Saving...' : isEdit ? 'Update Lab' : 'Create Lab'}
          </button>
          <button type="button" onClick={() => navigate('/super-admin/labs')} className="px-6 py-3 rounded-lg border border-border hover:bg-gray-50">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
