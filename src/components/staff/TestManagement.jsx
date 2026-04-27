import { useState } from 'react';
import { Plus, TestTube, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function TestManagement() {
  const [tests, setTests] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const navigate = useNavigate();
  const [newTest, setNewTest] = useState({
    name: '',
    code: '',
    price: '',
    description: '',
    parameters: []
  });

  const handleAddTest = (e) => {
    e.preventDefault();

    if (!newTest.name || !newTest.code || !newTest.price) {
      alert('Please fill in all required fields');
      return;
    }

    const test = {
      id: tests.length + 1,
      ...newTest,
      price: parseFloat(newTest.price),
      parameters: newTest.parameters.filter(p => p.trim()),
      isActive: true
    };

    setTests([...tests, test]);
    setNewTest({ name: '', code: '', price: '', description: '', parameters: [] });
    setShowAddForm(false);
    alert('Test added successfully!');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-h1 font-bold text-text-primary">Test Management</h1>
          <p className="text-text-secondary">Manage available tests and their parameters</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="btn-primary flex items-center"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Test
        </button>
      </div>

      {/* Add Test Form */}
      {showAddForm && (
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-h3 font-semibold">Add New Test</h2>
            <button
              onClick={() => setShowAddForm(false)}
              className="text-text-secondary hover:text-text-primary"
            >
              ✕
            </button>
          </div>
          <form onSubmit={handleAddTest} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Test Name *</label>
                <input
                  type="text"
                  value={newTest.name}
                  onChange={(e) => setNewTest({ ...newTest, name: e.target.value })}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Test Code *</label>
                <input
                  type="text"
                  value={newTest.code}
                  onChange={(e) => setNewTest({ ...newTest, code: e.target.value.toUpperCase() })}
                  className="input-field"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Price (₹) *</label>
                <input
                  type="number"
                  value={newTest.price}
                  onChange={(e) => setNewTest({ ...newTest, price: e.target.value })}
                  className="input-field"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea
                value={newTest.description}
                onChange={(e) => setNewTest({ ...newTest, description: e.target.value })}
                className="input-field"
                rows={3}
              />
            </div>
            <div className="flex space-x-4">
              <button type="submit" className="btn-primary">
                Add Test
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

      {/* Tests List */}
      <div className="card">
        <div className="p-6 border-b border-border">
          <h2 className="text-h3 font-semibold">All Tests ({tests.length})</h2>
        </div>
        <div className="p-8 text-center">
          <TestTube className="w-10 h-10 text-text-secondary mx-auto mb-3" />
          <p className="text-text-primary font-medium">No test records loaded</p>
          <p className="text-sm text-text-secondary mt-1">
            Backend test catalog, status, and parameter actions will render in this table.
          </p>
          <button
            onClick={() => navigate('/staff/tests/1/parameters')}
            className="mt-4 inline-flex items-center text-primary hover:underline text-sm"
          >
            <Settings className="w-4 h-4 mr-1" />
            Open Parameter Layout
          </button>
        </div>
      </div>
    </div>
  );
}