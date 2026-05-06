import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, CheckCircle, FlaskConical, AlertTriangle } from 'lucide-react';
import InlineLoader from '../common/InlineLoader';
import api from '../../api/axiosConfig';
import Loader from '../common/Loader';

function evaluateParameterIssue(param, enteredValue) {
  if (!enteredValue || enteredValue.trim() === '') {
    return { outOfRange: false, issueMessage: '' };
  }

  const type = param.rangeRuleType || 'BETWEEN';
  if (type === 'CUSTOM_TEXT') {
    return { outOfRange: false, issueMessage: '' };
  }

  const numericValue = Number(enteredValue);
  if (Number.isNaN(numericValue)) {
    return { outOfRange: true, issueMessage: 'Value should be numeric for this parameter.' };
  }

  const lower = param.lowerBound != null ? Number(param.lowerBound) : null;
  const upper = param.upperBound != null ? Number(param.upperBound) : null;

  if (type === 'BETWEEN') {
    if (lower == null || upper == null) {
      return { outOfRange: false, issueMessage: '' };
    }
    const ok = numericValue >= lower && numericValue <= upper;
    return { outOfRange: !ok, issueMessage: ok ? '' : `Out of range: expected between ${lower} and ${upper}.` };
  }

  if (type === 'LESS_THAN') {
    if (upper == null) return { outOfRange: false, issueMessage: '' };
    const ok = numericValue < upper;
    return { outOfRange: !ok, issueMessage: ok ? '' : `Out of range: expected less than ${upper}.` };
  }

  if (type === 'LESS_THAN_OR_EQUAL') {
    if (upper == null) return { outOfRange: false, issueMessage: '' };
    const ok = numericValue <= upper;
    return { outOfRange: !ok, issueMessage: ok ? '' : `Out of range: expected less than or equal to ${upper}.` };
  }

  if (type === 'GREATER_THAN') {
    if (lower == null) return { outOfRange: false, issueMessage: '' };
    const ok = numericValue > lower;
    return { outOfRange: !ok, issueMessage: ok ? '' : `Out of range: expected greater than ${lower}.` };
  }

  if (type === 'GREATER_THAN_OR_EQUAL') {
    if (lower == null) return { outOfRange: false, issueMessage: '' };
    const ok = numericValue >= lower;
    return { outOfRange: !ok, issueMessage: ok ? '' : `Out of range: expected greater than or equal to ${lower}.` };
  }

  return { outOfRange: false, issueMessage: '' };
}

function formatRangeText(param) {
  const type = param.rangeRuleType || 'BETWEEN';
  if (type === 'BETWEEN') return `${param.lowerBound} - ${param.upperBound}`;
  if (type === 'LESS_THAN') return `< ${param.upperBound}`;
  if (type === 'LESS_THAN_OR_EQUAL') return `<= ${param.upperBound}`;
  if (type === 'GREATER_THAN') return `> ${param.lowerBound}`;
  if (type === 'GREATER_THAN_OR_EQUAL') return `>= ${param.lowerBound}`;
  return param.referenceRange || 'Custom';
}

