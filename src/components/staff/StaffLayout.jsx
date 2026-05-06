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
  User
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import DesktopOnlyNotice from './DesktopOnlyNotice';
import NidanProBrand from '../common/NidanProBrand';

export default function StaffLayout() {
  const { staffAuth, setStaffAuth, isStaffAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);
  const [notificationOpen, setNotificationOpen] = useState(false);

  const notifications = [];

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
    const firstConfirm = window.confirm('Are you sure you want to logout?');
    if (!firstConfirm) {
      return;
    }

    const secondStep = window.prompt('Type LOGOUT to confirm logout.');
    if (secondStep !== 'LOGOUT') {
      window.alert('Logout cancelled.');
      return;
    }

    setStaffAuth(null);
    navigate('/staff/login');
  };

  const role = staffAuth?.role?.toUpperCase();
  const isAdmin = role === 'ADMIN' || role === 'SUPER_ADMIN';

  const menuItems = [
    { path: '/staff/dashboard', icon: LayoutDashboard, label: 'Dashboard', badge: null }
  ];

  if (isAdmin || role === 'SAMPLE_COLLECTOR') {
    menuItems.push({ path: '/staff/patients', icon: Users, label: 'Patients', badge: null });
  }
  if (isAdmin || role === 'PATHOLOGIST') {
    menuItems.push({ path: '/staff/reports', icon: FileText, label: 'Reports', badge: null });
  }
  if (role === 'SUPER_ADMIN') {
    menuItems.push({ path: '/staff/tests', icon: TestTube, label: 'Tests', badge: null });
  }
  if (isAdmin) {
    menuItems.push({ path: '/staff/staff-management', icon: UserCog, label: 'Staff', badge: null });
  }

  menuItems.push({ path: '/staff/settings', icon: Settings, label: 'Settings', badge: null });

  if (!isStaffAuthenticated) {
    return null;
  }

  if (!isDesktop) {
    return <DesktopOnlyNotice />;
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <div className="w-64 bg-card border-r border-gray-200 flex flex-col fixed left-0 top-0 bottom-0 shadow-lg">
        {/* Logo Section */}
        <div className="p-6 border-b border-gray-200 bg-card">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center border border-gray-200 bg-white shadow-sm">
              <img src="/logo_NidanPro.png" alt="NidanPro Logo" className="w-9 h-9 rounded-lg" />
            </div>
            <div className="flex-1">
              <h2 className="font-bold text-text-primary"><NidanProBrand className="text-sm" variant="text-only" /></h2>
              <p className="text-xs text-text-secondary font-medium">Staff Portal</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          <p className="px-4 py-2 text-xs font-bold text-text-secondary uppercase tracking-wider mb-3">Menu</p>
          <ul className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200 group ${isActive
                      ? 'bg-gradient-to-r from-primary to-blue-600 text-white shadow-lg'
                      : 'text-text-secondary hover:bg-gray-100 hover:text-text-primary'
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">{item.badge}</span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User Info Section */}
        <div className="p-4 border-t border-gray-200 bg-card">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <button
                onClick={() => navigate('/staff/profile')}
                className="w-10 h-10 rounded-full border border-gray-200 bg-white flex items-center justify-center flex-shrink-0 text-lg hover:bg-gray-50 transition-colors"
                title="Open profile"
              >
                👤
              </button>
              <div className="min-w-0">
                <p className="font-semibold text-text-primary text-sm truncate">{staffAuth?.name}</p>
                <p className="text-xs text-text-secondary capitalize font-medium">{staffAuth?.role}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 text-text-secondary hover:text-red-600 hover:bg-red-50 rounded-lg transition-all transform hover:scale-110"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col ml-64">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-20 shadow-sm">
          <div className="flex items-center justify-between">
            {/* Search */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-secondary pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search patients, reports..."
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-gray-50 hover:bg-white"
                />
              </div>
            </div>

            {/* Right side */}
            <div className="flex items-center space-x-4 ml-4">
              <div className="relative">
                <button
                  onClick={() => setNotificationOpen((prev) => !prev)}
                  className="p-2.5 text-text-secondary hover:text-primary hover:bg-blue-50 rounded-lg transition-all transform hover:scale-110"
                  title="Notifications"
                >
                  <Bell className="w-5 h-5" />
                </button>
                {notificationOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-xl shadow-xl p-3 z-50">
                    <p className="text-sm font-semibold text-text-primary border-b border-gray-100 pb-2">Notifications</p>
                    {notifications.length === 0 ? (
                      <p className="text-sm text-text-secondary py-4">No new notifications right now.</p>
                    ) : (
                      <div className="space-y-2 py-2">
                        {notifications.map((item) => (
                          <div key={item.id} className="text-sm text-text-primary bg-gray-50 rounded-lg p-2">
                            {item.message}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              <button
                onClick={() => navigate('/staff/profile')}
                className="w-10 h-10 rounded-full border border-gray-200 bg-white hover:bg-gray-50 transition-colors text-lg flex items-center justify-center"
                title="Go to profile"
              >
                😊
              </button>

              <button
                onClick={handleLogout}
                className="p-2.5 text-text-secondary hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-auto bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
}