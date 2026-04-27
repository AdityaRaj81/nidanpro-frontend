import { useMemo, useState } from 'react';
import { Search, Plus, Receipt, CalendarDays, FileCheck2 } from 'lucide-react';

export default function Patients() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [queryType, setQueryType] = useState('phone');
  const [queryValue, setQueryValue] = useState('');
  const [selectedExistingReports, setSelectedExistingReports] = useState([]);
  const [latestReceipt, setLatestReceipt] = useState(null);

  const [newPatient, setNewPatient] = useState({
    name: '',
    phone: '',
    dob: '',
    age: '',
    gender: '',
    address: ''
  });
  const [selectedNewReports, setSelectedNewReports] = useState([]);

  const reportTypes = useMemo(
    () => [
      'Complete Blood Count (CBC)',
      'Lipid Profile',
      'Thyroid Function Test',
      'Liver Function Test',
      'Kidney Function Test',
      'Blood Sugar Panel',
    ],
    []
  );

  const calculateAge = (dob) => {
    if (!dob) return '';
    const birthDate = new Date(dob);
    const today = new Date();
    let years = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      years -= 1;
    }
    return years >= 0 ? String(years) : '';
  };

  const toggleReportSelection = (report, selectedList, setter) => {
    if (selectedList.includes(report)) {
      setter(selectedList.filter((item) => item !== report));
      return;
    }
    setter([...selectedList, report]);
  };

  const handleAddNewPatient = (e) => {
    e.preventDefault();

    if (!newPatient.name || !newPatient.phone || !newPatient.dob || !newPatient.gender) {
      alert('Please fill in all required fields');
      return;
    }
    if (selectedNewReports.length === 0) {
      alert('Please select at least one report type');
      return;
    }

    const receipt = {
      receiptId: `REC-${Date.now()}`,
      generatedAt: new Date().toLocaleString(),
      patientRef: 'To be assigned by backend',
      patientName: newPatient.name,
      selectedReports: selectedNewReports,
      source: 'new',
    };

    setLatestReceipt(receipt);
    setNewPatient({ name: '', phone: '', dob: '', age: '', gender: '', address: '' });
    setSelectedNewReports([]);
  };

  const handleGenerateExistingReceipt = (e) => {
    e.preventDefault();

    if (!queryValue.trim()) {
      alert(`Please enter patient ${queryType === 'phone' ? 'phone number' : 'ID'}`);
      return;
    }
    if (selectedExistingReports.length === 0) {
      alert('Please select at least one report type');
      return;
    }

    const receipt = {
      receiptId: `REC-${Date.now()}`,
      generatedAt: new Date().toLocaleString(),
      patientRef: queryValue,
      patientName: 'Fetched from backend',
      selectedReports: selectedExistingReports,
      source: 'existing',
      queryType,
    };

    setLatestReceipt(receipt);
    setSelectedExistingReports([]);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-h1 font-bold text-text-primary">Patients</h1>
          <p className="text-text-secondary">Backend-ready patient intake, report selection, and receipt generation.</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="btn-primary flex items-center"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Patient
        </button>
      </div>

      <div className="card p-6">
        <div className="flex items-center mb-4">
          <Search className="w-5 h-5 text-primary mr-2" />
          <h2 className="text-h3 font-semibold">Existing Patient Search</h2>
        </div>
        <form onSubmit={handleGenerateExistingReceipt} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Search By</label>
              <select
                value={queryType}
                onChange={(e) => setQueryType(e.target.value)}
                className="input-field"
              >
                <option value="phone">Phone Number</option>
                <option value="patientId">Patient ID</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">
                {queryType === 'phone' ? 'Phone Number' : 'Patient ID'}
              </label>
              <input
                type="text"
                value={queryValue}
                onChange={(e) => setQueryValue(e.target.value)}
                placeholder={queryType === 'phone' ? 'Enter patient phone number' : 'Enter patient ID'}
                className="input-field"
              />
            </div>
          </div>

          <div>
            <p className="text-sm font-medium mb-3">Select Required Reports</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {reportTypes.map((report) => (
                <label key={report} className="flex items-center gap-2 rounded-lg border border-border p-3 cursor-pointer hover:bg-slate-50">
                  <input
                    type="checkbox"
                    checked={selectedExistingReports.includes(report)}
                    onChange={() => toggleReportSelection(report, selectedExistingReports, setSelectedExistingReports)}
                  />
                  <span className="text-sm text-text-primary">{report}</span>
                </label>
              ))}
            </div>
          </div>

          <button type="submit" className="btn-primary flex items-center">
            <Receipt className="w-5 h-5 mr-2" />
            Generate Receipt for Existing Patient
          </button>
        </form>
      </div>

      {showAddForm && (
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-h3 font-semibold">New Patient Intake</h2>
            <button
              onClick={() => setShowAddForm(false)}
              className="text-text-secondary hover:text-text-primary"
            >
              X
            </button>
          </div>

          <form onSubmit={handleAddNewPatient} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Full Name *</label>
                <input
                  type="text"
                  value={newPatient.name}
                  onChange={(e) => setNewPatient({ ...newPatient, name: e.target.value })}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Phone Number *</label>
                <input
                  type="tel"
                  value={newPatient.phone}
                  onChange={(e) => setNewPatient({ ...newPatient, phone: e.target.value })}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Date of Birth *</label>
                <div className="relative">
                  <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
                  <input
                    type="date"
                    value={newPatient.dob}
                    onChange={(e) => {
                      const dob = e.target.value;
                      setNewPatient({ ...newPatient, dob, age: calculateAge(dob) });
                    }}
                    className="input-field pl-10"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Age (Auto Calculated)</label>
                <input
                  type="text"
                  value={newPatient.age}
                  className="input-field bg-gray-50"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Gender *</label>
                <select
                  value={newPatient.gender}
                  onChange={(e) => setNewPatient({ ...newPatient, gender: e.target.value })}
                  className="input-field"
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Address</label>
                <input
                  type="text"
                  value={newPatient.address}
                  onChange={(e) => setNewPatient({ ...newPatient, address: e.target.value })}
                  className="input-field"
                />
              </div>
            </div>

            <div>
              <p className="text-sm font-medium mb-3">Select Required Reports *</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {reportTypes.map((report) => (
                  <label key={report} className="flex items-center gap-2 rounded-lg border border-border p-3 cursor-pointer hover:bg-slate-50">
                    <input
                      type="checkbox"
                      checked={selectedNewReports.includes(report)}
                      onChange={() => toggleReportSelection(report, selectedNewReports, setSelectedNewReports)}
                    />
                    <span className="text-sm text-text-primary">{report}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button type="submit" className="btn-primary flex items-center">
                <FileCheck2 className="w-5 h-5 mr-2" />
                Save Intake & Generate Receipt
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

      {latestReceipt && (
        <div className="card p-6">
          <div className="flex items-center mb-4">
            <Receipt className="w-5 h-5 text-primary mr-2" />
            <h2 className="text-h3 font-semibold">Auto Generated Receipt</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div className="rounded-lg border border-border p-3">
              <p className="text-text-secondary">Receipt ID</p>
              <p className="font-medium text-text-primary">{latestReceipt.receiptId}</p>
            </div>
            <div className="rounded-lg border border-border p-3">
              <p className="text-text-secondary">Generated At</p>
              <p className="font-medium text-text-primary">{latestReceipt.generatedAt}</p>
            </div>
            <div className="rounded-lg border border-border p-3">
              <p className="text-text-secondary">Patient Reference</p>
              <p className="font-medium text-text-primary">{latestReceipt.patientRef}</p>
            </div>
            <div className="rounded-lg border border-border p-3">
              <p className="text-text-secondary">Patient Name</p>
              <p className="font-medium text-text-primary">{latestReceipt.patientName}</p>
            </div>
          </div>
          <div className="mt-4 rounded-lg border border-border p-3">
            <p className="text-text-secondary text-sm mb-2">Requested Reports</p>
            <ul className="space-y-1">
              {latestReceipt.selectedReports.map((report) => (
                <li key={report} className="text-sm text-text-primary">- {report}</li>
              ))}
            </ul>
          </div>
          <p className="text-xs text-text-secondary mt-3">
            Final amount, patient ID, and report codes will be injected from backend response.
          </p>
        </div>
      )}
    </div>
  );
}