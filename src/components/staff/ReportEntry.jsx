import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, CheckCircle, FlaskConical } from 'lucide-react';
import api from '../../api/axiosConfig';

export default function ReportEntry() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [results, setResults] = useState({});

  useEffect(() => {
    const fetchReport = async () => {
      try {
        // Fetch specific report using the general endpoint or specific logic if needed
        // Since we only have /reports to list all, we might need to filter or fetch directly if there's an endpoint
        // Wait, backend has GET /api/patient-reports/{reportCode} but that is for patients.
        // There is GET /api/reports which returns all. Let's fetch all and filter for now, or if there's a specific GET by ID.
        // Actually, backend has PUT /api/reports/{id}/results, but no GET /api/reports/{id}.
        // Let's get all reports and find the one matching ID.
        const response = await api.get('/reports');
        const found = response.data?.find(r => String(r.id) === String(id));
        setReport(found || { id, reportCode: `RPT-${id || '---'}` });
      } catch (err) {
        console.error('Error fetching report:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [id]);

  const handleSaveDraft = async () => {
    setSaving(true);
    try {
      await api.put(`/reports/${id}/results`, { results });
      alert('Results saved successfully!');
    } catch (err) {
      console.error('Save error', err);
      alert('Failed to save draft');
    } finally {
      setSaving(false);
    }
  };

  const handleMarkComplete = async () => {
    setSaving(true);
    try {
      // Typically verifications happen after saving results
      await api.put(`/reports/${id}/verify`, { comments: 'Verified' });
      navigate('/staff/reports');
    } catch (err) {
      console.error('Complete error', err);
      alert('Failed to complete report');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-text-secondary">Loading report...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center">
        <button
          onClick={() => navigate('/staff/reports')}
          className="mr-4 p-2 hover:bg-gray-100 rounded-lg"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-h1 font-bold text-text-primary">Report Entry</h1>
          <p className="text-text-secondary">Enter test values for {report?.reportCode}</p>
        </div>
      </div>

      <div className="card p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h3 className="font-medium text-text-secondary mb-1">Patient Name</h3>
            <p className="text-text-primary">{report?.patientName || 'No data found'}</p>
          </div>
          <div>
            <h3 className="font-medium text-text-secondary mb-1">Status</h3>
            <p className="text-text-primary">{report?.status || 'No data found'}</p>
          </div>
          <div>
            <h3 className="font-medium text-text-secondary mb-1">Report Code</h3>
            <p className="text-text-primary font-mono">{report?.reportCode || 'No data found'}</p>
          </div>
        </div>
      </div>

      {/* Parameter Entry */}
      <div className="card p-6">
        <h2 className="text-h3 font-semibold mb-6">Test Parameters</h2>

        <div className="rounded-lg border border-dashed border-border p-8 text-center">
          <FlaskConical className="w-10 h-10 text-text-secondary mx-auto mb-3" />
          <p className="text-text-primary font-medium">No parameters found for this test</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-between">
        <button
          onClick={() => navigate('/staff/reports')}
          className="px-6 py-3 border border-border rounded-lg hover:bg-gray-50"
        >
          Cancel
        </button>
        <div className="flex space-x-4">
          <button
            onClick={handleSaveDraft}
            disabled={saving}
            className="flex items-center px-6 py-3 border border-border rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            <Save className="w-5 h-5 mr-2" />
            {saving ? 'Saving...' : 'Save Results'}
          </button>
          <button
            onClick={handleMarkComplete}
            disabled={saving}
            className="btn-primary flex items-center disabled:opacity-50"
          >
            <CheckCircle className="w-5 h-5 mr-2" />
            {saving ? 'Processing...' : 'Verify & Complete'}
          </button>
        </div>
      </div>
    </div>
  );
}