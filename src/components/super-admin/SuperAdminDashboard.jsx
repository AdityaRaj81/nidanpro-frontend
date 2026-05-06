import { useEffect, useState } from 'react';
import { Building2, Network, CreditCard, BarChart3, Plus, RefreshCw } from 'lucide-react';
import { Navigate } from 'react-router-dom';
import api from '../../api/axiosConfig';
import Loader from '../common/Loader';
import InlineLoader from '../common/InlineLoader';
import { useAuth } from '../../context/AuthContext';

const initialLabForm = {
  labName: '',
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

const initialBranchForm = {
  labId: '',
  branchName: '',
  address: '',
  phone: '',
  active: true,
};

export default function SuperAdminDashboard() {
  const { staffAuth } = useAuth();
  const role = staffAuth?.role?.toUpperCase();

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [dashboard, setDashboard] = useState(null);
  const [labs, setLabs] = useState([]);
  const [branches, setBranches] = useState([]);
  const [labForm, setLabForm] = useState(initialLabForm);
  const [branchForm, setBranchForm] = useState(initialBranchForm);
  const [savingLab, setSavingLab] = useState(false);
  const [savingBranch, setSavingBranch] = useState(false);
  const [error, setError] = useState('');

  const loadData = async () => {
    try {
      setError('');
      const [dashboardRes, labsRes, branchesRes] = await Promise.all([
        api.get('/super-admin/dashboard'),
        api.get('/super-admin/labs'),
        api.get('/super-admin/branches'),
      ]);
      setDashboard(dashboardRes.data || null);
      setLabs(labsRes.data || []);
      setBranches(branchesRes.data || []);
      if (!branchForm.labId && (labsRes.data || []).length > 0) {
        setBranchForm((prev) => ({ ...prev, labId: String((labsRes.data || [])[0].id) }));
      }
    } catch (err) {
      console.error('Failed to load super admin dashboard', err);
      setError(err.response?.data?.message || 'Failed to load super admin data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (role !== 'SUPER_ADMIN') return;
    loadData();
  }, [role]);

  if (!staffAuth) {
    return <Navigate to="/staff/login?type=admin" replace />;
  }

  if (role && role !== 'SUPER_ADMIN') {
    return <Navigate to="/staff/dashboard" replace />;
  }

  const handleLabSubmit = async (event) => {
    event.preventDefault();
    setSavingLab(true);
    try {
      await api.post('/super-admin/labs', {
        ...labForm,
        subscriptionExpiry: labForm.subscriptionExpiry || null,
      });
      setLabForm(initialLabForm);
      await loadData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add lab');
    } finally {
      setSavingLab(false);
    }
  };

  const handleBranchSubmit = async (event) => {
    event.preventDefault();
    setSavingBranch(true);
    try {
      await api.post('/super-admin/branches', {
        ...branchForm,
        labId: Number(branchForm.labId),
      });
      setBranchForm((prev) => ({ ...initialBranchForm, labId: prev.labId }));
      await loadData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add branch');
    } finally {
      setSavingBranch(false);
    }
  };

  const stats = dashboard
    ? [
      { label: 'Registered Labs', value: dashboard.totalLabs, icon: Building2 },
      { label: 'Active Labs', value: dashboard.activeLabs, icon: Building2 },
      { label: 'Suspended Labs', value: dashboard.suspendedLabs, icon: CreditCard },
      { label: 'Total Branches', value: dashboard.totalBranches, icon: Network },
      { label: 'Active Branches', value: dashboard.activeBranches, icon: Network },
      { label: 'Daily Usage', value: dashboard.dailyUsage, icon: BarChart3 },
    ]
    : [];

  if (loading) {
    return <Loader message="Loading super admin dashboard..." />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-text-secondary uppercase tracking-wide">Super Admin Control Panel</p>
          <h1 className="text-h1 font-bold text-text-primary">SaaS Dashboard</h1>
          <p className="text-text-secondary max-w-2xl">Platform-level controls for labs, subscriptions, branches, and usage. Medical data stays in tenant dashboards only.</p>
        </div>
        <button
          type="button"
          onClick={() => {
            setRefreshing(true);
            loadData();
          }}
          className="btn-secondary flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="card p-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-text-secondary">{stat.label}</p>
                  <p className="mt-2 text-3xl font-bold text-text-primary">{stat.value}</p>
                </div>
                <div className="rounded-xl border border-border bg-white p-3 text-primary">
                  <Icon className="w-6 h-6" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-h3 font-semibold text-text-primary">Labs Management</h2>
              <p className="text-sm text-text-secondary">Create and monitor SaaS tenant labs.</p>
            </div>
            <Plus className="w-5 h-5 text-primary" />
          </div>

          <form onSubmit={handleLabSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Lab Name *</label>
                <input className="input-field" value={labForm.labName} onChange={(e) => setLabForm((prev) => ({ ...prev, labName: e.target.value }))} required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Subdomain</label>
                <input className="input-field" value={labForm.subdomain} onChange={(e) => setLabForm((prev) => ({ ...prev, subdomain: e.target.value }))} placeholder="labname" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Custom Domain</label>
                <input className="input-field" value={labForm.customDomain} onChange={(e) => setLabForm((prev) => ({ ...prev, customDomain: e.target.value }))} placeholder="lab.example.com" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Logo URL</label>
                <input className="input-field" value={labForm.logoUrl} onChange={(e) => setLabForm((prev) => ({ ...prev, logoUrl: e.target.value }))} placeholder="https://..." />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Primary Color</label>
                <input type="color" className="input-field h-12" value={labForm.primaryColor} onChange={(e) => setLabForm((prev) => ({ ...prev, primaryColor: e.target.value }))} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Secondary Color</label>
                <input type="color" className="input-field h-12" value={labForm.secondaryColor} onChange={(e) => setLabForm((prev) => ({ ...prev, secondaryColor: e.target.value }))} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Subscription Plan *</label>
                <select className="input-field" value={labForm.subscriptionPlan} onChange={(e) => setLabForm((prev) => ({ ...prev, subscriptionPlan: e.target.value }))}>
                  <option value="BASIC">BASIC</option>
                  <option value="STANDARD">STANDARD</option>
                  <option value="PRO">PRO</option>
                  <option value="ENTERPRISE">ENTERPRISE</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Subscription Expiry</label>
                <input type="date" className="input-field" value={labForm.subscriptionExpiry} onChange={(e) => setLabForm((prev) => ({ ...prev, subscriptionExpiry: e.target.value }))} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Payment Status *</label>
                <select className="input-field" value={labForm.paymentStatus} onChange={(e) => setLabForm((prev) => ({ ...prev, paymentStatus: e.target.value }))}>
                  <option value="PENDING">PENDING</option>
                  <option value="PAID">PAID</option>
                  <option value="OVERDUE">OVERDUE</option>
                  <option value="SUSPENDED">SUSPENDED</option>
                </select>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-gray-50 p-4 space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-text-primary">Lab Owner Account</h3>
                <p className="text-xs text-text-secondary">Created together with this lab. This account will log into the lab-admin portal.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Owner Name *</label>
                  <input className="input-field" value={labForm.adminName} onChange={(e) => setLabForm((prev) => ({ ...prev, adminName: e.target.value }))} required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Owner Email *</label>
                  <input type="email" className="input-field" value={labForm.adminEmail} onChange={(e) => setLabForm((prev) => ({ ...prev, adminEmail: e.target.value }))} required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Owner Password *</label>
                  <input type="password" className="input-field" value={labForm.adminPassword} onChange={(e) => setLabForm((prev) => ({ ...prev, adminPassword: e.target.value }))} required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Owner Phone</label>
                  <input className="input-field" value={labForm.adminPhone} onChange={(e) => setLabForm((prev) => ({ ...prev, adminPhone: e.target.value }))} />
                </div>
              </div>
            </div>

            <label className="flex items-center gap-3 rounded-lg border border-border px-4 py-3">
              <input type="checkbox" checked={labForm.active} onChange={(e) => setLabForm((prev) => ({ ...prev, active: e.target.checked }))} />
              <span className="text-sm font-medium text-text-primary">Active Lab</span>
            </label>

            <button type="submit" disabled={savingLab} className="btn-primary flex items-center justify-center gap-2">
              {savingLab ? <InlineLoader /> : 'Add New Lab'}
            </button>
          </form>
        </div>

        <div className="card p-6 space-y-4">
          <h2 className="text-h3 font-semibold text-text-primary">Branch Management</h2>
          <p className="text-sm text-text-secondary">Register branches for a lab.</p>

          <form onSubmit={handleBranchSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Lab *</label>
              <select
                className="input-field"
                value={branchForm.labId}
                onChange={(e) => setBranchForm((prev) => ({ ...prev, labId: e.target.value }))}
                required
              >
                <option value="">Select a lab</option>
                {labs.map((lab) => (
                  <option key={lab.id} value={lab.id}>{lab.labName}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Branch Name *</label>
              <input className="input-field" value={branchForm.branchName} onChange={(e) => setBranchForm((prev) => ({ ...prev, branchName: e.target.value }))} required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Address</label>
              <textarea className="input-field" rows={3} value={branchForm.address} onChange={(e) => setBranchForm((prev) => ({ ...prev, address: e.target.value }))} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Phone</label>
              <input className="input-field" value={branchForm.phone} onChange={(e) => setBranchForm((prev) => ({ ...prev, phone: e.target.value }))} />
            </div>

            <label className="flex items-center gap-3 rounded-lg border border-border px-4 py-3">
              <input type="checkbox" checked={branchForm.active} onChange={(e) => setBranchForm((prev) => ({ ...prev, active: e.target.checked }))} />
              <span className="text-sm font-medium text-text-primary">Active Branch</span>
            </label>

            <button type="submit" disabled={savingBranch || labs.length === 0} className="btn-primary flex items-center justify-center gap-2">
              {savingBranch ? <InlineLoader /> : 'Add Branch'}
            </button>
          </form>
        </div>
      </div>

      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-h3 font-semibold text-text-primary">Registered Labs</h2>
          <span className="text-sm text-text-secondary">{labs.length} total</span>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-text-secondary">
                <th className="py-3 pr-4 font-medium">Lab</th>
                <th className="py-3 pr-4 font-medium">Subdomain</th>
                <th className="py-3 pr-4 font-medium">Plan</th>
                <th className="py-3 pr-4 font-medium">Payment</th>
                <th className="py-3 pr-4 font-medium">Expiry</th>
                <th className="py-3 pr-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {labs.map((lab) => (
                <tr key={lab.id} className="border-b border-border/60">
                  <td className="py-3 pr-4 font-medium text-text-primary">{lab.labName}</td>
                  <td className="py-3 pr-4 text-text-secondary">{lab.subdomain || '-'}</td>
                  <td className="py-3 pr-4 text-text-secondary">{lab.subscriptionPlan}</td>
                  <td className="py-3 pr-4 text-text-secondary">{lab.paymentStatus}</td>
                  <td className="py-3 pr-4 text-text-secondary">{lab.subscriptionExpiry || '-'}</td>
                  <td className="py-3 pr-4">
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${lab.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {lab.active ? 'Active' : 'Suspended'}
                    </span>
                  </td>
                </tr>
              ))}
              {labs.length === 0 && (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-text-secondary">No labs registered yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-h3 font-semibold text-text-primary">Branches</h2>
          <span className="text-sm text-text-secondary">{branches.length} total</span>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-text-secondary">
                <th className="py-3 pr-4 font-medium">Lab</th>
                <th className="py-3 pr-4 font-medium">Branch</th>
                <th className="py-3 pr-4 font-medium">Address</th>
                <th className="py-3 pr-4 font-medium">Phone</th>
                <th className="py-3 pr-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {branches.map((branch) => (
                <tr key={branch.id} className="border-b border-border/60">
                  <td className="py-3 pr-4 text-text-secondary">{branch.labName || '-'}</td>
                  <td className="py-3 pr-4 font-medium text-text-primary">{branch.branchName}</td>
                  <td className="py-3 pr-4 text-text-secondary">{branch.address || '-'}</td>
                  <td className="py-3 pr-4 text-text-secondary">{branch.phone || '-'}</td>
                  <td className="py-3 pr-4">
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${branch.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {branch.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                </tr>
              ))}
              {branches.length === 0 && (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-text-secondary">No branches added yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
