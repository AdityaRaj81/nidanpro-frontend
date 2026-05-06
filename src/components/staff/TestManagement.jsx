import { useState, useEffect } from 'react';
import { Plus, Edit2, Eye, X, Save, Search, AlertCircle, CheckCircle2, FlaskConical, ShieldAlert } from 'lucide-react';
import api from '../../api/axiosConfig';
import Loader from '../common/Loader';
import { useAuth } from '../../context/AuthContext';

export default function TestManagement() {
  const { staffAuth } = useAuth();
  const role = staffAuth?.role?.toUpperCase();
  const isSuperAdmin = role === 'SUPER_ADMIN';

  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [selectedTest, setSelectedTest] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [testParameters, setTestParameters] = useState([]);
  const [parametersLoading, setParametersLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const [formData, setFormData] = useState({
    testCode: '',
    testName: '',
    description: '',
    price: '',
    active: true
  });

  const [newParameter, setNewParameter] = useState({
    parameterName: '',
    unit: '',
    rangeRuleType: 'BETWEEN',
    lowerBound: '',
    upperBound: '',
    referenceRange: ''
  });

  // Load tests on mount
  useEffect(() => {
    fetchTests();
  }, []);

  const fetchTests = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/tests');
      setTests(response.data || []);
    } catch (err) {
      console.error('Failed to fetch tests:', err);
      setError('Failed to load tests. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchTestParameters = async (testId) => {
    try {
      setParametersLoading(true);
      const response = await api.get(`/tests/${testId}/parameters`);
      setTestParameters(response.data || []);
    } catch (err) {
      console.error('Failed to fetch parameters:', err);
      setTestParameters([]);
    } finally {
      setParametersLoading(false);
    }
  };

  const handleAddTest = async (e) => {
    e.preventDefault();

    if (!formData.testCode.trim() || !formData.testName.trim() || !formData.price) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const response = await api.post('/tests', {
        testCode: formData.testCode,
        testName: formData.testName,
        description: formData.description,
        price: parseFloat(formData.price),
        active: formData.active
      });

      setTests([...tests, response.data]);
      resetForm();
      setShowAddForm(false);
      alert('Test created successfully! You can now add parameters.');

      // Show details modal for new test
      setSelectedTest(response.data);
      await fetchTestParameters(response.data.id);
      setShowDetailsModal(true);
    } catch (err) {
      console.error('Failed to create test:', err);
      alert(err.response?.data?.message || 'Failed to create test');
    }
  };

  const handleEditTest = async (testId) => {
    if (!formData.testCode.trim() || !formData.testName.trim() || !formData.price) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const response = await api.put(`/tests/${testId}`, {
        testCode: formData.testCode,
        testName: formData.testName,
        description: formData.description,
        price: parseFloat(formData.price),
        active: formData.active
      });

      const updatedTests = tests.map(t => t.id === testId ? response.data : t);
      setTests(updatedTests);
      resetForm();
      setEditingId(null);
      alert('Test updated successfully!');

      // Refresh details if viewing
      if (selectedTest?.id === testId) {
        setSelectedTest(response.data);
      }
    } catch (err) {
      console.error('Failed to update test:', err);
      alert(err.response?.data?.message || 'Failed to update test');
    }
  };

  const handleAddParameter = async () => {
    if (!selectedTest || !newParameter.parameterName.trim() || !newParameter.unit.trim()) {
      alert('Please fill in all parameter fields');
      return;
    }

    const requiresLower = ['BETWEEN', 'GREATER_THAN', 'GREATER_THAN_OR_EQUAL'].includes(newParameter.rangeRuleType);
    const requiresUpper = ['BETWEEN', 'LESS_THAN', 'LESS_THAN_OR_EQUAL'].includes(newParameter.rangeRuleType);
    const isCustom = newParameter.rangeRuleType === 'CUSTOM_TEXT';

    if (requiresLower && newParameter.lowerBound === '') {
      alert('Please enter a lower value.');
      return;
    }
    if (requiresUpper && newParameter.upperBound === '') {
      alert('Please enter an upper value.');
      return;
    }
    if (newParameter.rangeRuleType === 'BETWEEN' && Number(newParameter.lowerBound) > Number(newParameter.upperBound)) {
      alert('Lower value cannot be greater than upper value.');
      return;
    }
    if (isCustom && !newParameter.referenceRange.trim()) {
      alert('Please add custom reference text.');
      return;
    }

    try {
      const response = await api.post(`/tests/${selectedTest.id}/parameters`, {
        parameterName: newParameter.parameterName,
        unit: newParameter.unit,
        rangeRuleType: newParameter.rangeRuleType,
        lowerBound: newParameter.lowerBound === '' ? null : Number(newParameter.lowerBound),
        upperBound: newParameter.upperBound === '' ? null : Number(newParameter.upperBound),
        referenceRange: newParameter.referenceRange || null
      });

      setTestParameters([...testParameters, response.data]);
      setNewParameter({ parameterName: '', unit: '', rangeRuleType: 'BETWEEN', lowerBound: '', upperBound: '', referenceRange: '' });
      alert('Parameter added successfully!');
    } catch (err) {
      console.error('Failed to add parameter:', err);
      alert(err.response?.data?.message || 'Failed to add parameter');
    }
  };

  const handleViewTest = (test) => {
    setSelectedTest(test);
    fetchTestParameters(test.id);
    setShowDetailsModal(true);
  };

  const handleEditFormOpen = (test) => {
    setFormData({
      testCode: test.testCode,
      testName: test.testName,
      description: test.description || '',
      price: test.price.toString(),
      active: test.active
    });
    setEditingId(test.id);
    setShowDetailsModal(false);
  };

  const resetForm = () => {
    setFormData({
      testCode: '',
      testName: '',
      description: '',
      price: '',
      active: true
    });
    setNewParameter({ parameterName: '', unit: '', rangeRuleType: 'BETWEEN', lowerBound: '', upperBound: '', referenceRange: '' });
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  const filteredTests = tests.filter(test =>
    test.testCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
    test.testName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatRangeBadge = (param) => {
    const type = param.rangeRuleType || 'BETWEEN';
    if (type === 'BETWEEN') return `${param.lowerBound} - ${param.upperBound}`;
    if (type === 'LESS_THAN') return `< ${param.upperBound}`;
    if (type === 'LESS_THAN_OR_EQUAL') return `<= ${param.upperBound}`;
    if (type === 'GREATER_THAN') return `> ${param.lowerBound}`;
    if (type === 'GREATER_THAN_OR_EQUAL') return `>= ${param.lowerBound}`;
    return param.referenceRange || 'Custom';
  };

  if (!isSuperAdmin) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-h1 font-bold text-text-primary">Test Management</h1>
          <p className="text-text-secondary">Restricted Area</p>
        </div>
        <div className="card p-10 text-center border-l-4 border-red-500">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
            <ShieldAlert className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-bold text-text-primary">Restricted Area</h2>
          <p className="text-text-secondary mt-2">Only Super Admin can access the test management section.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return <Loader message="Loading tests..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-h1 font-bold text-text-primary">Test Management</h1>
          <p className="text-text-secondary">Manage your laboratory test catalog and parameters</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setEditingId(null);
            setShowAddForm(true);
          }}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add New Test
        </button>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-6 py-4 rounded-lg flex items-start gap-3 shadow-sm">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-medium">Failed to load tests</p>
            <p className="text-sm text-red-600 mt-1">{error}</p>
          </div>
          <button onClick={() => setError(null)} className="text-red-700 hover:text-red-900">
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Add/Edit Test Form */}
      {(showAddForm || editingId) && (
        <div className="card border-l-4 border-primary shadow-lg">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-blue-600 rounded-lg flex items-center justify-center">
                <FlaskConical className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-h3 font-semibold">{editingId ? 'Edit Test Details' : 'Create New Test'}</h2>
            </div>
            <button
              onClick={() => {
                setShowAddForm(false);
                setEditingId(null);
                resetForm();
              }}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-text-secondary" />
            </button>
          </div>
          <form onSubmit={(e) => {
            e.preventDefault();
            editingId ? handleEditTest(editingId) : handleAddTest(e);
          }} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2 text-text-primary">Test Code *</label>
                <input
                  type="text"
                  value={formData.testCode}
                  onChange={(e) => setFormData({ ...formData, testCode: e.target.value.toUpperCase() })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  placeholder="e.g., CBC"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2 text-text-primary">Test Name *</label>
                <input
                  type="text"
                  value={formData.testName}
                  onChange={(e) => setFormData({ ...formData, testName: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  placeholder="e.g., Complete Blood Count"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2 text-text-primary">Price (₹) *</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  placeholder="0.00"
                  required
                />
              </div>
              <div className="flex items-end">
                <label className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200 cursor-pointer hover:bg-blue-100 transition-colors flex-1">
                  <input
                    type="checkbox"
                    checked={formData.active}
                    onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                    className="w-4 h-4 accent-primary"
                  />
                  <span className="text-sm font-medium text-text-primary">Active Test</span>
                </label>
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2 text-text-primary">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"
                rows={3}
                placeholder="Describe this test and what it's used for..."
              />
            </div>
            <div className="flex gap-3 pt-4">
              <button type="submit" className="flex-1 bg-gradient-to-r from-primary to-blue-600 hover:from-blue-600 hover:to-primary text-white py-2.5 rounded-lg font-medium flex items-center justify-center gap-2 transition-all hover:shadow-lg">
                <Save className="w-4 h-4" />
                {editingId ? 'Update Test' : 'Create Test'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAddForm(false);
                  setEditingId(null);
                  resetForm();
                }}
                className="flex-1 px-6 py-2.5 border-2 border-gray-300 text-text-primary font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Search Bar */}
      {tests.length > 0 && (
        <div className="relative">
          <Search className="absolute left-4 top-3.5 w-5 h-5 text-text-secondary pointer-events-none" />
          <input
            type="text"
            placeholder="Search tests by code or name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
          />
        </div>
      )}

      {/* Tests Grid/List */}
      <div>
        {filteredTests.length === 0 ? (
          <div className="card p-12 text-center space-y-4">
            <div className="flex justify-center">
              <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
                <FlaskConical className="w-10 h-10 text-text-secondary" />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-text-primary">
                {tests.length === 0 ? 'No tests found' : 'No matching tests'}
              </h3>
              <p className="text-text-secondary mt-2">
                {tests.length === 0
                  ? 'Create your first test to get started'
                  : 'Try adjusting your search criteria'}
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTests.map((test) => (
              <div key={test.id} className="card p-5 hover:shadow-lg transition-all duration-200 border-l-4 border-primary hover:border-green-500 group">
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white bg-gradient-to-r from-primary to-blue-600 px-3 py-1 rounded-full">
                          {test.testCode}
                        </span>
                        {test.active && (
                          <span className="text-xs font-medium text-green-700 bg-green-100 px-2.5 py-1 rounded-full flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            Active
                          </span>
                        )}
                      </div>
                      <h3 className="text-base font-bold text-text-primary mt-2 group-hover:text-primary transition-colors">{test.testName}</h3>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                    <p className="text-xs text-text-secondary font-medium">Price</p>
                    <p className="text-2xl font-bold text-text-primary">₹{parseFloat(test.price).toFixed(2)}</p>
                  </div>

                  {/* Metadata */}
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="bg-gray-50 p-2.5 rounded-lg border border-gray-200">
                      <p className="text-text-secondary font-medium">Created By</p>
                      <p className="text-text-primary font-semibold mt-1">{test.createdBy?.name || 'System'}</p>
                    </div>
                    <div className="bg-gray-50 p-2.5 rounded-lg border border-gray-200">
                      <p className="text-text-secondary font-medium">Updated</p>
                      <p className="text-text-primary font-semibold mt-1">{new Date(test.updatedAt || test.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>

                  {/* Description Preview */}
                  {test.description && (
                    <p className="text-xs text-text-secondary line-clamp-2">{test.description}</p>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => handleViewTest(test)}
                      className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-2.5 rounded-lg font-medium text-sm flex items-center justify-center gap-1 transition-all"
                      title="View details"
                    >
                      <Eye className="w-4 h-4" />
                      View
                    </button>
                    <button
                      onClick={() => handleEditFormOpen(test)}
                      className="flex-1 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white py-2.5 rounded-lg font-medium text-sm flex items-center justify-center gap-1 transition-all"
                      title="Edit test"
                    >
                      <Edit2 className="w-4 h-4" />
                      Edit
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Test Details Modal */}
      {showDetailsModal && selectedTest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
            {/* Modal Header with Gradient */}
            <div className="sticky top-0 bg-gradient-to-r from-primary to-blue-600 text-white p-6 flex items-start justify-between">
              <div className="flex-1">
                <h2 className="text-2xl font-bold">{selectedTest.testName}</h2>
                <p className="text-blue-100 text-sm mt-1">Code: {selectedTest.testCode}</p>
              </div>
              <button
                onClick={() => {
                  setShowDetailsModal(false);
                  setSelectedTest(null);
                  setTestParameters([]);
                }}
                className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-all"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="overflow-y-auto max-h-[calc(90vh-100px)] p-6 space-y-6">
              {/* Test Information Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-primary to-blue-600 bg-opacity-10 p-4 rounded-lg border border-primary border-opacity-20">
                  <p className="text-xs text-text-secondary font-medium uppercase">Price</p>
                  <p className="text-3xl font-bold text-primary mt-2">₹{parseFloat(selectedTest.price).toFixed(2)}</p>
                </div>
                <div className="bg-gradient-to-br from-green-500 to-green-600 bg-opacity-10 p-4 rounded-lg border border-green-500 border-opacity-20">
                  <p className="text-xs text-text-secondary font-medium uppercase">Status</p>
                  <div className="mt-2">
                    <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold ${selectedTest.active
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                      }`}>
                      {selectedTest.active ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                      {selectedTest.active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <p className="text-xs text-text-secondary font-medium uppercase">Created By</p>
                  <p className="text-sm font-semibold text-text-primary mt-2">{selectedTest.createdBy?.name || 'System'}</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <p className="text-xs text-text-secondary font-medium uppercase">Last Updated</p>
                  <p className="text-sm font-semibold text-text-primary mt-2">{formatDate(selectedTest.updatedAt || selectedTest.createdAt)}</p>
                </div>
              </div>

              {selectedTest.description && (
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <p className="text-sm font-semibold text-text-primary mb-2">Description</p>
                  <p className="text-sm text-text-secondary leading-relaxed">{selectedTest.description}</p>
                </div>
              )}

              {/* Parameters Section */}
              <div className="border-t border-gray-200 pt-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-primary to-blue-600 rounded-lg flex items-center justify-center">
                    <FlaskConical className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-text-primary">Test Parameters ({testParameters.length})</h3>
                </div>

                {parametersLoading ? (
                  <Loader message="Loading parameters..." />
                ) : testParameters.length === 0 ? (
                  <p className="text-sm text-text-secondary bg-gray-50 p-4 rounded-lg text-center">No parameters added yet</p>
                ) : (
                  <div className="space-y-2">
                    {testParameters.map((param, idx) => (
                      <div key={param.id} className="bg-gray-50 p-4 rounded-lg border border-gray-200 hover:border-primary transition-colors">
                        <div className="flex items-start gap-3">
                          <span className="text-xs font-bold w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center flex-shrink-0">{idx + 1}</span>
                          <div className="flex-1">
                            <p className="font-semibold text-text-primary">{param.parameterName}</p>
                            <div className="flex gap-4 mt-2 text-xs">
                              <div>
                                <span className="text-text-secondary font-medium">Unit:</span>
                                <span className="ml-2 text-text-primary bg-white px-2 py-1 rounded border border-gray-200">{param.unit}</span>
                              </div>
                              <div>
                                <span className="text-text-secondary font-medium">Range:</span>
                                <span className="ml-2 text-text-primary bg-white px-2 py-1 rounded border border-gray-200">{formatRangeBadge(param)}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add Parameter Form */}
                <div className="border-t border-gray-200 mt-6 pt-6">
                  <h4 className="font-bold text-text-primary mb-4 flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Add New Parameter
                  </h4>
                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="Parameter Name (e.g., Hemoglobin, RBC Count)"
                      value={newParameter.parameterName}
                      onChange={(e) => setNewParameter({ ...newParameter, parameterName: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    />
                    <input
                      type="text"
                      placeholder="Unit (e.g., g/dL, ×10³/µL)"
                      value={newParameter.unit}
                      onChange={(e) => setNewParameter({ ...newParameter, unit: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    />
                    <select
                      value={newParameter.rangeRuleType}
                      onChange={(e) => setNewParameter({ ...newParameter, rangeRuleType: e.target.value, lowerBound: '', upperBound: '', referenceRange: '' })}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    >
                      <option value="BETWEEN">Between (Lowest to Highest)</option>
                      <option value="LESS_THAN">Less Than (&lt; value)</option>
                      <option value="LESS_THAN_OR_EQUAL">Less Than or Equal (&lt;= value)</option>
                      <option value="GREATER_THAN">Greater Than (&gt; value)</option>
                      <option value="GREATER_THAN_OR_EQUAL">Greater Than or Equal (&gt;= value)</option>
                      <option value="CUSTOM_TEXT">Custom Text</option>
                    </select>

                    {newParameter.rangeRuleType !== 'CUSTOM_TEXT' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {['BETWEEN', 'GREATER_THAN', 'GREATER_THAN_OR_EQUAL'].includes(newParameter.rangeRuleType) && (
                          <input
                            type="number"
                            step="0.0001"
                            placeholder="Lowest Value"
                            value={newParameter.lowerBound}
                            onChange={(e) => setNewParameter({ ...newParameter, lowerBound: e.target.value })}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                          />
                        )}
                        {['BETWEEN', 'LESS_THAN', 'LESS_THAN_OR_EQUAL'].includes(newParameter.rangeRuleType) && (
                          <input
                            type="number"
                            step="0.0001"
                            placeholder="Highest Value"
                            value={newParameter.upperBound}
                            onChange={(e) => setNewParameter({ ...newParameter, upperBound: e.target.value })}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                          />
                        )}
                      </div>
                    )}

                    {newParameter.rangeRuleType === 'CUSTOM_TEXT' && (
                      <input
                        type="text"
                        placeholder="Reference text (e.g., Non-reactive, Negative)"
                        value={newParameter.referenceRange}
                        onChange={(e) => setNewParameter({ ...newParameter, referenceRange: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                      />
                    )}
                    <button
                      onClick={handleAddParameter}
                      className="w-full bg-gradient-to-r from-primary to-blue-600 hover:from-blue-600 hover:to-primary text-white py-2.5 rounded-lg font-semibold transition-all hover:shadow-lg flex items-center justify-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Add Parameter
                    </button>
                  </div>
                </div>
              </div>

              {/* Close Button */}
              <div className="flex gap-3 pt-6 border-t border-gray-200">
                <button
                  onClick={() => {
                    setShowDetailsModal(false);
                    setSelectedTest(null);
                    setTestParameters([]);
                  }}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 text-text-primary font-semibold rounded-lg hover:bg-gray-50 transition-all"
                >
                  Close
                </button>
                <button
                  onClick={() => handleEditFormOpen(selectedTest)}
                  className="flex-1 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white px-6 py-3 font-semibold rounded-lg transition-all flex items-center justify-center gap-2"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit Test
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}