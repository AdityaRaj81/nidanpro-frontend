import { useState } from 'react';
import { Search, Filter, Plus, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Reports() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('');

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
                placeholder="Search by report code, patient name, or test..."
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
                <option value="in_progress">In Progress</option>
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
        <div className="p-8 text-center">
          <FileText className="w-10 h-10 text-text-secondary mx-auto mb-3" />
          <p className="text-text-primary font-medium">No reports loaded</p>
          <p className="text-sm text-text-secondary mt-1">
            Filter values are ready. Report rows and actions will appear after backend response.
          </p>
        </div>
      </div>
    </div>
  );
}