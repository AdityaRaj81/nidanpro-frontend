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
import NidanProBrand from '../common/NidanProBrand';

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
    { path: '/staff/dashboard', icon: LayoutDashboard, label: 'Dashboard', badge: null }
  ];

  if (isAdmin || role === 'SAMPLE_COLLECTOR') {
    menuItems.push({ path: '/staff/patients', icon: Users, label: 'Patients', badge: null });
  }
  if (isAdmin || role === 'PATHOLOGIST') {
    menuItems.push({ path: '/staff/reports', icon: FileText, label: 'Reports', badge: null });
  }
  if (isAdmin || role === 'TECHNICIAN') {
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
      <div className="w-64 bg-gradient-to-b from-card to-blue-50 border-r border-gray-200 flex flex-col fixed left-0 top-0 bottom-0 shadow-lg">
        {/* Logo Section */}
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-primary to-blue-600 bg-opacity-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <img src="/logo_NidanPro.png" alt="NidanPro Logo" className="w-8 h-8 rounded-lg" />
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
        <div className="p-4 border-t border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white text-sm font-bold">{staffAuth?.name?.charAt(0)}</span>
              </div>
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
              <button className="p-2.5 text-text-secondary hover:text-primary hover:bg-blue-50 rounded-lg transition-all transform hover:scale-110">
                <Bell className="w-5 h-5" />
              </button>
              <div className="relative">
                <button
                  onClick={() => setProfileOpen((prev) => !prev)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-all"
                >
                  <div className="w-9 h-9 bg-gradient-to-br from-primary to-blue-600 rounded-full flex items-center justify-center shadow-md">
                    <span className="text-white text-sm font-bold">
                      {staffAuth?.name?.charAt(0)}
                    </span>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-text-secondary transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
                </button>
                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-xl p-2 z-50">
                    <div className="px-4 py-3 border-b border-gray-200 mb-2 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50">
                      <p className="font-semibold text-text-primary">{staffAuth?.name}</p>
                      <p className="text-xs text-text-secondary capitalize font-medium mt-1">{staffAuth?.role}</p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center px-4 py-2.5 text-sm rounded-lg text-red-600 hover:bg-red-50 font-medium transition-all"
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
        <main className="flex-1 p-6 overflow-auto bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
}