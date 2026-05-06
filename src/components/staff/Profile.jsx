import { User, BadgeCheck, Mail, Phone, Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

function formatRole(role) {
  if (!role) return 'N/A';
  return role
    .toLowerCase()
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

export default function Profile() {
  const { staffAuth } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-h1 font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">Profile</h1>
        <p className="text-text-secondary">View your account details.</p>
      </div>

      <div className="card p-6 border-l-4 border-primary">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full border border-gray-200 bg-white flex items-center justify-center text-2xl">
            👤
          </div>
          <div>
            <p className="text-2xl font-bold text-text-primary">{staffAuth?.name || 'N/A'}</p>
            <p className="text-sm text-text-secondary">Staff profile</p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-lg border border-gray-200 p-4 bg-gray-50">
            <p className="text-xs text-text-secondary uppercase font-semibold">Name</p>
            <p className="mt-2 text-text-primary font-medium flex items-center gap-2">
              <User className="w-4 h-4 text-primary" />
              {staffAuth?.name || 'N/A'}
            </p>
          </div>

          <div className="rounded-lg border border-gray-200 p-4 bg-gray-50">
            <p className="text-xs text-text-secondary uppercase font-semibold">Role</p>
            <p className="mt-2 text-text-primary font-medium flex items-center gap-2">
              <Shield className="w-4 h-4 text-primary" />
              {formatRole(staffAuth?.role)}
            </p>
          </div>

          <div className="rounded-lg border border-gray-200 p-4 bg-gray-50">
            <p className="text-xs text-text-secondary uppercase font-semibold">Email</p>
            <p className="mt-2 text-text-primary font-medium flex items-center gap-2">
              <Mail className="w-4 h-4 text-primary" />
              {staffAuth?.email || 'Not available'}
            </p>
          </div>

          <div className="rounded-lg border border-gray-200 p-4 bg-gray-50">
            <p className="text-xs text-text-secondary uppercase font-semibold">Employee Code</p>
            <p className="mt-2 text-text-primary font-medium flex items-center gap-2">
              <BadgeCheck className="w-4 h-4 text-primary" />
              {staffAuth?.employeeCode || 'Not available'}
            </p>
          </div>

          <div className="rounded-lg border border-gray-200 p-4 bg-gray-50 md:col-span-2">
            <p className="text-xs text-text-secondary uppercase font-semibold">Phone</p>
            <p className="mt-2 text-text-primary font-medium flex items-center gap-2">
              <Phone className="w-4 h-4 text-primary" />
              {staffAuth?.phone || 'Not available'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}