import { FileText, Clock, CheckCircle, Users } from 'lucide-react';
import { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';

export default function Dashboard() {
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
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      title: 'Pending Reports',
      value: reports.filter(r => r.status === 'PENDING').length,
      icon: Clock,
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-600'
    },
    {
      title: 'Verified Reports',
      value: reports.filter(r => r.status === 'VERIFIED').length,
      icon: CheckCircle,
      bgColor: 'bg-green-50',
      textColor: 'text-green-600'
    },
    {
      title: 'Total Patients',
      value: patients.length,
      icon: Users,
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600'
    }
  ];

  if (loading) {
    return <div className="p-8 text-center text-text-secondary">Loading dashboard...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-h1 font-bold text-text-primary">Dashboard</h1>
        <p className="text-text-secondary">Overview of lab reports and patients.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-text-secondary text-sm font-medium">{stat.title}</p>
                  <p className="mt-2 text-2xl font-bold text-text-primary">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 ${stat.textColor}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Reports */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-h3 font-semibold">Recent Reports Feed</h2>
          </div>
          {reports.length === 0 ? (
            <div className="rounded-lg border border-dashed border-border p-6 text-center">
              <p className="text-text-primary font-medium">No data found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {reports.slice(0, 5).map((report) => (
                <div key={report.id} className="p-3 border rounded-lg border-border">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{report.reportCode}</p>
                      <p className="text-sm text-text-secondary">{report.patientName}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${report.status === 'VERIFIED' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
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
          <h2 className="text-h3 font-semibold mb-4">Quick Actions</h2>
          <div className="rounded-lg border border-dashed border-border p-6 text-center">
            <p className="text-text-primary font-medium">No actions available</p>
          </div>
        </div>
      </div>
    </div>
  );
}