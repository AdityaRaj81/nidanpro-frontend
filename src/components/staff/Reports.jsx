import { useState, useEffect } from 'react';
import { Search, Filter, Plus, FileText } from 'lucide-react';
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-h1 font-bold text-text-primary">Reports</h1>
          <p className="text-text-secondary">Manage lab reports and test results</p>
        </div>
        <Link to="/staff/reports/create" className="btn-primary flex items-center">
          <Plus className="w-5 h-5 mr-2" />
          Create Report
        </Link>
      </div>

      {/* Filters */}
      <div className="card p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-secondary" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by report code, patient name..."
                className="input-field pl-10"
              />
            </div>
          </div>
          <div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-secondary" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="input-field pl-10"
              >
                <option value="all">All Status</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="verified">Verified</option>
              </select>
            </div>
          </div>
          <div>
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="input-field"
            />
          </div>
        </div>
      </div>

      {/* Reports Table */}
      <div className="card">
        <div className="p-6 border-b border-border">
          <h2 className="text-h3 font-semibold">All Reports</h2>
        </div>
        
        {loading ? (
          <Loader message="Loading reports..." />
        ) : filteredReports.length === 0 ? (
          <div className="p-8 text-center">
            <FileText className="w-10 h-10 text-text-secondary mx-auto mb-3" />
            <p className="text-text-primary font-medium">No data found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="p-4 font-medium text-gray-600">Report Code</th>
                  <th className="p-4 font-medium text-gray-600">Patient</th>
                  <th className="p-4 font-medium text-gray-600">Status</th>
                  <th className="p-4 font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredReports.map((report) => (
                  <tr key={report.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="p-4 font-medium text-gray-900">{report.reportCode}</td>
                    <td className="p-4 text-gray-600">{report.patientName}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        report.status === 'VERIFIED' ? 'bg-green-100 text-green-700' : 
                        report.status === 'COMPLETED' ? 'bg-blue-100 text-blue-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {report.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <Link to={`/staff/reports/entry/${report.id}`} className="text-primary hover:underline text-sm font-medium">
                        View/Edit
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