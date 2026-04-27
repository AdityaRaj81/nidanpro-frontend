import { useState } from 'react';
import { Plus, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

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

  const handleAddStaff = (e) => {
    e.preventDefault();

    if (!newStaff.name || !newStaff.email || !newStaff.role || !newStaff.password) {
      alert('Please fill in all required fields');
      return;
    }

    const staffMember = {
      id: staff.length + 1,
      ...newStaff,
      isActive: true,
      lastLogin: null
    };

    setStaff([...staff, staffMember]);
    setNewStaff({ name: '', email: '', phone: '', role: '', password: '' });
    setShowAddForm(false);
    alert('Staff member added successfully!');
  };

  if (staffAuth?.role !== 'admin') {
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
                <label className="block text-sm font-medium mb-2">Email Address *</label>
                <input
                  type="email"
                  value={newStaff.email}
                  onChange={(e) => setNewStaff({ ...newStaff, email: e.target.value })}
                  className="input-field"
                  required
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
        <div className="p-8 text-center">
          <User className="w-10 h-10 text-text-secondary mx-auto mb-3" />
          <p className="text-text-primary font-medium">No staff list loaded</p>
          <p className="text-sm text-text-secondary mt-1">
            Staff accounts, role tags, and status actions will appear after backend fetch.
          </p>
        </div>
      </div>
    </div>
  );
}