import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, User, TestTube } from 'lucide-react';
import api from '../../api/axiosConfig';
import Loader from '../common/Loader';

export default function CreateReport() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [patients, setPatients] = useState([]);
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedTest, setSelectedTest] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [patientsRes, testsRes] = await Promise.all([
          api.get('/patients'),
          api.get('/tests')
        ]);
        setPatients(patientsRes.data || []);
        setTests(testsRes.data || []);
      } catch (error) {
        console.error('Error fetching data for report creation:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredPatients = patients.filter(p => 
    p.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.phone?.includes(searchTerm) || 
    p.patientId?.includes(searchTerm)
  );

  const handleCreateReport = async () => {
    try {
      const payload = {
        patientId: selectedPatient.id || selectedPatient.patientId,
        patientName: selectedPatient.name,
        testId: selectedTest.id,
        testName: selectedTest.name || selectedTest.testName,
        reportCode: `RPT-${Date.now().toString().slice(-6)}`
      };
      await api.post('/reports', payload);
      alert('Report created successfully!');
      navigate('/staff/reports');
    } catch (error) {
      console.error('Error creating report:', error);
      alert('Failed to create report.');
    }
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
          <h1 className="text-h1 font-bold text-text-primary">Create New Report</h1>
          <p className="text-text-secondary">Select patient and test to generate a new report</p>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="card p-6">
        <div className="flex items-center justify-center space-x-8">
          <div className={`flex items-center ${step >= 1 ? 'text-primary' : 'text-text-secondary'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-primary text-white' : 'bg-gray-200'
              }`}>
              1
            </div>
            <span className="ml-2 font-medium">Select Patient</span>
          </div>
          <div className={`w-16 h-1 ${step >= 2 ? 'bg-primary' : 'bg-gray-200'}`}></div>
          <div className={`flex items-center ${step >= 2 ? 'text-primary' : 'text-text-secondary'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-primary text-white' : 'bg-gray-200'
              }`}>
              2
            </div>
            <span className="ml-2 font-medium">Select Test</span>
          </div>
          <div className={`w-16 h-1 ${step >= 3 ? 'bg-primary' : 'bg-gray-200'}`}></div>
          <div className={`flex items-center ${step >= 3 ? 'text-primary' : 'text-text-secondary'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-primary text-white' : 'bg-gray-200'
              }`}>
              3
            </div>
            <span className="ml-2 font-medium">Confirm</span>
          </div>
        </div>
      </div>

      {/* Step 1: Select Patient */}
      {step === 1 && (
        <div className="card p-6">
          <h2 className="text-h3 font-semibold mb-4">Select Patient</h2>

          {/* Search */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-secondary" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name, phone, or patient ID..."
                className="input-field pl-10"
              />
            </div>
          </div>

          {/* Patient List */}
          {loading ? (
            <Loader message="Loading patients..." />
          ) : filteredPatients.length === 0 ? (
            <div className="mb-6 rounded-lg border border-dashed border-border p-6 text-center">
              <User className="w-8 h-8 text-text-secondary mx-auto mb-2" />
              <p className="text-text-primary font-medium">No patient data found</p>
            </div>
          ) : (
            <div className="mb-6 space-y-2 max-h-60 overflow-y-auto pr-2">
              {filteredPatients.map(p => (
                <div 
                  key={p.id} 
                  onClick={() => setSelectedPatient(p)}
                  className={`p-3 border rounded-lg cursor-pointer ${selectedPatient?.id === p.id ? 'border-primary bg-primary/5' : 'border-border hover:bg-gray-50'}`}
                >
                  <p className="font-medium">{p.name} <span className="text-sm text-text-secondary">({p.phone})</span></p>
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-end">
            <button
              onClick={() => setStep(2)}
              disabled={!selectedPatient}
              className="btn-primary disabled:opacity-50"
            >
              Next: Select Test
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Select Test */}
      {step === 2 && (
        <div className="card p-6">
          <h2 className="text-h3 font-semibold mb-4">Select Test</h2>

          {/* Test List */}
          {loading ? (
            <Loader message="Loading tests..." />
          ) : tests.length === 0 ? (
            <div className="mb-6 rounded-lg border border-dashed border-border p-6 text-center">
              <TestTube className="w-8 h-8 text-text-secondary mx-auto mb-2" />
              <p className="text-text-primary font-medium">No tests found</p>
            </div>
          ) : (
            <div className="mb-6 space-y-2 max-h-60 overflow-y-auto pr-2">
              {tests.map(t => (
                <div 
                  key={t.id} 
                  onClick={() => setSelectedTest(t)}
                  className={`p-3 border rounded-lg cursor-pointer ${selectedTest?.id === t.id ? 'border-primary bg-primary/5' : 'border-border hover:bg-gray-50'}`}
                >
                  <p className="font-medium">{t.name || t.testName}</p>
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-between">
            <button
              onClick={() => setStep(1)}
              className="px-6 py-3 border border-border rounded-lg hover:bg-gray-50"
            >
              Back
            </button>
            <button
              onClick={() => setStep(3)}
              disabled={!selectedTest}
              className="btn-primary disabled:opacity-50"
            >
              Next: Confirm
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Confirm */}
      {step === 3 && (
        <div className="card p-6">
          <h2 className="text-h3 font-semibold mb-4">Confirm Report Details</h2>

          <div className="space-y-6 mb-6">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-text-primary mb-2">Patient Information</h3>
              <p className="text-sm font-medium">{selectedPatient?.name}</p>
              <p className="text-sm text-text-secondary">Phone: {selectedPatient?.phone}</p>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-text-primary mb-2">Test Information</h3>
              <p className="text-sm font-medium">{selectedTest?.name || selectedTest?.testName}</p>
            </div>
          </div>

          <div className="flex justify-between">
            <button
              onClick={() => setStep(2)}
              className="px-6 py-3 border border-border rounded-lg hover:bg-gray-50"
            >
              Back
            </button>
            <button
              onClick={handleCreateReport}
              className="btn-primary"
            >
              Create Report
            </button>
          </div>
        </div>
      )}
    </div>
  );
}