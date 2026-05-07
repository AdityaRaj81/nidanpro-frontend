import { useEffect, useState } from 'react';
import { Building2, Pencil, Plus, ReceiptText, Search, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axiosConfig';

function getErrorMessage(err, fallback) {
  return err?.response?.data?.message || err?.response?.data?.error || fallback;
}

export default function SuperAdminLabsPage() {
  const [loading, setLoading] = useState(true);
  const [labs, setLabs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const loadLabs = async () => {
    try {
      setError('');
      const response = await api.get('/super-admin/labs');
      setLabs(response.data || []);
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to load labs'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLabs();
  }, []);

  const filteredLabs = labs.filter((lab) => {
    const q = searchTerm.toLowerCase();
    return (
      lab.labName?.toLowerCase().includes(q) ||
      lab.labNumber?.toLowerCase().includes(q) ||
      lab.subscriptionPlan?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-text-primary">Labs Management</h2>
          <p className="text-text-secondary mt-1">Manage labs, subscription plans, and payment status.</p>
        </div>
        <button
          type="button"
          onClick={() => navigate('/super-admin/labs/new')}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add New Lab
        </button>
      </div>

      {error && (
        <div className="rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="card p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
          <input
            type="text"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search by lab name, number, or plan"
            className="input-field pl-10"
          />
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-border">
                <th className="px-4 py-3 text-left font-semibold">Lab</th>
                <th className="px-4 py-3 text-left font-semibold">Lab Number</th>
                <th className="px-4 py-3 text-left font-semibold">Plan</th>
                <th className="px-4 py-3 text-left font-semibold">Payment</th>
                <th className="px-4 py-3 text-left font-semibold">Expiry</th>
                <th className="px-4 py-3 text-left font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {!loading && filteredLabs.map((lab) => (
                <tr key={lab.id} className="border-b border-border/70 hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <p className="font-semibold text-text-primary">{lab.labName}</p>
                    <p className="text-xs text-text-secondary">{lab.subdomain || lab.customDomain || 'No domain set'}</p>
                  </td>
                  <td className="px-4 py-3 text-text-secondary">{lab.labNumber}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 rounded bg-blue-50 text-blue-700 text-xs font-medium">{lab.subscriptionPlan}</span>
                  </td>
                  <td className="px-4 py-3 text-text-secondary">{lab.paymentStatus}</td>
                  <td className="px-4 py-3 text-text-secondary">{lab.subscriptionExpiry || '-'}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => navigate(`/super-admin/labs/${lab.id}/payments`)}
                        className="p-2 rounded hover:bg-purple-50 text-purple-700"
                        title="Payment History"
                      >
                        <ReceiptText className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => navigate(`/super-admin/labs/${lab.id}/edit`)}
                        className="p-2 rounded hover:bg-blue-50 text-blue-700"
                        title="Edit Lab"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => navigate(`/super-admin/labs/${lab.id}/delete`)}
                        className="p-2 rounded hover:bg-red-50 text-red-700"
                        title="Delete Lab"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!loading && filteredLabs.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-text-secondary">
                    <Building2 className="w-10 h-10 mx-auto opacity-30 mb-2" />
                    No labs found
                  </td>
                </tr>
              )}
              {loading && (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-text-secondary">Loading labs...</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
