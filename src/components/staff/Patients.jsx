import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Loader from '../common/Loader';
import { CalendarDays, FileCheck2, Plus, Receipt, Search, UserRound } from 'lucide-react';
import api from '../../api/axiosConfig';

const initialPatientState = {
  fullName: '',
  phoneNumber: '',
  dateOfBirth: '',
  ageYears: '',
  ageMonths: '0',
  ageDays: '0',
  gender: '',
  address: '',
};

function calculateAgeBreakdown(dateOfBirth) {
  if (!dateOfBirth) {
    return { years: '', months: '', days: '' };
  }

  const today = new Date();
  const dob = new Date(dateOfBirth);
  if (Number.isNaN(dob.getTime()) || dob > today) {
    return { years: '', months: '', days: '' };
  }

  let years = today.getFullYear() - dob.getFullYear();
  let months = today.getMonth() - dob.getMonth();
  let days = today.getDate() - dob.getDate();

  if (days < 0) {
    const previousMonth = new Date(today.getFullYear(), today.getMonth(), 0);
    days += previousMonth.getDate();
    months -= 1;
  }

  if (months < 0) {
    months += 12;
    years -= 1;
  }

  if (years < 0) {
    return { years: '', months: '', days: '' };
  }

  return {
    years: String(years),
    months: String(months),
    days: String(days),
  };
}

function normalizeApiError(error) {
  return (
    error?.response?.data?.error ||
    error?.response?.data?.message ||
    error?.message ||
    'Something went wrong. Please try again.'
  );
}

