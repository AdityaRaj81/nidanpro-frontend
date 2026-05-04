import { useEffect, useState } from 'react';
import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  FileText,
  TestTube,
  UserCog,
  Settings,
  Search,
  Bell,
  LogOut,
  Shield,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import DesktopOnlyNotice from './DesktopOnlyNotice';

export default function StaffLayout() {
  const { staffAuth, setStaffAuth, isStaffAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    if (!isStaffAuthenticated) {
      navigate('/staff/login');
    }
  }, [isStaffAuthenticated, navigate]);

  useEffect(() => {
    const onResize = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const handleLogout = () => {
    setStaffAuth(null);
    navigate('/staff/login');
  };

  const role = staffAuth?.role?.toUpperCase();
  const isAdmin = role === 'ADMIN' || role === 'SUPER_ADMIN';

  const menuItems = [
    { path: '/staff/dashboard', icon: LayoutDashboard, label: 'Dashboard' }
  ];

  if (isAdmin || role === 'SAMPLE_COLLECTOR') {
    menuItems.push({ path: '/staff/patients', icon: Users, label: 'Patients' });
  }
  if (isAdmin || role === 'PATHOLOGIST') {
    menuItems.push({ path: '/staff/reports', icon: FileText, label: 'Reports' });
  }
  if (isAdmin || role === 'TECHNICIAN') {
    menuItems.push({ path: '/staff/tests', icon: TestTube, label: 'Tests' });
  }
  if (isAdmin) {
    menuItems.push({ path: '/staff/staff-management', icon: UserCog, label: 'Staff' });
  }

  menuItems.push({ path: '/staff/settings', icon: Settings, label: 'Settings' });

  if (!isStaffAuthenticated) {
    return null;
  }

  if (!isDesktop) {
    return <DesktopOnlyNotice />;
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <div className="w-64 bg-card border-r border-border flex flex-col fixed left-0 top-0 bottom-0">
        {/* Logo */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center mr-3">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-text-primary">NidanPro</h2>
              <p className="text-xs text-text-secondary">Staff Dashboard</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center px-4 py-3 rounded-lg transition-colors ${isActive
                      ? 'bg-primary text-white'
                      : 'text-text-secondary hover:bg-gray-50 hover:text-text-primary'
                      }`}
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User Info */}
        <div className="p-4 border-t border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-text-primary">{staffAuth?.name}</p>
              <p className="text-xs text-text-secondary capitalize">{staffAuth?.role}</p>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 text-text-secondary hover:text-error hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col ml-64">
        {/* Header */}
        <header className="bg-card border-b border-border px-6 py-4 sticky top-0 z-20">
          <div className="flex items-center justify-between">
            {/* Search */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-secondary" />
                <input
                  type="text"
                  placeholder="Search patients, reports..."
                  className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>

            {/* Right side */}
            <div className="flex items-center space-x-4">
              <button className="p-2 text-text-secondary hover:text-text-primary hover:bg-gray-50 rounded-lg transition-colors">
                <Bell className="w-5 h-5" />
              </button>
              <div className="relative">
                <button
                  onClick={() => setProfileOpen((prev) => !prev)}
                  className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-gray-50"
                >
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {staffAuth?.name?.charAt(0)}
                    </span>
                  </div>
                  <ChevronDown className="w-4 h-4 text-text-secondary" />
                </button>
                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-card border border-border rounded-lg shadow-lg p-2">
                    <div className="px-3 py-2 border-b border-border mb-2">
                      <p className="font-medium text-text-primary">{staffAuth?.name}</p>
                      <p className="text-xs text-text-secondary capitalize">{staffAuth?.role}</p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center px-3 py-2 text-sm rounded-lg text-error hover:bg-red-50"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}