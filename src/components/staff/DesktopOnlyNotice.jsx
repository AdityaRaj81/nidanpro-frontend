import { MonitorSmartphone, Shield } from 'lucide-react';
import NidanProBrand from '../common/NidanProBrand';

export default function DesktopOnlyNotice() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="max-w-lg w-full card p-8 text-center">
        <div className="flex items-center justify-center mb-4">
          <img src="/logo_NidanPro.png" alt="NidanPro Logo" className="w-16 h-16" />
        </div>
        <h1 className="text-h2 font-bold text-text-primary mb-2"><NidanProBrand className="text-h2" variant="text-only" /> Staff Portal</h1>
        <p className="text-text-secondary mb-6">This interface is optimized for laptop and desktop screens only.</p>

        <div className="p-4 bg-primary-50 rounded-lg border border-primary-100 flex items-start gap-3 text-left">
          <MonitorSmartphone className="w-5 h-5 text-primary mt-0.5" />
          <p className="text-sm text-text-primary">
            Please open this page on a screen width of at least 1024px to continue with staff operations.
          </p>
        </div>
      </div>
    </div>
  );
}
