import { Loader2 } from 'lucide-react';

export default function InlineLoader({ size = 16, className = '' }) {
  const sizeClass = size === 16 ? 'w-4 h-4' : size === 20 ? 'w-5 h-5' : `w-${size} h-${size}`;
  return (
    <span className={`inline-flex items-center justify-center ${className}`} aria-live="polite" aria-busy="true">
      <Loader2 className={`${sizeClass} animate-spin text-current`} />
      <span className="sr-only">Loading</span>
    </span>
  );
}
