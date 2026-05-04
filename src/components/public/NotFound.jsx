import { Link } from 'react-router-dom';
import { Stethoscope, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="relative inline-block">
          <Stethoscope className="w-32 h-32 text-primary mx-auto opacity-20" />
          <h1 className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-6xl font-bold text-primary">
            404
          </h1>
        </div>
        
        <div className="space-y-4">
          <h2 className="text-h2 font-bold text-text-primary">
            Diagnosis: Page Not Found
          </h2>
          <p className="text-text-secondary">
            It seems we couldn't locate the medical record, lab report, or page you were looking for. Please check the URL or return to safety.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link
            to="/staff/dashboard"
            className="btn-primary flex items-center justify-center w-full sm:w-auto"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Staff Dashboard
          </Link>
          <Link
            to="/"
            className="btn-outline flex items-center justify-center w-full sm:w-auto"
          >
            Go to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
