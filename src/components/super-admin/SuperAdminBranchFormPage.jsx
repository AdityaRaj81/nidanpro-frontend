import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../api/axiosConfig';

const empty = { labId: '', branchName: '', address: '', phone: '', active: true };

export default function SuperAdminBranchFormPage() {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const [form, setForm] = useState(empty);
  const [labs, setLabs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        setError('');
        const [labsRes] = await Promise.all([api.get('/super-admin/labs')]);
        setLabs(labsRes.data || []);
        if (isEdit) {
          const res = await api.get(`/super-admin/branches/${id}`);
          setForm({
            labId: res.data.labId || '',
            branchName: res.data.branchName || '',
            address: res.data.address || '',
            phone: res.data.phone || '',
            active: res.data.active,
          });
        }
      } catch (e) {
        setError(e.response?.data?.message || e.response?.data?.error || 'Failed to load branch form');
      } finally {
        setLoading(false);
      }
    })();
  }, [id, isEdit]);

  async function submit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      setError('');
      const payload = { ...form, labId: Number(form.labId) };
      if (isEdit) {
        await api.put(`/super-admin/branches/${id}`, payload);
      } else {
        await api.post('/super-admin/branches', payload);
      }
      navigate('/super-admin/branches');
    } catch (e) {
      setError(e.response?.data?.message || e.response?.data?.error || 'Failed to save branch');
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p className="text-text-secondary">Loading form...</p>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">{isEdit ? 'Edit Branch' : 'Add Branch'}</h2>
          <p className="text-text-secondary mt-1">{isEdit ? 'Update branch details' : 'Create a new branch'}</p>
        </div>
        <button onClick={() => navigate('/super-admin/branches')} className="px-4 py-2 border rounded">Back</button>
      </div>

      {error && <div className="rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

      <form onSubmit={submit} className="card p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Lab *</label>
            <select value={form.labId} onChange={e => setForm(f => ({ ...f, labId: e.target.value }))} required className="input-field">
              <option value="">Select lab</option>
              {labs.map(l => <option key={l.id} value={l.id}>{l.labName} ({l.labNumber || '-'})</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Branch Name *</label>
            <input className="input-field" value={form.branchName} onChange={e => setForm(f => ({ ...f, branchName: e.target.value }))} required />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Address</label>
            <input className="input-field" value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Phone</label>
            <input className="input-field" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={!!form.active} onChange={e => setForm(f => ({ ...f, active: e.target.checked }))} />
            <span className="text-sm">Active</span>
          </label>
        </div>

        <div className="flex gap-3">
          <button type="submit" className="px-6 py-3 rounded bg-blue-600 text-white" disabled={saving}>{saving ? 'Saving...' : isEdit ? 'Update Branch' : 'Create Branch'}</button>
          <button type="button" onClick={() => navigate('/super-admin/branches')} className="px-6 py-3 rounded border">Cancel</button>
        </div>
      </form>
    </div>
  );
}
