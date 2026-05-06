import { useState, useEffect } from 'react';
import { Search, Filter, Plus, FileText, Calendar, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../api/axiosConfig';
import Loader from '../common/Loader';

export default function Reports() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('');
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await api.get('/reports');
        setReports(response.data || []);
      } catch (error) {
        console.error('Error fetching reports:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.reportCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.patientName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || report.status?.toLowerCase() === statusFilter.toLowerCase();
    const matchesDate = !dateFilter || report.createdAt?.startsWith(dateFilter);
    return matchesSearch && matchesStatus && matchesDate;
  });

  const stats = {
    total: reports.length,
    pending: reports.filter(r => r.status === 'PENDING').length,
    completed: reports.filter(r => r.status === 'COMPLETED').length,
    verified: reports.filter(r => r.status === 'VERIFIED').length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-h1 font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">Reports</h1>
          <p className="text-text-secondary">Manage lab reports and test results</p>
        </div>
        <Link to="/staff/reports/create" className="bg-gradient-to-r from-primary to-blue-600 hover:from-blue-600 hover:to-primary text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 shadow-lg hover:shadow-xl transition-all transform hover:scale-105 w-fit">
          <Plus className="w-5 h-5" />
          Create Report
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Reports', value: stats.total, icon: FileText, color: 'blue' },
          { label: 'Pending', value: stats.pending, icon: TrendingUp, color: 'yellow' },
          { label: 'Completed', value: stats.completed, icon: FileText, color: 'purple' },
          { label: 'Verified', value: stats.verified, icon: FileText, color: 'green' }
        ].map((stat, idx) => {
          const Icon = stat.icon;
          const colorMap = {
            blue: 'from-blue-500 to-blue-600',
            yellow: 'from-yellow-500 to-yellow-600',
            purple: 'from-purple-500 to-purple-600',
            green: 'from-green-500 to-green-600'
          };
          return (
            <div key={idx} className={`card p-4 bg-gradient-to-br ${colorMap[stat.color]} bg-opacity-10 border-l-4`} style={{ borderLeftColor: `hsl(${['blue', 'yellow', 'purple', 'green'].indexOf(stat.color) * 90}, 100%, 50%)` }}>
              <p className="text-xs text-text-secondary font-medium uppercase">{stat.label}</p>
              <p className="text-2xl font-bold text-text-primary mt-2">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="card p-6 bg-gradient-to-br from-gray-50 to-blue-50 border border-gray-200">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-text-primary">Filters</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-secondary pointer-events-none" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by report code or patient name..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              />
            </div>
          </div>
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="verified">Verified</option>
            </select>
          </div>
          <div>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-secondary pointer-events-none" />
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Reports Display */}
      <div className="card">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-bold text-text-primary">📋 All Reports ({filteredReports.length})</h2>
        </div>

        {loading ? (
          <Loader message="Loading reports..." />
        ) : filteredReports.length === 0 ? (
          <div className="p-12 text-center space-y-4">
            <div className="flex justify-center">
              <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
                <FileText className="w-10 h-10 text-text-secondary" />
              </div>
            </div>
            <div>
              <p className="text-lg font-semibold text-text-primary">No reports found</p>
              <p className="text-text-secondary mt-1">Try adjusting your search or create a new report</p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b-2 border-gray-200">
                  <th className="p-4 text-left font-bold text-text-primary uppercase text-xs tracking-wide">Report Code</th>
                  <th className="p-4 text-left font-bold text-text-primary uppercase text-xs tracking-wide">Patient</th>
                  <th className="p-4 text-left font-bold text-text-primary uppercase text-xs tracking-wide">Date</th>
                  <th className="p-4 text-left font-bold text-text-primary uppercase text-xs tracking-wide">Status</th>
                  <th className="p-4 text-left font-bold text-text-primary uppercase text-xs tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredReports.map((report, idx) => (
                  <tr key={report.id} className={`border-b border-gray-100 hover:bg-blue-50 transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                    <td className="p-4">
                      <span className="font-bold text-text-primary bg-gradient-to-r from-primary to-blue-600 bg-clip-text">{report.reportCode}</span>
                    </td>
                    <td className="p-4">
                      <p className="font-medium text-text-primary">{report.patientName}</p>
                    </td>
                    <td className="p-4 text-sm text-text-secondary">
                      {new Date(report.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <span className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap inline-block ${report.status === 'VERIFIED'
                          ? 'bg-green-100 text-green-800 border border-green-300'
                          : report.status === 'COMPLETED'
                            ? 'bg-blue-100 text-blue-800 border border-blue-300'
                            : 'bg-yellow-100 text-yellow-800 border border-yellow-300'
                        }`}>
                        {report.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <Link to={`/staff/reports/entry/${report.id}`} className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg text-sm font-medium transition-all hover:shadow-lg">
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}