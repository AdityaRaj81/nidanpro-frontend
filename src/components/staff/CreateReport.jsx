import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, User, TestTube } from 'lucide-react';

export default function CreateReport() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

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
          <div className="mb-6 rounded-lg border border-dashed border-border p-6 text-center">
            <User className="w-8 h-8 text-text-secondary mx-auto mb-2" />
            <p className="text-text-primary font-medium">Patient list not loaded</p>
            <p className="text-sm text-text-secondary mt-1">
              Matching patients from backend search will appear here.
            </p>
          </div>

          <div className="flex justify-end">
            <button
              onClick={() => setStep(2)}
              className="btn-primary"
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
          <div className="mb-6 rounded-lg border border-dashed border-border p-6 text-center">
            <TestTube className="w-8 h-8 text-text-secondary mx-auto mb-2" />
            <p className="text-text-primary font-medium">Test catalog not loaded</p>
            <p className="text-sm text-text-secondary mt-1">
              Available tests from backend will be selectable here.
            </p>
          </div>

          <div className="flex justify-between">
            <button
              onClick={() => setStep(1)}
              className="px-6 py-3 border border-border rounded-lg hover:bg-gray-50"
            >
              Back
            </button>
            <button
              onClick={() => setStep(3)}
              className="btn-primary"
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
              <p className="text-sm text-text-secondary">Selected patient data from backend will be displayed here.</p>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-text-primary mb-2">Test Information</h3>
              <p className="text-sm text-text-secondary">Selected test metadata from backend will be displayed here.</p>
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
              onClick={() => navigate('/staff/reports')}
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