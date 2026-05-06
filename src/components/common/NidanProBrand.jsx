export default function NidanProBrand({ className = '', variant = 'default' }) {
  if (variant === 'logo-with-text') {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <div className="w-9 h-9 bg-blue-500 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-xs">N</span>
        </div>
        <span className="font-bold text-lg">
          <span className="text-blue-500">Nidan</span>
          <span className="text-green-500">Pro</span>
        </span>
      </div>
    );
  }

  if (variant === 'text-only') {
    return (
      <span className={className}>
        <span className="text-blue-500">Nidan</span>
        <span className="text-green-500">Pro</span>
      </span>
    );
  }

  // default variant
  return (
    <span className={`font-semibold ${className}`}>
      <span className="text-blue-500">Nidan</span>
      <span className="text-green-500">Pro</span>
    </span>
  );
}
