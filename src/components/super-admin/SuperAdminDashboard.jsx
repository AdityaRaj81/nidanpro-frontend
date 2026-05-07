import { useEffect, useState } from 'react';
import {
  Building2, Network, CreditCard, BarChart3, Plus, RefreshCw,
  Edit, Trash2, Eye, Search, AlertCircle, CheckCircle2, Clock,
  TrendingUp, Users, DollarSign
} from 'lucide-react';
import { Navigate } from 'react-router-dom';
import api from '../../api/axiosConfig';
import Loader from '../common/Loader';
import InlineLoader from '../common/InlineLoader';
import { useAuth } from '../../context/AuthContext';

const initialLabForm = {
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
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [showLabForm, setShowLabForm] = useState(false);
  const [editingLabId, setEditingLabId] = useState(null);

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
    return <Navigate to="/auth/super-admin-login" replace />;
  }

  if (role && role !== 'SUPER_ADMIN') {
    return <Navigate to={role === 'ADMIN' ? '/lab-admin/dashboard' : '/staff/dashboard'} replace />;
  }

  const handleLabSubmit = async (event) => {
    event.preventDefault();
    setSavingLab(true);
    try {
      if (editingLabId) {
        await api.put(`/super-admin/labs/${editingLabId}`, {
          ...labForm,
          subscriptionExpiry: labForm.subscriptionExpiry || null,
        });
        setSuccess('Lab updated successfully');
        setEditingLabId(null);
      } else {
        await api.post('/super-admin/labs', {
          ...labForm,
          subscriptionExpiry: labForm.subscriptionExpiry || null,
        });
        setSuccess('Lab added successfully');
      }
      setLabForm(initialLabForm);
      setShowLabForm(false);
      setTimeout(() => setSuccess(''), 3000);
      await loadData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save lab');
    } finally {
      setSavingLab(false);
    }
  };

  const handleDeleteLab = async (id) => {
    if (window.confirm('Are you sure you want to delete this lab? This action cannot be undone.')) {
      try {
        await api.delete(`/super-admin/labs/${id}`);
        setSuccess('Lab deleted successfully');
        setTimeout(() => setSuccess(''), 3000);
        await loadData();
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete lab');
      }
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
      setSuccess('Branch added successfully');
      setTimeout(() => setSuccess(''), 3000);
      await loadData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add branch');
    } finally {
      setSavingBranch(false);
    }
  };

  const filteredLabs = labs.filter(lab =>
    lab.labName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lab.labNumber?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = dashboard
    ? [
      { label: 'Total Labs', value: dashboard.totalLabs, icon: Building2, color: 'from-blue-600 to-blue-700' },
      { label: 'Active Labs', value: dashboard.activeLabs, icon: CheckCircle2, color: 'from-green-600 to-green-700' },
      { label: 'Pending Payment', value: dashboard.suspendedLabs, icon: AlertCircle, color: 'from-orange-600 to-orange-700' },
      { label: 'Total Branches', value: dashboard.totalBranches, icon: Network, color: 'from-purple-600 to-purple-700' },
    ]
    : [];

  if (loading) {
    return <Loader message="Loading Super Admin Dashboard..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-start justify-between gap-4 mb-8">
        <div>
          <p className="text-sm font-semibold text-blue-600 uppercase tracking-widest">Platform Management</p>
          <h1 className="text-4xl font-bold text-text-primary mt-2">SaaS Control Center</h1>
          <p className="text-text-secondary mt-2 max-w-2xl">Manage laboratories, subscriptions, and platform operations. All medical data remains isolated in tenant environments.</p>
        </div>
        <button
          type="button"
          onClick={() => {
            setRefreshing(true);
            loadData();
          }}
          disabled={refreshing}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Notifications */}
      {error && (
        <div className="rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Error</p>
            <p>{error}</p>
          </div>
        </div>
      )}

      {success && (
        <div className="rounded-lg border border-green-300 bg-green-50 px-4 py-3 text-sm text-green-700 flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <p className="font-semibold">{success}</p>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="card overflow-hidden">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-xs font-semibold uppercase tracking-wider text-text-secondary">{stat.label}</p>
                  <p className="mt-2 text-3xl font-bold text-text-primary">{stat.value}</p>
                </div>
                <div className={`bg-gradient-to-br ${stat.color} rounded-lg p-3`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 border-b border-border">
        {[
          { id: 'overview', label: 'Overview' },
          { id: 'labs', label: 'Labs Management' },
          { id: 'branches', label: 'Branches' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-3 font-medium transition-colors ${activeTab === tab.id
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-text-secondary hover:text-text-primary'
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Quick Stats */}
          <div className="xl:col-span-2 space-y-6">
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                Revenue Overview
              </h3>
              <div className="space-y-3">
                {dashboard && (
                  <>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-text-secondary">Monthly Revenue</span>
                      <span className="font-bold text-text-primary">$0</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-text-secondary">Pending Payments</span>
                      <span className="font-bold text-orange-600">${dashboard.suspendedLabs * 100}</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-text-primary mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button
                onClick={() => {
                  setShowLabForm(true);
                  setEditingLabId(null);
                  setLabForm(initialLabForm);
                }}
                className="w-full flex items-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add New Lab
              </button>
              <button className="w-full flex items-center gap-2 px-4 py-3 border border-border hover:bg-gray-50 text-text-primary rounded-lg font-medium transition-colors">
                <BarChart3 className="w-4 h-4" />
                View Analytics
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Labs Tab */}
      {activeTab === 'labs' && (
        <div className="space-y-6">
          {/* Add/Edit Lab Form */}
          {showLabForm && (
            <div className="card p-6 border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-white">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-text-primary">
                  {editingLabId ? 'Edit Laboratory' : 'Add New Laboratory'}
                </h2>
                <button
                  onClick={() => {
                    setShowLabForm(false);
                    setEditingLabId(null);
                    setLabForm(initialLabForm);
                  }}
                  className="text-text-secondary hover:text-text-primary"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleLabSubmit} className="space-y-6">
                {/* Lab Information */}
                <div>
                  <h3 className="text-sm font-semibold text-text-primary mb-4">Laboratory Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Lab Name *</label>
                      <input
                        className="input-field"
                        value={labForm.labName}
                        onChange={(e) => setLabForm((prev) => ({ ...prev, labName: e.target.value }))}
                        placeholder="e.g., City Medical Lab"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Lab Number *</label>
                      <input
                        className="input-field"
                        value={labForm.labNumber}
                        onChange={(e) => setLabForm((prev) => ({ ...prev, labNumber: e.target.value }))}
                        placeholder="e.g., LAB-001"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Subdomain</label>
                      <input
                        className="input-field"
                        value={labForm.subdomain}
                        onChange={(e) => setLabForm((prev) => ({ ...prev, subdomain: e.target.value }))}
                        placeholder="labname"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Custom Domain</label>
                      <input
                        className="input-field"
                        value={labForm.customDomain}
                        onChange={(e) => setLabForm((prev) => ({ ...prev, customDomain: e.target.value }))}
                        placeholder="lab.example.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Logo URL</label>
                      <input
                        className="input-field"
                        value={labForm.logoUrl}
                        onChange={(e) => setLabForm((prev) => ({ ...prev, logoUrl: e.target.value }))}
                        placeholder="https://..."
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Primary Color</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          className="input-field h-10 p-1"
                          value={labForm.primaryColor}
                          onChange={(e) => setLabForm((prev) => ({ ...prev, primaryColor: e.target.value }))}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Secondary Color</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          className="input-field h-10 p-1"
                          value={labForm.secondaryColor}
                          onChange={(e) => setLabForm((prev) => ({ ...prev, secondaryColor: e.target.value }))}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Subscription Plan *</label>
                      <select
                        className="input-field"
                        value={labForm.subscriptionPlan}
                        onChange={(e) => setLabForm((prev) => ({ ...prev, subscriptionPlan: e.target.value }))}
                      >
                        <option value="BASIC">BASIC - $99/mo</option>
                        <option value="STANDARD">STANDARD - $199/mo</option>
                        <option value="PRO">PRO - $399/mo</option>
                        <option value="ENTERPRISE">ENTERPRISE - Custom</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Subscription Expiry</label>
                      <input
                        type="date"
                        className="input-field"
                        value={labForm.subscriptionExpiry}
                        onChange={(e) => setLabForm((prev) => ({ ...prev, subscriptionExpiry: e.target.value }))}
                      />
                    </div>
                  </div>
                </div>

                {/* Payment & Status */}
                <div>
                  <h3 className="text-sm font-semibold text-text-primary mb-4">Payment & Status</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Payment Status *</label>
                      <select
                        className="input-field"
                        value={labForm.paymentStatus}
                        onChange={(e) => setLabForm((prev) => ({ ...prev, paymentStatus: e.target.value }))}
                      >
                        <option value="PENDING">PENDING</option>
                        <option value="PAID">PAID</option>
                        <option value="OVERDUE">OVERDUE</option>
                        <option value="SUSPENDED">SUSPENDED</option>
                      </select>
                    </div>
                    <div>
                      <label className="flex items-center gap-3 rounded-lg border border-border px-4 py-3 cursor-pointer hover:bg-gray-50">
                        <input
                          type="checkbox"
                          checked={labForm.active}
                          onChange={(e) => setLabForm((prev) => ({ ...prev, active: e.target.checked }))}
                          className="w-4 h-4"
                        />
                        <span className="text-sm font-medium text-text-primary">Lab is Active</span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Lab Owner Account */}
                <div className="bg-blue-50 rounded-lg border border-blue-200 p-4">
                  <h3 className="text-sm font-semibold text-blue-900 mb-4 flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Lab Owner Account (Login Credentials)
                  </h3>
                  <p className="text-xs text-blue-700 mb-4">These credentials will be used for the first login to the lab admin portal. Owner can change password later.</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Owner Name *</label>
                      <input
                        className="input-field"
                        value={labForm.adminName}
                        onChange={(e) => setLabForm((prev) => ({ ...prev, adminName: e.target.value }))}
                        placeholder="John Doe"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Owner Email (Login) *</label>
                      <input
                        type="email"
                        className="input-field"
                        value={labForm.adminEmail}
                        onChange={(e) => setLabForm((prev) => ({ ...prev, adminEmail: e.target.value }))}
                        placeholder="owner@yourlab.com"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Password *</label>
                      <input
                        type="password"
                        className="input-field"
                        value={labForm.adminPassword}
                        onChange={(e) => setLabForm((prev) => ({ ...prev, adminPassword: e.target.value }))}
                        placeholder="Strong password"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Phone Number</label>
                      <input
                        className="input-field"
                        value={labForm.adminPhone}
                        onChange={(e) => setLabForm((prev) => ({ ...prev, adminPhone: e.target.value }))}
                        placeholder="+1234567890"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={savingLab}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg font-medium transition-colors"
                  >
                    {savingLab ? <InlineLoader /> : 'Save Laboratory'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowLabForm(false);
                      setEditingLabId(null);
                      setLabForm(initialLabForm);
                    }}
                    className="px-6 py-3 border border-border hover:bg-gray-50 text-text-primary rounded-lg font-medium transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Search and Add Button */}
          {!showLabForm && (
            <div className="flex gap-4 items-center">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-secondary" />
                <input
                  type="text"
                  placeholder="Search labs by name or lab number..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input-field pl-10 w-full"
                />
              </div>
              <button
                onClick={() => {
                  setShowLabForm(true);
                  setEditingLabId(null);
                  setLabForm(initialLabForm);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Lab
              </button>
            </div>
          )}

          {/* Labs Table */}
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-gray-50">
                    <th className="px-6 py-4 text-left font-semibold text-text-primary">Lab Name</th>
                    <th className="px-6 py-4 text-left font-semibold text-text-primary">Lab Number</th>
                    <th className="px-6 py-4 text-left font-semibold text-text-primary">Plan</th>
                    <th className="px-6 py-4 text-left font-semibold text-text-primary">Payment</th>
                    <th className="px-6 py-4 text-left font-semibold text-text-primary">Expiry</th>
                    <th className="px-6 py-4 text-left font-semibold text-text-primary">Status</th>
                    <th className="px-6 py-4 text-left font-semibold text-text-primary">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLabs.map((lab) => (
                    <tr key={lab.id} className="border-b border-border/60 hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-text-primary">{lab.labName}</td>
                      <td className="px-6 py-4 text-text-secondary font-mono text-xs bg-gray-50 rounded">{lab.labNumber || '-'}</td>
                      <td className="px-6 py-4 text-text-secondary">
                        <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-medium">{lab.subscriptionPlan}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${lab.paymentStatus === 'PAID' ? 'bg-green-50 text-green-700' :
                            lab.paymentStatus === 'PENDING' ? 'bg-orange-50 text-orange-700' :
                              'bg-red-50 text-red-700'
                          }`}>
                          {lab.paymentStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-text-secondary text-xs">{lab.subscriptionExpiry || '-'}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${lab.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                          }`}>
                          {lab.active ? 'Active' : 'Suspended'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setLabForm(lab);
                              setEditingLabId(lab.id);
                              setShowLabForm(true);
                            }}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteLab(lab.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredLabs.length === 0 && (
                    <tr>
                      <td colSpan="7" className="px-6 py-12 text-center text-text-secondary">
                        <Building2 className="w-12 h-12 opacity-20 mx-auto mb-3" />
                        <p className="font-medium">No labs found</p>
                        {searchTerm && <p className="text-sm">Try adjusting your search criteria</p>}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Branches Tab */}
      {activeTab === 'branches' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Add Branch Form */}
            <div className="card p-6">
              <h2 className="text-lg font-semibold text-text-primary mb-4">Add New Branch</h2>
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
                  <input
                    className="input-field"
                    value={branchForm.branchName}
                    onChange={(e) => setBranchForm((prev) => ({ ...prev, branchName: e.target.value }))}
                    placeholder="Main Branch / Downtown"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Address</label>
                  <textarea
                    className="input-field"
                    rows={3}
                    value={branchForm.address}
                    onChange={(e) => setBranchForm((prev) => ({ ...prev, address: e.target.value }))}
                    placeholder="123 Medical Street, City"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Phone</label>
                  <input
                    className="input-field"
                    value={branchForm.phone}
                    onChange={(e) => setBranchForm((prev) => ({ ...prev, phone: e.target.value }))}
                    placeholder="+1234567890"
                  />
                </div>
                <label className="flex items-center gap-3 rounded-lg border border-border px-4 py-3 cursor-pointer hover:bg-gray-50">
                  <input
                    type="checkbox"
                    checked={branchForm.active}
                    onChange={(e) => setBranchForm((prev) => ({ ...prev, active: e.target.checked }))}
                  />
                  <span className="text-sm font-medium text-text-primary">Active Branch</span>
                </label>
                <button
                  type="submit"
                  disabled={savingBranch || labs.length === 0}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white rounded-lg font-medium transition-colors"
                >
                  {savingBranch ? <InlineLoader /> : 'Add Branch'}
                </button>
              </form>
            </div>

            {/* Branches List */}
            <div className="lg:col-span-2">
              <div className="card p-6">
                <h2 className="text-lg font-semibold text-text-primary mb-4">All Branches ({branches.length})</h2>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {branches.map((branch) => (
                    <div key={branch.id} className="border border-border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-semibold text-text-primary">{branch.branchName}</p>
                          <p className="text-sm text-text-secondary">{branch.labName}</p>
                          {branch.address && <p className="text-xs text-text-secondary mt-1">{branch.address}</p>}
                          {branch.phone && <p className="text-xs text-text-secondary">{branch.phone}</p>}
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${branch.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                          }`}>
                          {branch.active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                  ))}
                  {branches.length === 0 && (
                    <div className="text-center py-8 text-text-secondary">
                      <Network className="w-12 h-12 opacity-20 mx-auto mb-2" />
                      <p>No branches added yet</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
