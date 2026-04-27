import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, XCircle, MessageSquare } from 'lucide-react';

export default function Verification() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [report] = useState({ reportCode: `RPT-${id || '---'}` });
  const [remarks, setRemarks] = useState('');
  const [processing, setProcessing] = useState(false);

  const handleApprove = async () => {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      navigate('/staff/reports');
    }, 1000);
  };

  const handleReject = async () => {
    if (!remarks.trim()) {
      alert('Please provide remarks for rejection');
      return;
    }

    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
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
          <h1 className="text-h1 font-bold text-text-primary">Report Verification</h1>
          <p className="text-text-secondary">Review and verify report {report?.reportCode}</p>
        </div>
      </div>

      {/* Report Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Patient Info */}
        <div className="card p-6">
          <h3 className="text-h3 font-semibold mb-4">Patient Information</h3>
          <div className="space-y-3 text-sm">
            <div>
              <span className="text-text-secondary">Name:</span>
              <p className="font-medium">From backend</p>
            </div>
            <div>
              <span className="text-text-secondary">Patient ID:</span>
              <p className="font-medium">--</p>
            </div>
            <div>
              <span className="text-text-secondary">Age:</span>
              <p className="font-medium">-- years</p>
            </div>
            <div>
              <span className="text-text-secondary">Gender:</span>
              <p className="font-medium">--</p>
            </div>
          </div>
        </div>

        {/* Test Info */}
        <div className="card p-6">
          <h3 className="text-h3 font-semibold mb-4">Test Information</h3>
          <div className="space-y-3 text-sm">
            <div>
              <span className="text-text-secondary">Test Name:</span>
              <p className="font-medium">From backend</p>
            </div>
            <div>
              <span className="text-text-secondary">Test Code:</span>
              <p className="font-medium">--</p>
            </div>
            <div>
              <span className="text-text-secondary">Report Code:</span>
              <p className="font-medium font-mono">{report?.reportCode}</p>
            </div>
            <div>
              <span className="text-text-secondary">Test Date:</span>
              <p className="font-medium">--</p>
            </div>
          </div>
        </div>

        {/* Entry Info */}
        <div className="card p-6">
          <h3 className="text-h3 font-semibold mb-4">Entry Information</h3>
          <div className="space-y-3 text-sm">
            <div>
              <span className="text-text-secondary">Technician:</span>
              <p className="font-medium">From backend</p>
            </div>
            <div>
              <span className="text-text-secondary">Entry Date:</span>
              <p className="font-medium">--</p>
            </div>
            <div>
              <span className="text-text-secondary">Status:</span>
              <p className="font-medium text-yellow-600">Pending Verification</p>
            </div>
          </div>
        </div>
      </div>

      {/* Test Results */}
      <div className="card p-6">
        <h3 className="text-h3 font-semibold mb-4">Test Results</h3>
        <div className="rounded-lg border border-dashed border-border p-6 text-center">
          <p className="text-text-primary font-medium">No result rows loaded</p>
          <p className="text-sm text-text-secondary mt-1">
            Parameter values and validation markers will be populated from backend report payload.
          </p>
        </div>
      </div>

      {/* Remarks */}
      <div className="card p-6">
        <div className="flex items-center mb-4">
          <MessageSquare className="w-5 h-5 text-primary mr-2" />
          <h3 className="text-h3 font-semibold">Remarks (Optional)</h3>
        </div>
        <textarea
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
          placeholder="Add any remarks or observations..."
          className="input-field"
          rows={4}
        />
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
            onClick={handleReject}
            disabled={processing}
            className="flex items-center px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
          >
            <XCircle className="w-5 h-5 mr-2" />
            {processing ? 'Processing...' : 'Reject'}
          </button>
          <button
            onClick={handleApprove}
            disabled={processing}
            className="btn-secondary flex items-center disabled:opacity-50"
          >
            <CheckCircle className="w-5 h-5 mr-2" />
            {processing ? 'Processing...' : 'Approve & Verify'}
          </button>
        </div>
      </div>
    </div>
  );
}