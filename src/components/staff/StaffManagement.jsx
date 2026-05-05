import { useState, useEffect } from 'react';
import { Plus, User, Loader as LoaderIcon } from 'lucide-react';
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
  const { staffAuth } = useAuth();

  const roles = [
    { value: 'admin', label: 'Admin', description: 'Full system access' },
    { value: 'pathologist', label: 'Pathologist', description: 'Report verification' },
    { value: 'technician', label: 'Technician', description: 'Data entry' },
    { value: 'sample_collector', label: 'Sample Collector', description: 'Patient registration' }
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

    if (!newStaff.name || !newStaff.role || !newStaff.password) {
      alert('Please fill in all required fields');
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
      alert('Staff member added successfully!');
      fetchStaff(); // Refresh the list
    } catch (error) {
      console.error('Error adding staff:', error);
      alert(error.response?.data?.message || 'Failed to add staff member');
    }
  };

  const isAdmin = staffAuth?.role?.toUpperCase() === 'ADMIN' || staffAuth?.role?.toUpperCase() === 'SUPER_ADMIN';
  if (!isAdmin) {
    return (
      <div className="card p-8 text-center">
        <h2 className="text-h2 font-semibold text-text-primary mb-2">Access Restricted</h2>
        <p className="text-text-secondary">Only admins can manage staff accounts and roles.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-h1 font-bold text-text-primary">Staff Management</h1>
          <p className="text-text-secondary">Manage staff members and their roles</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="btn-primary flex items-center"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Staff
        </button>
      </div>

      {/* Add Staff Form */}
      {showAddForm && (
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-h3 font-semibold">Add New Staff Member</h2>
            <button
              onClick={() => setShowAddForm(false)}
              className="text-text-secondary hover:text-text-primary"
            >
              ✕
            </button>
          </div>
          <form onSubmit={handleAddStaff} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Full Name *</label>
                <input
                  type="text"
                  value={newStaff.name}
                  onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email Address (Optional)</label>
                <input
                  type="email"
                  value={newStaff.email}
                  onChange={(e) => setNewStaff({ ...newStaff, email: e.target.value })}
                  className="input-field"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Phone Number</label>
                <input
                  type="tel"
                  value={newStaff.phone}
                  onChange={(e) => setNewStaff({ ...newStaff, phone: e.target.value })}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Role *</label>
                <select
                  value={newStaff.role}
                  onChange={(e) => setNewStaff({ ...newStaff, role: e.target.value })}
                  className="input-field"
                  required
                >
                  <option value="">Select Role</option>
                  {roles.map((role) => (
                    <option key={role.value} value={role.value}>
                      {role.label} - {role.description}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Password *</label>
              <input
                type="password"
                value={newStaff.password}
                onChange={(e) => setNewStaff({ ...newStaff, password: e.target.value })}
                className="input-field"
                required
              />
            </div>
            <div className="flex space-x-4">
              <button type="submit" className="btn-primary">
                Add Staff Member
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-6 py-3 border border-border rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Staff List */}
      <div className="card">
        <div className="p-6 border-b border-border">
          <h2 className="text-h3 font-semibold">All Staff Members ({staff.length})</h2>
        </div>
        
        {loading ? (
          <div className="p-8 text-center text-text-secondary">Loading staff members...</div>
        ) : staff.length === 0 ? (
          <div className="p-8 text-center">
            <User className="w-10 h-10 text-text-secondary mx-auto mb-3" />
            <p className="text-text-primary font-medium">No staff found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-slate-50 text-text-secondary text-sm">
                  <th className="p-4 font-medium">Emp ID</th>
                  <th className="p-4 font-medium">Name</th>
                  <th className="p-4 font-medium">Email</th>
                  <th className="p-4 font-medium">Role</th>
                  <th className="p-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {staff.map((member) => (
                  <tr key={member.id} className="border-b border-border hover:bg-slate-50 transition-colors">
                    <td className="p-4 font-bold text-primary">{member.employeeCode}</td>
                    <td className="p-4 font-medium text-text-primary">{member.name}</td>
                    <td className="p-4 text-text-secondary">{member.email || '-'}</td>
                    <td className="p-4 text-text-secondary capitalize">{member.role}</td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        member.active !== false ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {member.active !== false ? 'Active' : 'Inactive'}
                      </span>
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