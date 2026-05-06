import { useEffect, useState } from 'react';
import { Users, FileText, TestTube, Settings, Building2, TrendingUp } from 'lucide-react';
import api from '../../api/axiosConfig';
import Loader from '../common/Loader';
import { useAuth } from '../../context/AuthContext';

export default function LabAdminDashboard() {
  const { staffAuth } = useAuth();
  const [reports, setReports] = useState([]);
  const [patients, setPatients] = useState([]);
  const [staff, setStaff] = useState([]);
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [reportsRes, patientsRes, staffRes, testsRes] = await Promise.all([
          api.get('/reports'),
          api.get('/patients'),
          api.get('/staff'),
          api.get('/tests/active')
        ]);
        setReports(reportsRes.data || []);
        setPatients(patientsRes.data || []);
        setStaff(staffRes.data || []);
        setTests(testsRes.data || []);
      } catch (error) {
        console.error('Error fetching lab admin dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <Loader message="Loading lab admin dashboard..." />;
  }

  const statCards = [
    { title: 'Patients', value: patients.length, icon: Users },
    { title: 'Reports', value: reports.length, icon: FileText },
    { title: 'Staff', value: staff.length, icon: Building2 },
    { title: 'Tests', value: tests.length, icon: TestTube },
  ];

  const completionRate = reports.length > 0
    ? Math.round((reports.filter(r => r.status === 'VERIFIED').length / reports.length) * 100)
    : 0;

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-text-secondary">Lab Admin Portal</p>
        <h1 className="text-h1 font-bold text-text-primary">Welcome {staffAuth?.name || 'Lab Owner'}</h1>
        <p className="text-text-secondary">Tenant-scoped overview for your lab. Medical data is limited to this lab only.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.title} className="card p-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-text-secondary">{stat.title}</p>
                  <p className="mt-2 text-3xl font-bold text-text-primary">{stat.value}</p>
                </div>
                <div className="rounded-xl border border-border bg-white p-3 text-primary">
                  <Icon className="w-6 h-6" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card p-6 lg:col-span-1">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-h3 font-semibold text-text-primary">Completion Rate</h2>
            <TrendingUp className="w-5 h-5 text-primary" />
          </div>
          <p className="text-4xl font-bold text-primary">{completionRate}%</p>
          <p className="mt-2 text-sm text-text-secondary">Verified reports out of total reports.</p>
        </div>

        <div className="card p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-h3 font-semibold text-text-primary">Quick Actions</h2>
            <Settings className="w-5 h-5 text-primary" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <a href="/lab-admin/patients" className="rounded-lg border border-border bg-white px-4 py-3 text-center font-medium text-text-primary hover:border-primary transition-colors">Add Patient</a>
            <a href="/lab-admin/reports" className="rounded-lg border border-border bg-white px-4 py-3 text-center font-medium text-text-primary hover:border-primary transition-colors">Reports</a>
            <a href="/lab-admin/tests" className="rounded-lg border border-border bg-white px-4 py-3 text-center font-medium text-text-primary hover:border-primary transition-colors">Manage Tests</a>
            <a href="/lab-admin/staff-management" className="rounded-lg border border-border bg-white px-4 py-3 text-center font-medium text-text-primary hover:border-primary transition-colors">Team</a>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-h3 font-semibold text-text-primary">Recent Reports</h2>
            <span className="text-xs text-text-secondary">Latest 5</span>
          </div>
          {reports.length === 0 ? (
            <p className="text-text-secondary">No reports yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-text-secondary">
                    <th className="py-2 pr-4 font-medium">Code</th>
                    <th className="py-2 pr-4 font-medium">Patient</th>
                    <th className="py-2 pr-4 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.slice(0, 5).map((report) => (
                    <tr key={report.id} className="border-b border-border/60">
                      <td className="py-2 pr-4 font-medium text-text-primary">{report.reportCode}</td>
                      <td className="py-2 pr-4 text-text-secondary">{report.patientName}</td>
                      <td className="py-2 pr-4 text-text-secondary">{report.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-h3 font-semibold text-text-primary">Lab Summary</h2>
            <Building2 className="w-5 h-5 text-primary" />
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between border-b border-border pb-2"><span className="text-text-secondary">Lab Name</span><span className="font-medium text-text-primary">{staffAuth?.labName || '-'}</span></div>
            <div className="flex justify-between border-b border-border pb-2"><span className="text-text-secondary">Owner</span><span className="font-medium text-text-primary">{staffAuth?.name || '-'}</span></div>
            <div className="flex justify-between border-b border-border pb-2"><span className="text-text-secondary">Total Patients</span><span className="font-medium text-text-primary">{patients.length}</span></div>
            <div className="flex justify-between border-b border-border pb-2"><span className="text-text-secondary">Active Tests</span><span className="font-medium text-text-primary">{tests.length}</span></div>
            <div className="flex justify-between"><span className="text-text-secondary">Staff Members</span><span className="font-medium text-text-primary">{staff.length}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
