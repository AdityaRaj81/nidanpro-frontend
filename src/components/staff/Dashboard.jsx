import { FileText, Clock, CheckCircle, Users, TrendingUp, Activity } from 'lucide-react';
import { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';
import Loader from '../common/Loader';
import { useAuth } from '../../context/AuthContext';

export default function Dashboard() {
  const { staffAuth } = useAuth();
  const [reports, setReports] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [reportsRes, patientsRes] = await Promise.all([
          api.get('/reports'),
          api.get('/patients')
        ]);
        setReports(reportsRes.data || []);
        setPatients(patientsRes.data || []);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const statCards = [
    {
      title: 'Total Reports',
      value: reports.length,
      icon: FileText,
      gradient: 'from-blue-500 to-blue-600',
      bgGradient: 'from-blue-50 to-blue-100'
    },
    {
      title: 'Pending Reports',
      value: reports.filter(r => r.status === 'PENDING').length,
      icon: Clock,
      gradient: 'from-yellow-500 to-yellow-600',
      bgGradient: 'from-yellow-50 to-yellow-100'
    },
    {
      title: 'Verified Reports',
      value: reports.filter(r => r.status === 'VERIFIED').length,
      icon: CheckCircle,
      gradient: 'from-green-500 to-green-600',
      bgGradient: 'from-green-50 to-green-100'
    },
    {
      title: 'Total Patients',
      value: patients.length,
      icon: Users,
      gradient: 'from-purple-500 to-purple-600',
      bgGradient: 'from-purple-50 to-purple-100'
    }
  ];

  if (loading) {
    return <Loader message="Loading dashboard..." />;
  }

  const completionRate = reports.length > 0
    ? Math.round((reports.filter(r => r.status === 'VERIFIED').length / reports.length) * 100)
    : 0;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <p className="text-lg font-semibold text-text-primary">Welcome {staffAuth?.name || 'Staff'}!</p>
        <h1 className="text-h1 font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">Dashboard</h1>
        <p className="text-text-secondary">Overview of lab reports and patients.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="card p-6 border-l-4 border-transparent hover:shadow-lg transition-all duration-200 group" style={{ borderLeftColor: `hsl(${index * 90}, 100%, 50%)` }}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-text-secondary text-sm font-medium uppercase tracking-wide">{stat.title}</p>
                  <p className={`mt-3 text-4xl font-bold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}>
                    {stat.value}
                  </p>
                </div>
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${stat.bgGradient} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <Icon className="w-7 h-7 text-primary" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Completion Rate & Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Completion Rate Card */}
        <div className="card p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-text-primary">Completion Rate</h3>
            <TrendingUp className="w-6 h-6 text-primary" />
          </div>
          <div className="space-y-4">
            <div className="flex items-end gap-4">
              <div className="flex-1">
                <p className="text-4xl font-bold text-primary">{completionRate}%</p>
                <p className="text-sm text-text-secondary mt-2">of reports verified</p>
              </div>
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center">
                <span className="text-xl font-bold text-white">{completionRate}%</span>
              </div>
            </div>
            <div className="bg-white rounded-lg p-3 text-sm">
              <p className="text-text-secondary">{reports.filter(r => r.status === 'VERIFIED').length} out of {reports.length} reports completed</p>
            </div>
          </div>
        </div>

        {/* Activity Summary */}
        <div className="lg:col-span-2 card p-6 bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200">
          <div className="flex items-center gap-3 mb-6">
            <Activity className="w-6 h-6 text-primary" />
            <h3 className="text-lg font-bold text-text-primary">Activity Summary</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <p className="text-sm text-text-secondary font-medium">Pending Review</p>
              <p className="text-3xl font-bold text-yellow-600 mt-2">{reports.filter(r => r.status === 'PENDING').length}</p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <p className="text-sm text-text-secondary font-medium">Recent Patients</p>
              <p className="text-3xl font-bold text-green-600 mt-2">{Math.min(patients.length, 99)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Reports */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
            <h2 className="text-lg font-bold text-text-primary">📋 Recent Reports</h2>
            <span className="text-xs font-semibold bg-blue-100 text-blue-700 px-3 py-1 rounded-full">Latest 5</span>
          </div>
          {reports.length === 0 ? (
            <div className="rounded-lg border-2 border-dashed border-gray-300 p-8 text-center">
              <FileText className="w-8 h-8 text-text-secondary mx-auto mb-2" />
              <p className="text-text-primary font-medium">No reports yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {reports.slice(0, 5).map((report) => (
                <div key={report.id} className="p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg border border-gray-200 hover:border-primary hover:shadow-md transition-all group cursor-pointer">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-text-primary group-hover:text-primary transition-colors">{report.reportCode}</p>
                      <p className="text-sm text-text-secondary">{report.patientName}</p>
                    </div>
                    <span className={`text-xs font-bold px-3 py-1.5 rounded-full whitespace-nowrap ${report.status === 'VERIFIED'
                      ? 'bg-green-100 text-green-700'
                      : report.status === 'COMPLETED'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-yellow-100 text-yellow-700'
                      }`}>
                      {report.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="card p-6">
          <h2 className="text-lg font-bold text-text-primary mb-6">⚡ Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            <a href="/staff/patients" className="p-4 bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg font-medium text-center transition-all hover:shadow-lg transform hover:scale-105">
              👥 Add Patient
            </a>
            <a href="/staff/tests" className="p-4 bg-gradient-to-br from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-lg font-medium text-center transition-all hover:shadow-lg transform hover:scale-105">
              🧪 Manage Tests
            </a>
            <a href="/staff/reports/create" className="p-4 bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-lg font-medium text-center transition-all hover:shadow-lg transform hover:scale-105">
              📝 Create Report
            </a>
            <a href="/staff/staff-management" className="p-4 bg-gradient-to-br from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-lg font-medium text-center transition-all hover:shadow-lg transform hover:scale-105">
              👔 Staff Mgmt
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}