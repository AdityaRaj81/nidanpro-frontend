import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, X, LogOut, BarChart3, Building2, Settings, Bell } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import NidanProBrand from '../common/NidanProBrand';

export default function SuperAdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { staffAuth, setStaffAuth } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    setStaffAuth(null);
    navigate('/');
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div
        className={`${sidebarOpen ? 'w-64' : 'w-20'
          } bg-gradient-to-b from-blue-900 to-blue-800 text-white transition-all duration-300 flex flex-col shadow-lg`}
      >
        {/* Logo */}
        <div className="p-4 border-b border-blue-700 flex items-center justify-between">
          {sidebarOpen && (
            <div>
              <NidanProBrand variant="text-only" className="text-white font-bold" />
              <p className="text-xs text-blue-200 mt-1">Platform Control</p>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1 hover:bg-blue-700 rounded-lg transition-colors"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          <NavItem
            icon={<BarChart3 className="w-5 h-5" />}
            label="Dashboard"
            href="/super-admin/dashboard"
            sidebarOpen={sidebarOpen}
          />
          <NavItem
            icon={<Building2 className="w-5 h-5" />}
            label="Labs Management"
            href="/super-admin/labs"
            sidebarOpen={sidebarOpen}
          />
          <NavItem
            icon={<Settings className="w-5 h-5" />}
            label="System Settings"
            href="/super-admin/settings"
            sidebarOpen={sidebarOpen}
          />
        </nav>

        {/* User Info & Logout */}
        <div className="p-4 border-t border-blue-700">
          <div className={`flex items-center ${sidebarOpen ? 'justify-between' : 'justify-center'} mb-4`}>
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center font-semibold">
              {staffAuth?.name?.charAt(0)?.toUpperCase() || 'S'}
            </div>
            {sidebarOpen && (
              <div className="flex-1 ml-3">
                <p className="text-sm font-semibold truncate">{staffAuth?.name}</p>
                <p className="text-xs text-blue-200">Super Admin</p>
              </div>
            )}
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            {sidebarOpen && 'Logout'}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="bg-white border-b border-border px-8 py-4 shadow-sm flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-text-primary">Super Admin Control</h1>
            <p className="text-sm text-text-secondary mt-1">Platform Administration Dashboard</p>
          </div>
          <button className="relative p-2 text-text-secondary hover:bg-gray-100 rounded-lg transition-colors">
            <Bell className="w-6 h-6" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-8">
          {children}
        </div>
      </div>
    </div>
  );
}

function NavItem({ icon, label, href, sidebarOpen }) {
  const navigate = useNavigate();
  const isActive = window.location.pathname === href;

  return (
    <button
      onClick={() => navigate(href)}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive
          ? 'bg-blue-700 text-white'
          : 'text-blue-100 hover:bg-blue-700/50'
        }`}
    >
      {icon}
      {sidebarOpen && label}
    </button>
  );
}
