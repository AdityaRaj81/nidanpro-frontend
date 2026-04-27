import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';

export default function TestParameters() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [parameters, setParameters] = useState([]);
  const [newParam, setNewParam] = useState({ name: '', unit: '', referenceRange: '' });

  const handleAddParameter = (e) => {
    e.preventDefault();
    if (!newParam.name || !newParam.unit || !newParam.referenceRange) {
      alert('Please fill in all parameter fields');
      return;
    }

    const nextParam = {
      id: Date.now(),
      ...newParam,
    };

    setParameters((prev) => [...prev, nextParam]);
    setNewParam({ name: '', unit: '', referenceRange: '' });
  };

  const handleDeleteParameter = (paramId) => {
    setParameters((prev) => prev.filter((param) => param.id !== paramId));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <button
          onClick={() => navigate('/staff/tests')}
          className="mr-4 p-2 hover:bg-gray-100 rounded-lg"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-h1 font-bold text-text-primary">Test Parameters</h1>
          <p className="text-text-secondary">
            Test ID: {id}
          </p>
        </div>
      </div>

      <div className="card p-6">
        <h2 className="text-h3 font-semibold mb-4">Add Parameter</h2>
        <form onSubmit={handleAddParameter} className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Parameter Name</label>
            <input
              type="text"
              value={newParam.name}
              onChange={(e) => setNewParam((prev) => ({ ...prev, name: e.target.value }))}
              className="input-field"
              placeholder="e.g. Hemoglobin"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Unit</label>
            <input
              type="text"
              value={newParam.unit}
              onChange={(e) => setNewParam((prev) => ({ ...prev, unit: e.target.value }))}
              className="input-field"
              placeholder="e.g. g/dL"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Reference Range</label>
            <input
              type="text"
              value={newParam.referenceRange}
              onChange={(e) => setNewParam((prev) => ({ ...prev, referenceRange: e.target.value }))}
              className="input-field"
              placeholder="e.g. 12.0-15.5"
            />
          </div>
          <div className="flex items-end">
            <button type="submit" className="btn-primary w-full flex items-center justify-center">
              <Plus className="w-4 h-4 mr-2" />
              Add Parameter
            </button>
          </div>
        </form>
      </div>

      <div className="card">
        <div className="p-6 border-b border-border">
          <h2 className="text-h3 font-semibold">Parameter List ({parameters.length})</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-6 py-3 text-sm font-medium text-text-secondary">Name</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-text-secondary">Unit</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-text-secondary">Reference Range</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-text-secondary">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {parameters.map((parameter) => (
                <tr key={parameter.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-text-primary">{parameter.name}</td>
                  <td className="px-6 py-4 text-text-secondary">{parameter.unit}</td>
                  <td className="px-6 py-4 text-text-secondary">{parameter.referenceRange}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleDeleteParameter(parameter.id)}
                      className="text-red-600 hover:underline text-sm flex items-center"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