export default function Patients() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [queryType, setQueryType] = useState('phone');
  const [queryValue, setQueryValue] = useState('');
  const [searchingPatient, setSearchingPatient] = useState(false);
  const [selectedExistingPatient, setSelectedExistingPatient] = useState(null);
  const [selectedExistingTests, setSelectedExistingTests] = useState([]);

  const [ageInputMode, setAgeInputMode] = useState('dob');
  const [newPatient, setNewPatient] = useState(initialPatientState);
  const [selectedNewTests, setSelectedNewTests] = useState([]);

  const [tests, setTests] = useState([]);
  const [loadingTests, setLoadingTests] = useState(true);
  const [searchParams] = useSearchParams();
  const showAllPatients = searchParams.get('all') === 'true';
  const [allPatients, setAllPatients] = useState([]);
  const [loadingAllPatients, setLoadingAllPatients] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [generatedReceipts, setGeneratedReceipts] = useState([]);

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const response = await api.get('/tests/active');
        const activeTests = (response.data || []).filter((test) => test.active !== false);
        setTests(activeTests);
      } catch (error) {
        setErrorMessage(normalizeApiError(error));
      } finally {
        setLoadingTests(false);
      }
    };

    fetchTests();
  }, []);

  useEffect(() => {
    if (!showAllPatients) return;
    const fetchAll = async () => {
      setLoadingAllPatients(true);
      try {
        const resp = await api.get('/patients');
        setAllPatients(resp.data || []);
      } catch (err) {
        setErrorMessage(normalizeApiError(err));
      } finally {
        setLoadingAllPatients(false);
      }
    };
    fetchAll();
  }, [showAllPatients]);

  const searchHint = useMemo(
    () => (queryType === 'phone' ? 'Enter patient phone number' : 'Enter patient ID like P0001'),
    [queryType]
  );

  const autoAge = useMemo(
    () => (ageInputMode === 'dob' ? calculateAgeBreakdown(newPatient.dateOfBirth) : { years: '', months: '', days: '' }),
    [ageInputMode, newPatient.dateOfBirth]
  );

  const toggleSelection = (id, list, setList) => {
    if (list.includes(id)) {
      setList(list.filter((item) => item !== id));
      return;
    }
    setList([...list, id]);
  };

  const createPerTestReceipts = async (patient, testIds) => {
    const requests = testIds.map((testId) =>
      api.post('/receipts/generate', {
        patientCode: patient.patientCode,
        patientPhone: patient.phoneNumber,
        patientName: patient.fullName,
        testIds: [testId],
      })
    );

    const responses = await Promise.all(requests);
    return responses.map((response) => response.data);
  };

  const handleFindPatient = async (event) => {
    event.preventDefault();
    setErrorMessage('');
    setSelectedExistingPatient(null);
    setGeneratedReceipts([]);

    if (!queryValue.trim()) {
      setErrorMessage(`Please enter patient ${queryType === 'phone' ? 'phone number' : 'ID'}.`);
      return;
    }

    setSearchingPatient(true);
    try {
      if (queryType === 'phone') {
        const response = await api.get('/patients/search', { params: { phone: queryValue.trim() } });
        const found = response.data?.[0];
        if (!found) {
          setErrorMessage('No patient found with this phone number.');
          return;
        }
        setSelectedExistingPatient(found);
      } else {
        const response = await api.get('/patients/by-code', { params: { code: queryValue.trim() } });
        setSelectedExistingPatient(response.data || null);
      }
    } catch (error) {
      if (error?.response?.status === 404) {
        setErrorMessage('No patient found with this ID.');
      } else {
        setErrorMessage(normalizeApiError(error));
      }
    } finally {
      setSearchingPatient(false);
    }
  };

  const handleGenerateExistingReceipts = async (event) => {
    event.preventDefault();
    setErrorMessage('');
    setGeneratedReceipts([]);

    if (!selectedExistingPatient) {
      setErrorMessage('Search and select a patient first.');
      return;
    }

    if (selectedExistingTests.length === 0) {
      setErrorMessage('Select at least one test to generate receipts.');
      return;
    }

    setSubmitting(true);
    try {
      const receipts = await createPerTestReceipts(selectedExistingPatient, selectedExistingTests);
      setGeneratedReceipts(receipts);
      setSelectedExistingTests([]);
    } catch (error) {
      setErrorMessage(normalizeApiError(error));
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreatePatientAndReceipts = async (event) => {
    event.preventDefault();
    setErrorMessage('');
    setGeneratedReceipts([]);

    if (!newPatient.fullName || !newPatient.phoneNumber || !newPatient.gender) {
      setErrorMessage('Name, phone, and gender are required.');
      return;
    }

    if (ageInputMode === 'dob' && !newPatient.dateOfBirth) {
      setErrorMessage('Please select date of birth.');
      return;
    }

    if (ageInputMode === 'manual' && (newPatient.ageYears === '' || Number(newPatient.ageYears) < 0)) {
      setErrorMessage('Please enter a valid age in years.');
      return;
    }

    if (selectedNewTests.length === 0) {
      setErrorMessage('Select at least one test.');
      return;
    }

    const payload = {
      fullName: newPatient.fullName.trim(),
      phoneNumber: newPatient.phoneNumber.trim(),
      dateOfBirth: ageInputMode === 'dob' ? newPatient.dateOfBirth : null,
      ageYears: ageInputMode === 'dob' ? null : Number(newPatient.ageYears),
      ageMonths: ageInputMode === 'dob' ? null : Number(newPatient.ageMonths || 0),
      ageDays: ageInputMode === 'dob' ? null : Number(newPatient.ageDays || 0),
      gender: newPatient.gender,
      address: newPatient.address?.trim() || null,
    };

    setSubmitting(true);
    try {
      const patientResponse = await api.post('/patients', payload);
      const createdPatient = patientResponse.data;
      const receipts = await createPerTestReceipts(createdPatient, selectedNewTests);

      setGeneratedReceipts(receipts);
      setSelectedNewTests([]);
      setNewPatient(initialPatientState);
      setAgeInputMode('dob');
      setShowAddForm(false);
      setSelectedExistingPatient(createdPatient);
      setQueryType('patientId');
      setQueryValue(createdPatient.patientCode || '');
    } catch (error) {
      setErrorMessage(normalizeApiError(error));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-h1 font-bold text-text-primary">Patients</h1>
          <p className="text-text-secondary">Create patient, assign tests, and generate one receipt per selected test.</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="btn-primary flex items-center"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Patient
        </button>
      </div>

      {showAllPatients && (
        <div className="card p-6">
          <h2 className="text-h3 font-semibold mb-4">All Patients</h2>
          {loadingAllPatients ? (
            <Loader message="Loading patients..." />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {allPatients.map((p) => (
                <div key={p.id} className="rounded-xl border border-border p-4">
                  <p className="font-semibold text-text-primary">{p.fullName}</p>
                  <p className="text-sm text-text-secondary">ID: {p.patientCode}</p>
                  <p className="text-sm text-text-secondary">Phone: {p.phoneNumber}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {errorMessage && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMessage}
        </div>
      )}

      <div className="card p-6 space-y-4">
        <div className="flex items-center mb-1">
          <Search className="w-5 h-5 text-primary mr-2" />
          <h2 className="text-h3 font-semibold">Existing Patient</h2>
        </div>

        <form onSubmit={handleFindPatient} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Search By</label>
            <select
              value={queryType}
              onChange={(event) => setQueryType(event.target.value)}
              className="input-field"
            >
              <option value="phone">Phone Number</option>
              <option value="patientId">Patient ID</option>
            </select>
          </div>
          <div className="md:col-span-2 flex gap-3">
            <input
              type="text"
              value={queryValue}
              onChange={(event) => setQueryValue(event.target.value)}
              placeholder={searchHint}
              className="input-field"
            />
            <button type="submit" className="btn-primary whitespace-nowrap" disabled={searchingPatient}>
              {searchingPatient ? 'Searching...' : 'Find'}
            </button>
          </div>
        </form>

        {selectedExistingPatient && (
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-semibold text-text-primary">{selectedExistingPatient.fullName}</p>
                <p className="text-sm text-text-secondary">ID: {selectedExistingPatient.patientCode}</p>
                <p className="text-sm text-text-secondary">Phone: {selectedExistingPatient.phoneNumber}</p>
              </div>
              <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-primary border border-primary/20">
                Existing Patient
              </span>
            </div>
          </div>
        )}

        <form onSubmit={handleGenerateExistingReceipts} className="space-y-4">
          <div>
            <p className="text-sm font-medium mb-3">Select Tests (Each test creates a separate receipt)</p>
            {loadingTests ? (
              <Loader message="Loading tests..." />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {tests.map((test) => (
                  <label key={test.id} className="flex items-center gap-2 rounded-lg border border-border p-3 cursor-pointer hover:bg-slate-50">
                    <input
                      type="checkbox"
                      checked={selectedExistingTests.includes(test.id)}
                      onChange={() => toggleSelection(test.id, selectedExistingTests, setSelectedExistingTests)}
                    />
                    <span className="text-sm text-text-primary">{test.testName}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          <button type="submit" className="btn-primary flex items-center" disabled={submitting || !selectedExistingPatient}>
            <Receipt className="w-5 h-5 mr-2" />
            {submitting ? 'Generating...' : 'Generate Receipts'}
          </button>
        </form>
      </div>

      {showAddForm && (
        <div className="card p-6 space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-h3 font-semibold">New Patient Intake</h2>
            <button
              onClick={() => setShowAddForm(false)}
              className="rounded-lg border border-border px-3 py-1 text-text-secondary hover:text-text-primary"
            >
              Close
            </button>
          </div>

          <form onSubmit={handleCreatePatientAndReceipts} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Full Name *</label>
                <input
                  type="text"
                  value={newPatient.fullName}
                  onChange={(event) => setNewPatient((prev) => ({ ...prev, fullName: event.target.value }))}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Phone Number *</label>
                <input
                  type="tel"
                  value={newPatient.phoneNumber}
                  onChange={(event) => setNewPatient((prev) => ({ ...prev, phoneNumber: event.target.value }))}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Gender *</label>
                <select
                  value={newPatient.gender}
                  onChange={(event) => setNewPatient((prev) => ({ ...prev, gender: event.target.value }))}
                  className="input-field"
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Address</label>
                <input
                  type="text"
                  value={newPatient.address}
                  onChange={(event) => setNewPatient((prev) => ({ ...prev, address: event.target.value }))}
                  className="input-field"
                />
              </div>
            </div>

            <div className="rounded-xl border border-border p-4 space-y-4 bg-slate-50/50">
              <p className="text-sm font-semibold text-text-primary">Age Input</p>
              <div className="flex flex-wrap gap-3">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    checked={ageInputMode === 'dob'}
                    onChange={() => setAgeInputMode('dob')}
                  />
                  Use Date of Birth
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    checked={ageInputMode === 'manual'}
                    onChange={() => setAgeInputMode('manual')}
                  />
                  Enter Age Manually
                </label>
              </div>

              {ageInputMode === 'dob' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Date of Birth *</label>
                    <div className="relative">
                      <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
                      <input
                        type="date"
                        value={newPatient.dateOfBirth}
                        max={new Date().toISOString().split('T')[0]}
                        onChange={(event) => setNewPatient((prev) => ({ ...prev, dateOfBirth: event.target.value }))}
                        className="input-field pl-10"
                        required={ageInputMode === 'dob'}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Calculated Age (Today)</label>
                    <div className="input-field bg-white flex items-center gap-2">
                      <UserRound className="w-4 h-4 text-text-secondary" />
                      <span>
                        {autoAge.years === '' ? 'Select DOB' : `${autoAge.years}y ${autoAge.months}m ${autoAge.days}d`}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Age (Years) *</label>
                    <input
                      type="number"
                      min="0"
                      value={newPatient.ageYears}
                      onChange={(event) => setNewPatient((prev) => ({ ...prev, ageYears: event.target.value }))}
                      className="input-field"
                      required={ageInputMode === 'manual'}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Months (Optional)</label>
                    <input
                      type="number"
                      min="0"
                      max="11"
                      value={newPatient.ageMonths}
                      onChange={(event) => setNewPatient((prev) => ({ ...prev, ageMonths: event.target.value }))}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Days (Optional)</label>
                    <input
                      type="number"
                      min="0"
                      max="31"
                      value={newPatient.ageDays}
                      onChange={(event) => setNewPatient((prev) => ({ ...prev, ageDays: event.target.value }))}
                      className="input-field"
                    />
                  </div>
                </div>
              )}
            </div>

            <div>
              <p className="text-sm font-medium mb-3">Select Tests (Each test creates a separate receipt) *</p>
              {loadingTests ? (
                <Loader message="Loading tests..." />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {tests.map((test) => (
                    <label key={test.id} className="flex items-center gap-2 rounded-lg border border-border p-3 cursor-pointer hover:bg-slate-50">
                      <input
                        type="checkbox"
                        checked={selectedNewTests.includes(test.id)}
                        onChange={() => toggleSelection(test.id, selectedNewTests, setSelectedNewTests)}
                      />
                      <span className="text-sm text-text-primary">{test.testName}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button type="submit" className="btn-primary flex items-center" disabled={submitting}>
                <FileCheck2 className="w-5 h-5 mr-2" />
                {submitting ? 'Saving...' : 'Save Patient & Generate Receipts'}
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-6 py-3 border border-border rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {generatedReceipts.length > 0 && (
        <div className="card p-6">
          <div className="flex items-center mb-4">
            <Receipt className="w-5 h-5 text-primary mr-2" />
            <h2 className="text-h3 font-semibold">Generated Receipts ({generatedReceipts.length})</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {generatedReceipts.map((receipt) => (
              <div key={receipt.receiptCode} className="rounded-xl border border-border p-4 space-y-2">
                <p className="text-xs uppercase text-text-secondary">Receipt Number</p>
                <p className="font-semibold text-text-primary">{receipt.receiptCode}</p>
                <p className="text-sm text-text-secondary">Patient ID: {receipt.patientRef}</p>
                <p className="text-sm text-text-secondary">Patient Name: {receipt.patientName}</p>
                <p className="text-sm text-text-secondary">Test: {receipt.tests?.[0] || 'N/A'}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}