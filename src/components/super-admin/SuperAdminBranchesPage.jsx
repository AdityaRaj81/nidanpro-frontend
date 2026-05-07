import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axiosConfig';

export default function SuperAdminBranchesPage() {
  const [loading, setLoading] = useState(true);
  const [branches, setBranches] = useState([]);
  const [query, setQuery] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        setError('');
        const res = await api.get('/super-admin/branches');
        setBranches(res.data || []);
      } catch (e) {
        setError(e.response?.data?.message || e.response?.data?.error || 'Failed to load branches');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = branches.filter(b => {
    const q = query.toLowerCase();
    return (b.branchName || '').toLowerCase().includes(q) || (b.labName || '').toLowerCase().includes(q);
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Branches</h2>
          <p className="text-text-secondary mt-1">Manage branches for all labs.</p>
        </div>
        <div className="flex items-center gap-3">
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search branches or labs" className="input-field" />
          <button onClick={() => navigate('/super-admin/branches/new')} className="px-4 py-2 bg-blue-600 text-white rounded-lg">Add Branch</button>
        </div>
      </div>

      {error && <div className="rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

      <div className="card p-4">
        {loading ? (
          <p className="text-text-secondary">Loading branches...</p>
        ) : filtered.length === 0 ? (
          <p className="text-text-secondary">No branches found.</p>
        ) : (
          <div className="overflow-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="text-left text-text-secondary">
                  <th className="px-4 py-2">Lab</th>
                  <th className="px-4 py-2">Branch</th>
                  <th className="px-4 py-2">Phone</th>
                  <th className="px-4 py-2">Active</th>
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(b => (
                  <tr key={b.id} className="border-t">
                    <td className="px-4 py-3">{b.labName}</td>
                    <td className="px-4 py-3">{b.branchName}</td>
                    <td className="px-4 py-3">{b.phone || '-'}</td>
                    <td className="px-4 py-3">{b.active ? 'Active' : 'Inactive'}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button onClick={() => navigate(`/super-admin/branches/${b.id}/edit`)} className="px-3 py-1 rounded bg-blue-50 text-blue-700">Edit</button>
                        <button onClick={() => navigate(`/super-admin/branches/${b.id}/delete`)} className="px-3 py-1 rounded bg-red-50 text-red-700">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
