import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, User, Calendar, FileText, CheckCircle } from 'lucide-react';

export default function ReportView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [report] = useState({ reportCode: id });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  const handleDownload = () => {
    alert('Downloading PDF report...');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-text-secondary">Loading report...</p>
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <FileText className="w-12 h-12 text-text-secondary mx-auto mb-4" />
          <h2 className="text-h2 font-semibold mb-2">Report Not Found</h2>
          <p className="text-text-secondary mb-4">The requested report could not be found.</p>
          <button
            onClick={() => navigate('/patient-access')}
            className="btn-primary"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={() => navigate(-1)}
              className="mr-3 p-2 hover:bg-gray-100 rounded-lg"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-h2 font-semibold">Lab Report</h1>
              <p className="text-text-secondary text-sm">Code: {report.reportCode}</p>
            </div>
          </div>
          <button
            onClick={handleDownload}
            className="btn-primary flex items-center"
          >
            <Download className="w-4 h-4 mr-2" />
            PDF
          </button>
        </div>
      </div>

      {/* Report Content */}
      <div className="p-4">
        <div className="max-w-2xl mx-auto space-y-6">

          {/* Lab Header */}
          <div className="card p-6 text-center">
            <h2 className="text-h1 font-bold text-primary mb-2">Lab Name from Backend</h2>
            <p className="text-text-secondary">Digitize. Optimize. Deliver.</p>
          </div>

          {/* Patient Details */}
          <div className="card p-6">
            <div className="flex items-center mb-4">
              <User className="w-5 h-5 text-primary mr-2" />
              <h3 className="text-h3 font-semibold">Patient Information</h3>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-text-secondary">Name:</span>
                <p className="font-medium">--</p>
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

          {/* Test Details */}
          <div className="card p-6">
            <div className="flex items-center mb-4">
              <Calendar className="w-5 h-5 text-primary mr-2" />
              <h3 className="text-h3 font-semibold">Test Information</h3>
            </div>
            <div className="grid grid-cols-1 gap-4 text-sm">
              <div>
                <span className="text-text-secondary">Test Name:</span>
                <p className="font-medium">From backend</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-text-secondary">Collection Date:</span>
                  <p className="font-medium">--</p>
                </div>
                <div>
                  <span className="text-text-secondary">Report Date:</span>
                  <p className="font-medium">--</p>
                </div>
              </div>
            </div>
          </div>

          {/* Test Results */}
          <div className="card p-6">
            <h3 className="text-h3 font-semibold mb-4">Test Results</h3>
            <div className="rounded-lg border border-dashed border-border p-6 text-center">
              <p className="text-text-primary font-medium">No parameter values loaded</p>
              <p className="text-sm text-text-secondary mt-1">
                Result rows and reference ranges will be filled from backend report payload.
              </p>
            </div>
          </div>

          {/* Verification */}
          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center mb-2">
                  <CheckCircle className="w-5 h-5 text-secondary mr-2" />
                  <span className="font-medium">Verified by: --</span>
                </div>
                <p className="text-text-secondary text-sm">
                  Verified on: --
                </p>
              </div>
            </div>
          </div>

          {/* Download Button */}
          <div className="text-center">
            <button
              onClick={handleDownload}
              className="btn-primary w-full max-w-sm"
            >
              <Download className="w-5 h-5 mr-2" />
              Download PDF Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}