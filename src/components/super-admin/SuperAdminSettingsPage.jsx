import { useEffect, useState } from 'react';
import api from '../../api/axiosConfig';

function getErrorMessage(err, fallback) {
  return err?.response?.data?.message || err?.response?.data?.error || fallback;
}

export default function SuperAdminSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        setError('');
        const response = await api.get('/super-admin/settings');
        setSummary(response.data);
      } catch (err) {
        setError(getErrorMessage(err, 'Failed to load settings summary'));
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (loading) {
    return <p className="text-text-secondary">Loading system settings...</p>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-text-primary">System Settings</h2>
        <p className="text-text-secondary mt-1">Database-backed platform and subscription metrics.</p>
      </div>

      {error && <div className="rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

      {summary && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="card p-5"><p className="text-sm text-text-secondary">Total Labs</p><p className="text-2xl font-bold mt-1">{summary.totalLabs}</p></div>
            <div className="card p-5"><p className="text-sm text-text-secondary">Active Labs</p><p className="text-2xl font-bold mt-1">{summary.activeLabs}</p></div>
            <div className="card p-5"><p className="text-sm text-text-secondary">Suspended Labs</p><p className="text-2xl font-bold mt-1">{summary.suspendedLabs}</p></div>
            <div className="card p-5"><p className="text-sm text-text-secondary">Total Branches</p><p className="text-2xl font-bold mt-1">{summary.totalBranches}</p></div>
            <div className="card p-5"><p className="text-sm text-text-secondary">Total Lab Users</p><p className="text-2xl font-bold mt-1">{summary.totalLabUsers}</p></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="card p-5">
              <h3 className="text-lg font-semibold mb-3">Subscription Plans</h3>
              <div className="space-y-2 text-sm">
                <p className="flex justify-between"><span>BASIC</span><span className="font-semibold">{summary.basicPlans}</span></p>
                <p className="flex justify-between"><span>STANDARD</span><span className="font-semibold">{summary.standardPlans}</span></p>
                <p className="flex justify-between"><span>PRO</span><span className="font-semibold">{summary.proPlans}</span></p>
                <p className="flex justify-between"><span>ENTERPRISE</span><span className="font-semibold">{summary.enterprisePlans}</span></p>
              </div>
            </div>
            <div className="card p-5">
              <h3 className="text-lg font-semibold mb-3">Payment Status</h3>
              <div className="space-y-2 text-sm">
                <p className="flex justify-between"><span>PAID</span><span className="font-semibold">{summary.paidLabs}</span></p>
                <p className="flex justify-between"><span>PENDING</span><span className="font-semibold">{summary.pendingLabs}</span></p>
                <p className="flex justify-between"><span>OVERDUE</span><span className="font-semibold">{summary.overdueLabs}</span></p>
                <p className="flex justify-between"><span>SUSPENDED</span><span className="font-semibold">{summary.suspendedPayments}</span></p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
