import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function PatientSelection() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { patientAuth, setPatientAuth } = useAuth();

  useEffect(() => {
    if (!patientAuth?.verified) {
      navigate('/patient-access');
      return;
    }

    setPatients(patientAuth?.user?.patients || patientAuth?.patients || []);
    setLoading(false);
  }, [patientAuth, navigate]);

  const handlePatientSelect = (patient) => {
    setPatientAuth((prev) => ({ ...prev, selectedPatient: patient }));
    navigate('/patient/profile', { state: { patient } });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-text-secondary">Loading patients...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border px-4 py-4">
        <div className="flex items-center">
          <button
            onClick={() => navigate('/patient-access')}
            className="mr-3 p-2 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-h2 font-semibold">Select Patient</h1>
        </div>
      </div>

      {/* Patient List */}
      <div className="p-4">
        <div className="max-w-md mx-auto space-y-3">
          {patients.map((patient) => (
            <div
              key={patient.id}
              onClick={() => handlePatientSelect(patient)}
              className="card p-4 cursor-pointer hover:shadow-md transition-shadow"
            >
              <div className="flex items-center">
                <div className="w-12 h-12 bg-primary-50 rounded-full flex items-center justify-center mr-4">
                  <User className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-text-primary">{patient.name}</h3>
                  <div className="flex items-center text-text-secondary text-sm mt-1">
                    <span>{patient.age} years</span>
                    <span className="mx-2">•</span>
                    <span>{patient.gender}</span>
                    <span className="mx-2">•</span>
                    <span>ID: {patient.patientId}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}