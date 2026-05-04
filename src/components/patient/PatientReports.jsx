import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, FileText, Download, Eye, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axiosConfig';
import Loader from '../common/Loader';

export default function PatientReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { patientAuth } = useAuth();
  const patient = location.state?.patient || patientAuth?.selectedPatient || patientAuth?.patients?.[0];

  useEffect(() => {
    if (!patient) {
      navigate('/patients');
      return;
    }

    const fetchReports = async () => {
      try {
        const response = await api.get(`/patient-reports?patientId=${patient.id}`);
        setReports(response.data || []);
      } catch (err) {
        console.error('Error fetching patient reports:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, [patient, navigate]);

  const handleViewReport = (report) => {
    if (report.status === 'VERIFIED' || report.status === 'COMPLETED') {
      navigate(`/report/${report.reportCode}`);
    } else {
      alert('Report is still being processed');
    }
  };

  const handleDownloadReport = (report) => {
    if (report.status === 'VERIFIED' || report.status === 'COMPLETED') {
      alert(`Downloading ${report.testName || 'report'}...`);
    } else {
      alert('Report is not ready for download');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Loader message="Loading reports..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border px-4 py-4">
        <div className="flex items-center">
          <button
            onClick={() => navigate(patientAuth?.patients?.length > 1 ? '/patients' : '/patient-access')}
            className="mr-3 p-2 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-h2 font-semibold">Patient Profile</h1>
            <p className="text-text-secondary text-sm">{patient?.name}</p>
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="max-w-2xl mx-auto space-y-4">
          <div className="card p-5">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-primary-50 rounded-full flex items-center justify-center mr-3">
                <User className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="text-h3 font-semibold text-text-primary">{patient?.name}</h2>
                <p className="text-text-secondary text-sm">Patient ID: {patient?.id || patient?.patientId}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-lg border border-border p-3">
                <p className="text-text-secondary">Age</p>
                <p className="font-medium text-text-primary">{patient?.age || '--'} years</p>
              </div>
              <div className="rounded-lg border border-border p-3">
                <p className="text-text-secondary">Gender</p>
                <p className="font-medium text-text-primary">{patient?.gender || '--'}</p>
              </div>
            </div>
          </div>

          <div className="card p-5">
            <div className="flex items-center mb-4">
              <FileText className="w-5 h-5 text-primary mr-2" />
              <h3 className="text-h3 font-semibold">Reports</h3>
            </div>

            {reports.length === 0 ? (
              <div className="rounded-lg border border-dashed border-border p-5 text-center">
                <p className="text-text-primary font-medium">No data found</p>
              </div>
            ) : (
              <div className="space-y-3">
                {reports.map((report) => (
                  <div key={report.id} className="rounded-lg border border-border p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-text-primary">{report.testName || report.reportCode}</p>
                        <p className="text-sm text-text-secondary mt-1">{report.createdAt ? new Date(report.createdAt).toLocaleDateString() : 'N/A'}</p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${report.status === 'VERIFIED' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {report.status}
                      </span>
                    </div>
                    <div className="mt-3 flex gap-2">
                      <button onClick={() => handleViewReport(report)} className="btn-primary px-4 py-2 text-sm inline-flex items-center">
                        <Eye className="w-4 h-4 mr-2" />
                        View
                      </button>
                      <button onClick={() => handleDownloadReport(report)} className="btn-secondary px-4 py-2 text-sm inline-flex items-center">
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}