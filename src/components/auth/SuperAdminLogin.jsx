import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Mail, LogIn } from 'lucide-react';
import InlineLoader from '../common/InlineLoader';
import { useAuth } from '../../context/AuthContext';
import DesktopOnlyNotice from '../staff/DesktopOnlyNotice';
import api from '../../api/axiosConfig';
import NidanProBrand from '../common/NidanProBrand';

export default function SuperAdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);
  const navigate = useNavigate();
  const { setStaffAuth } = useAuth();

  useEffect(() => {
    const onResize = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);

    try {
      const response = await api.post('/auth/login', {
        loginId: email,
        password
      });
      const data = response.data;

      if (data.role?.toUpperCase() !== 'SUPER_ADMIN') {
        setError('Access denied. Super Admin credentials required.');
        setLoading(false);
        return;
      }

      setStaffAuth({
        id: data.id,
        email: data.email,
        name: data.name,
        role: data.role,
        token: data.token
      });
      navigate('/super-admin/dashboard');
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  if (!isDesktop) {
    return <DesktopOnlyNotice />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <img src="/logo_NidanPro.png" alt="NidanPro Logo" className="w-16 h-16 drop-shadow-lg" />
          </div>
          <Link to="/" className="inline-block text-h1 font-bold text-text-primary mb-2 hover:text-opacity-80 transition-colors">
            <NidanProBrand className="text-h1" variant="text-only" />
          </Link>
          <div className="flex items-center justify-center gap-2 mb-2">
            <Lock className="w-5 h-5 text-blue-600" />
            <p className="text-text-secondary font-semibold">Super Admin Portal</p>
          </div>
          <p className="text-sm text-text-secondary">Platform Administration & Control</p>
        </div>

        {/* Login Card */}
        <div className="card p-8 shadow-lg border-2 border-blue-100">
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
              <p className="font-semibold">Login Failed</p>
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold mb-2 text-text-primary">Super Admin Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@admin-email.com"
                  className="input-field pl-10 border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-text-primary">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input-field pl-10 border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
            >
              {loading ? (
                <>
                  <InlineLoader size={20} /> Signing in...
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" /> Sign In
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-border">
            <p className="text-xs text-center text-text-secondary">
              Are you a Lab Admin? <Link to="/auth/admin-login" className="text-blue-600 font-semibold hover:text-blue-700">Sign in here</Link>
            </p>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-xs text-text-secondary text-center">
            <span className="font-semibold text-blue-600">Super Admin</span> access provides platform-wide controls including lab management, subscriptions, and system monitoring.
          </p>
        </div>

        {/* Copyright */}
        <div className="text-center mt-8">
          <p className="text-text-secondary text-xs">
            © 2024 <NidanProBrand variant="text-only" />. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
