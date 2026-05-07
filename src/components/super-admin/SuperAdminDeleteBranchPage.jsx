import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../api/axiosConfig';

export default function SuperAdminDeleteBranchPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [branch, setBranch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        setError('');
        const res = await api.get(`/super-admin/branches/${id}`);
        setBranch(res.data);
      } catch (e) {
        setError(e.response?.data?.message || e.response?.data?.error || 'Failed to load branch');
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  async function doDelete() {
    if (!window.confirm('Delete this branch? This cannot be undone.')) return;
    setDeleting(true);
    try {
      await api.delete(`/super-admin/branches/${id}`);
      navigate('/super-admin/branches');
    } catch (e) {
      setError(e.response?.data?.message || e.response?.data?.error || 'Failed to delete branch');
    } finally {
      setDeleting(false);
    }
  }

  if (loading) return <p className="text-text-secondary">Loading delete page...</p>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Delete Branch</h2>
          <p className="text-text-secondary mt-1">Confirm deletion of branch.</p>
        </div>
        <button onClick={() => navigate('/super-admin/branches')} className="px-4 py-2 border rounded">Back</button>
      </div>

      {error && <div className="rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

      <div className="card p-6 border-red-200 bg-red-50">
        <h3 className="text-2xl font-bold text-red-700">Delete {branch?.branchName} ({branch?.labName})</h3>
        <p className="text-sm text-red-700 mt-2">This action cannot be undone. If staff are assigned to this branch, deletion will be blocked.</p>

        <div className="flex gap-3 mt-4">
          <button onClick={doDelete} disabled={deleting} className="px-6 py-3 rounded bg-red-600 text-white">{deleting ? 'Deleting...' : 'Yes, Delete Branch'}</button>
          <button onClick={() => navigate('/super-admin/branches')} className="px-6 py-3 rounded border">Cancel</button>
        </div>
      </div>
    </div>
  );
}