export default function ReportEntry() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [parameters, setParameters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [results, setResults] = useState({});

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const [reportRes, parameterRes] = await Promise.all([
          api.get('/reports'),
          api.get(`/reports/${id}/parameters`)
        ]);
        const found = reportRes.data?.find(r => String(r.id) === String(id));
        setReport(found || { id, reportCode: `RPT-${id || '---'}` });
        setParameters(parameterRes.data || []);
      } catch (err) {
        console.error('Error fetching report:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [id]);

  const handleSaveDraft = async () => {
    setSaving(true);
    try {
      const payload = {
        results: parameters.map((param) => {
          const value = results[param.id] || '';
          const evaluation = evaluateParameterIssue(param, value);
          return {
            parameterId: param.id,
            value,
            outOfRange: evaluation.outOfRange,
            issueMessage: evaluation.issueMessage
          };
        }).filter((item) => item.value && item.value.trim() !== '')
      };

      await api.put(`/reports/${id}/results`, payload);
      alert('Results saved successfully!');
    } catch (err) {
      console.error('Save error', err);
      alert('Failed to save draft');
    } finally {
      setSaving(false);
    }
  };

  const handleMarkComplete = async () => {
    setSaving(true);
    try {
      await api.put(`/reports/${id}/verify`, { comments: 'Verified' });
      navigate('/staff/reports');
    } catch (err) {
      console.error('Complete error', err);
      alert('Failed to complete report');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <Loader message="Loading report..." />;
  }

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
          <h1 className="text-h1 font-bold text-text-primary">Report Entry</h1>
          <p className="text-text-secondary">Enter test values for {report?.reportCode}</p>
        </div>
      </div>

      <div className="card p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h3 className="font-medium text-text-secondary mb-1">Patient Name</h3>
            <p className="text-text-primary">{report?.patientName || 'No data found'}</p>
          </div>
          <div>
            <h3 className="font-medium text-text-secondary mb-1">Status</h3>
            <p className="text-text-primary">{report?.status || 'No data found'}</p>
          </div>
          <div>
            <h3 className="font-medium text-text-secondary mb-1">Report Code</h3>
            <p className="text-text-primary font-mono">{report?.reportCode || 'No data found'}</p>
          </div>
        </div>
      </div>

      {/* Parameter Entry */}
      <div className="card p-6">
        <h2 className="text-h3 font-semibold mb-6">Test Parameters</h2>

        {parameters.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border p-8 text-center">
            <FlaskConical className="w-10 h-10 text-text-secondary mx-auto mb-3" />
            <p className="text-text-primary font-medium">No parameters found for this test</p>
          </div>
        ) : (
          <div className="space-y-4">
            {parameters.map((param) => {
              const value = results[param.id] || '';
              const evaluation = evaluateParameterIssue(param, value);
              return (
                <div key={param.id} className="rounded-xl border border-gray-200 bg-white p-4">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <p className="font-semibold text-text-primary">{param.parameterName}</p>
                      <p className="text-xs text-text-secondary mt-1">Unit: {param.unit}</p>
                    </div>
                    <span className="text-xs font-semibold text-primary bg-blue-50 border border-blue-200 rounded-full px-3 py-1">
                      Range: {formatRangeText(param)}
                    </span>
                  </div>

                  <input
                    type="text"
                    value={value}
                    onChange={(e) => setResults((prev) => ({ ...prev, [param.id]: e.target.value }))}
                    placeholder="Enter measured value"
                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 transition-all ${evaluation.outOfRange
                      ? 'border-red-400 focus:ring-red-300 bg-red-50'
                      : 'border-gray-300 focus:ring-primary'
                      }`}
                  />

                  {evaluation.outOfRange && (
                    <p className="mt-2 text-sm text-red-700 underline decoration-red-600 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4" />
                      {evaluation.issueMessage}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex justify-between">
        <button
          onClick={() => navigate('/staff/reports')}
          className="px-6 py-3 border border-border rounded-lg hover:bg-gray-50"
        >
          Cancel
        </button>
        <div className="flex space-x-4">
          <button
            onClick={handleSaveDraft}
            disabled={saving}
            className="flex items-center px-6 py-3 border border-border rounded-lg hover:bg-gray-50 disabled:opacity-50 gap-2"
          >
            <Save className="w-5 h-5" />
            {saving ? <InlineLoader /> : 'Save Results'}
          </button>
          <button
            onClick={handleMarkComplete}
            disabled={saving}
            className="btn-primary flex items-center disabled:opacity-50"
          >
            <CheckCircle className="w-5 h-5 mr-2" />
            {saving ? <InlineLoader /> : 'Verify & Complete'}
          </button>
        </div>
      </div>
    </div>
  );
}