import { useState, useEffect } from 'react';
import { Plus, User, Loader as LoaderIcon, Mail, Phone, Badge, CheckCircle2, AlertCircle, X, Save } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axiosConfig';

export default function StaffManagement() {
  const [staff, setStaff] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newStaff, setNewStaff] = useState({
    name: '',
    email: '',
    phone: '',
    role: '',
    password: ''
  });
  const [error, setError] = useState('');
  const { staffAuth } = useAuth();

  const roles = [
    { value: 'admin', label: 'Admin', description: 'Full system access', color: 'from-purple-500 to-purple-600' },
    { value: 'pathologist', label: 'Pathologist', description: 'Report verification', color: 'from-blue-500 to-blue-600' },
    { value: 'technician', label: 'Technician', description: 'Data entry', color: 'from-green-500 to-green-600' },
    { value: 'sample_collector', label: 'Sample Collector', description: 'Patient registration', color: 'from-orange-500 to-orange-600' }
  ];

  const [loading, setLoading] = useState(true);

  const fetchStaff = async () => {
    try {
      setLoading(true);
      const response = await api.get('/staff');
      setStaff(response.data || []);
    } catch (error) {
      console.error('Error fetching staff:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const handleAddStaff = async (e) => {
    e.preventDefault();
    setError('');

    if (!newStaff.name || !newStaff.role || !newStaff.password) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      await api.post('/staff', {
        fullName: newStaff.name,
        email: newStaff.email.trim() || null,
        password: newStaff.password,
        role: newStaff.role.toUpperCase(),
        phone: newStaff.phone || null,
        signatureUrl: null,
        active: true
      });
      setNewStaff({ name: '', email: '', phone: '', role: '', password: '' });
      setShowAddForm(false);
      setError('');
      fetchStaff(); // Refresh the list
    } catch (error) {
      console.error('Error adding staff:', error);
      setError(error.response?.data?.message || 'Failed to add staff member');
    }
  };

  const getRoleConfig = (role) => {
    const config = roles.find(r => r.value === role.toLowerCase());
    return config || { label: role, description: '', color: 'from-gray-500 to-gray-600' };
  };

  const isAdmin = staffAuth?.role?.toUpperCase() === 'ADMIN' || staffAuth?.role?.toUpperCase() === 'SUPER_ADMIN';
  if (!isAdmin) {
    return (
      <div className="card p-12 text-center space-y-4">
        <div className="flex justify-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
            <AlertCircle className="w-10 h-10 text-red-600" />
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-text-primary">Access Restricted</h2>
          <p className="text-text-secondary mt-2">Only admins can manage staff accounts and roles.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-h1 font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">Staff Management</h1>
          <p className="text-text-secondary">Manage staff members and their roles</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-gradient-to-r from-primary to-blue-600 hover:from-blue-600 hover:to-primary text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 shadow-lg hover:shadow-xl transition-all transform hover:scale-105 w-fit"
        >
          <Plus className="w-5 h-5" />
          Add Staff Member
        </button>
      </div>

      {/* Add Staff Form */}
      {showAddForm && (
        <div className="card p-6 border-l-4 border-primary shadow-lg">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-blue-600 rounded-lg flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-h3 font-semibold">Add New Staff Member</h2>
            </div>
            <button
              onClick={() => {
                setShowAddForm(false);
                setError('');
              }}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-text-secondary" />
            </button>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-300 text-red-700 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleAddStaff} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2 text-text-primary">Full Name *</label>
                <input
                  type="text"
                  value={newStaff.name}
                  onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  placeholder="Enter staff member's full name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2 text-text-primary">Email Address</label>
                <input
                  type="email"
                  value={newStaff.email}
                  onChange={(e) => setNewStaff({ ...newStaff, email: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  placeholder="staff@example.com"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2 text-text-primary">Phone Number</label>
                <input
                  type="tel"
                  value={newStaff.phone}
                  onChange={(e) => setNewStaff({ ...newStaff, phone: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  placeholder="+91 98765 43210"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2 text-text-primary">Role *</label>
                <select
                  value={newStaff.role}
                  onChange={(e) => setNewStaff({ ...newStaff, role: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  required
                >
                  <option value="">Select a role</option>
                  {roles.map((role) => (
                    <option key={role.value} value={role.value}>
                      {role.label} - {role.description}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-text-primary">Password *</label>
              <input
                type="password"
                value={newStaff.password}
                onChange={(e) => setNewStaff({ ...newStaff, password: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                placeholder="Enter secure password"
                required
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button type="submit" className="flex-1 bg-gradient-to-r from-primary to-blue-600 hover:from-blue-600 hover:to-primary text-white py-2.5 rounded-lg font-medium flex items-center justify-center gap-2 transition-all hover:shadow-lg">
                <Save className="w-4 h-4" />
                Add Staff Member
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAddForm(false);
                  setError('');
                }}
                className="flex-1 px-6 py-2.5 border-2 border-gray-300 text-text-primary font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Stats */}
      {!loading && staff.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { label: 'Total Staff', value: staff.length, color: 'blue' },
            { label: 'Active Members', value: staff.filter(s => s.active !== false).length, color: 'green' },
            { label: 'Different Roles', value: new Set(staff.map(s => s.role)).size, color: 'purple' }
          ].map((stat, idx) => (
            <div key={idx} className={`card p-4 bg-${stat.color}-50 border-l-4 border-${stat.color}-500`}>
              <p className="text-xs text-text-secondary font-medium uppercase">{stat.label}</p>
              <p className={`text-3xl font-bold mt-2 bg-gradient-to-r from-${stat.color}-500 to-${stat.color}-600 bg-clip-text text-transparent`}>{stat.value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Staff Cards Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-text-primary">👥 All Staff Members ({staff.length})</h2>
        </div>
        
        {loading ? (
          <div className="card p-12 text-center space-y-4">
            <div className="flex justify-center">
              <LoaderIcon className="w-8 h-8 animate-spin text-primary" />
            </div>
            <p className="text-text-secondary">Loading staff members...</p>
          </div>
        ) : staff.length === 0 ? (
          <div className="card p-12 text-center space-y-4">
            <div className="flex justify-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
                <User className="w-10 h-10 text-text-secondary" />
              </div>
            </div>
            <div>
              <p className="text-lg font-semibold text-text-primary">No staff members found</p>
              <p className="text-text-secondary mt-2">Add your first staff member to get started</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {staff.map((member) => {
              const roleConfig = getRoleConfig(member.role);
              return (
                <div key={member.id} className="card p-5 hover:shadow-lg transition-all duration-200 border-l-4 border-primary group">
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs font-bold text-white bg-primary px-2.5 py-1 rounded-full">
                            {member.employeeCode}
                          </span>
                          {member.active !== false && (
                            <span className="text-xs font-medium text-green-700 bg-green-100 px-2.5 py-1 rounded-full flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" />
                              Active
                            </span>
                          )}
                        </div>
                        <h3 className="text-base font-bold text-text-primary group-hover:text-primary transition-colors">{member.name}</h3>
                      </div>
                    </div>

                    {/* Role Badge */}
                    <div className={`bg-gradient-to-r ${roleConfig.color} bg-opacity-10 p-3 rounded-lg border border-opacity-20`} style={{borderColor: `var(--color-${roleConfig.color.split('-')[1]})`}}>
                      <p className="text-xs text-text-secondary font-medium uppercase">Role</p>
                      <p className="text-sm font-bold text-text-primary mt-1 capitalize">{roleConfig.label}</p>
                      <p className="text-xs text-text-secondary mt-1">{roleConfig.description}</p>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-2">
                      {member.email && (
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="w-4 h-4 text-primary flex-shrink-0" />
                          <span className="text-text-secondary truncate">{member.email}</span>
                        </div>
                      )}
                      {member.phone && (
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="w-4 h-4 text-primary flex-shrink-0" />
                          <span className="text-text-secondary">{member.phone}</span>
                        </div>
                      )}
                    </div>

                    {/* Status */}
                    <div className="pt-2 border-t border-gray-200">
                      <p className="text-xs text-text-secondary font-medium">Status</p>
                      <p className="text-sm font-semibold text-green-700 mt-1">{member.active !== false ? '✓ Active' : '✗ Inactive'}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}