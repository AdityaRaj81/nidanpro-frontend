import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Shield, Mail, Lock } from 'lucide-react';
import InlineLoader from '../common/InlineLoader';
import { useAuth } from '../../context/AuthContext';
import DesktopOnlyNotice from './DesktopOnlyNotice';
import api from '../../api/axiosConfig';
import NidanProBrand from '../common/NidanProBrand';

export default function StaffLogin() {
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isAdminLogin = searchParams.get('type') === 'admin';
  const { setStaffAuth } = useAuth();

  useEffect(() => {
    const onResize = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!loginId || !password || (!isAdminLogin && !role)) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);

    try {
      const payload = { loginId, password };
      if (!isAdminLogin) {
        payload.role = role;
      }
      const response = await api.post('/auth/login', payload);
      const data = response.data;

      setStaffAuth({
        id: data.id,
        email: data.email,
        name: data.name,
        role: data.role,
        token: data.token
      });
      navigate('/staff/dashboard');
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
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <img src="/logo_NidanPro.png" alt="NidanPro Logo" className="w-16 h-16" />
          </div>
          <Link to="/" className="inline-block text-h1 font-bold text-text-primary mb-2 hover:text-opacity-80 transition-colors">
            <NidanProBrand className="text-h1" variant="text-only" />
          </Link>
          <p className="text-text-secondary">{isAdminLogin ? 'Super Admin Secure Login' : 'Staff Dashboard Login'}</p>
        </div>

        {/* Login Form */}
        <div className="card p-8">
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm text-center">
              {error}
            </div>
          )}
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                {isAdminLogin ? 'Admin Email / Code' : 'Employee ID'}
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-secondary" />
                <input
                  type={isAdminLogin ? "text" : "text"}
                  value={loginId}
                  onChange={(e) => setLoginId(e.target.value)}
                  placeholder={isAdminLogin ? "Enter your admin email or code" : "Enter your employee ID (e.g. EMP2026...)"}
                  className="input-field pl-10"
                  required
                />
              </div>
            </div>

            {!isAdminLogin && (
              <div>
                <label className="block text-sm font-medium mb-2">Select Your Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="input-field"
                  required
                >
                  <option value="">-- Choose Role --</option>
                  <option value="technician">Technician</option>
                  <option value="pathologist">Pathologist</option>
                  <option value="sample_collector">Sample Collector</option>
                </select>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-secondary" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="input-field pl-10"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              {loading ? <InlineLoader size={20} /> : 'Sign In'}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-text-secondary text-sm">
            © 2024 <NidanProBrand variant="text-only" />. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}