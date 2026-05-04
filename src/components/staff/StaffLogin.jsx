import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Shield, Mail, Lock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import DesktopOnlyNotice from './DesktopOnlyNotice';
import api from '../../api/axiosConfig';

export default function StaffLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);

    try {
      const response = await api.post('/auth/login', { email, password });
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
            <div className={`w-16 h-16 ${isAdminLogin ? 'bg-secondary' : 'bg-primary'} rounded-lg flex items-center justify-center`}>
              <Shield className="w-8 h-8 text-white" />
            </div>
          </div>
          <Link to="/" className="inline-block text-h1 font-bold text-text-primary mb-2 hover:text-primary transition-colors">
            NidanPro
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
              <label className="block text-sm font-medium mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-secondary" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="input-field pl-10"
                  required
                />
              </div>
            </div>

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
              className="btn-primary w-full"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-text-secondary text-sm">
            © 2024 NidanPro. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}