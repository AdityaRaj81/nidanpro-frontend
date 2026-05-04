import { Activity } from 'lucide-react';

export default function Loader({ message = "Loading..." }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] w-full p-8">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <Activity className="w-6 h-6 text-primary animate-pulse" />
        </div>
      </div>
      <p className="mt-4 text-text-secondary font-medium animate-pulse">{message}</p>
    </div>
  );
}
