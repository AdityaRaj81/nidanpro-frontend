import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, CheckCircle, FlaskConical } from 'lucide-react';

export default function ReportEntry() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [report] = useState({ id, reportCode: `RPT-${id || '---'}` });
  const [saving, setSaving] = useState(false);

  const handleSaveDraft = async () => {
    setSaving(true);
    // Simulate API call
    setTimeout(() => {
      setSaving(false);
      alert('Draft saved successfully!');
    }, 1000);
  };

  const handleMarkComplete = async () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      navigate('/staff/reports');
    }, 1000);
  };

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
            <h3 className="font-medium text-text-secondary mb-1">Patient</h3>
            <p className="text-text-primary">Waiting for backend data</p>
            <p className="text-text-secondary text-sm">ID: --</p>
          </div>
          <div>
            <h3 className="font-medium text-text-secondary mb-1">Test</h3>
            <p className="text-text-primary">Waiting for backend data</p>
            <p className="text-text-secondary text-sm">Code: --</p>
          </div>
          <div>
            <h3 className="font-medium text-text-secondary mb-1">Report Code</h3>
            <p className="text-text-primary font-mono">{report?.reportCode}</p>
          </div>
        </div>
      </div>

      {/* Parameter Entry */}
      <div className="card p-6">
        <h2 className="text-h3 font-semibold mb-6">Test Parameters</h2>

        <div className="rounded-lg border border-dashed border-border p-8 text-center">
          <FlaskConical className="w-10 h-10 text-text-secondary mx-auto mb-3" />
          <p className="text-text-primary font-medium">No parameters loaded</p>
          <p className="text-sm text-text-secondary mt-1">
            Parameter name, ranges, and entry inputs will be rendered from backend test definition.
          </p>
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
            {saving ? 'Saving...' : 'Save Draft'}
          </button>
          <button
            onClick={handleMarkComplete}
            disabled={saving}
            className="btn-primary flex items-center disabled:opacity-50"
          >
            <CheckCircle className="w-5 h-5 mr-2" />
            {saving ? 'Processing...' : 'Mark Complete'}
          </button>
        </div>
      </div>
    </div>
  );
}