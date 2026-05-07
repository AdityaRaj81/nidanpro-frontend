import { useEffect, useState } from 'react';
import { AlertTriangle, ArrowLeft } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../api/axiosConfig';

function getErrorMessage(err, fallback) {
  return err?.response?.data?.message || err?.response?.data?.error || fallback;
}

export default function SuperAdminDeleteLabPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [lab, setLab] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadLab = async () => {
      try {
        const response = await api.get(`/super-admin/labs/${id}`);
        setLab(response.data);
      } catch (err) {
        setError(getErrorMessage(err, 'Failed to load lab data'));
      } finally {
        setLoading(false);
      }
    };

    loadLab();
  }, [id]);

  const deleteLab = async () => {
    setDeleting(true);
    setError('');
    try {
      await api.delete(`/super-admin/labs/${id}`);
      navigate('/super-admin/labs');
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to delete lab'));
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return <p className="text-text-secondary">Loading delete page...</p>;
  }

  return (
    <div className="space-y-6">
      <button
        type="button"
        onClick={() => navigate('/super-admin/labs')}
        className="inline-flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-gray-50"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Labs
      </button>

      <div className="card p-6 border-red-200 bg-red-50">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-6 h-6 text-red-600 mt-0.5" />
          <div className="space-y-3">
            <h2 className="text-2xl font-bold text-red-700">Delete Lab</h2>
            <p className="text-red-700">
              You are about to delete <strong>{lab?.labName}</strong> ({lab?.labNumber}). This action cannot be undone.
            </p>
            <p className="text-sm text-red-700">
              Note: If this lab has branches or staff users, backend will block deletion until those are removed.
            </p>
          </div>
        </div>
      </div>

      {error && <div className="rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

      <div className="flex gap-3">
        <button
          type="button"
          onClick={deleteLab}
          disabled={deleting}
          className="px-6 py-3 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium disabled:opacity-60"
        >
          {deleting ? 'Deleting...' : 'Yes, Delete Lab'}
        </button>
        <button
          type="button"
          onClick={() => navigate('/super-admin/labs')}
          className="px-6 py-3 rounded-lg border border-border hover:bg-gray-50"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
