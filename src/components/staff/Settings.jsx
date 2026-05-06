import { useState, useEffect } from 'react';
import { Save, Upload, Building, FileText, Signature } from 'lucide-react';
import InlineLoader from '../common/InlineLoader';

export default function Settings() {
  const [settings, setSettings] = useState({
    labName: '',
    address: '',
    phone: '',
    email: '',
    website: '',
    logo: null,
    signature: null
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('nidanpro_settings');
    if (saved) {
      try {
        setSettings(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse settings', e);
      }
    }
  }, []);

  const handleInputChange = (field, value) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (field, file) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSettings(prev => ({ ...prev, [field]: e.target.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      localStorage.setItem('nidanpro_settings', JSON.stringify(settings));
      alert('Settings saved successfully!');
    } catch (err) {
      console.error(err);
      alert('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-h1 font-bold text-text-primary">Settings</h1>
        <p className="text-text-secondary">Configure lab information and branding</p>
      </div>

      {/* Lab Information */}
      <div className="card p-6">
        <div className="flex items-center mb-6">
          <Building className="w-6 h-6 text-primary mr-3" />
          <h2 className="text-h3 font-semibold">Lab Information</h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Lab Name *</label>
            <input
              type="text"
              value={settings.labName}
              onChange={(e) => handleInputChange('labName', e.target.value)}
              className="input-field"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Address</label>
            <textarea
              value={settings.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              className="input-field"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Phone Number</label>
              <input
                type="tel"
                value={settings.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Email Address</label>
              <input
                type="email"
                value={settings.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="input-field"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Website</label>
            <input
              type="url"
              value={settings.website}
              onChange={(e) => handleInputChange('website', e.target.value)}
              className="input-field"
              placeholder="https://www.example.com"
            />
          </div>
        </div>
      </div>

      {/* Branding */}
      <div className="card p-6">
        <div className="flex items-center mb-6">
          <FileText className="w-6 h-6 text-primary mr-3" />
          <h2 className="text-h3 font-semibold">Branding</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Logo Upload */}
          <div>
            <label className="block text-sm font-medium mb-2">Lab Logo</label>
            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
              {settings.logo ? (
                <div className="space-y-4">
                  <img
                    src={settings.logo}
                    alt="Lab Logo"
                    className="max-h-32 mx-auto"
                  />
                  <button
                    onClick={() => handleInputChange('logo', null)}
                    className="text-red-600 text-sm hover:underline"
                  >
                    Remove Logo
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <Upload className="w-12 h-12 text-text-secondary mx-auto" />
                  <div>
                    <p className="text-text-secondary">Upload lab logo</p>
                    <p className="text-text-secondary text-sm">PNG, JPG up to 2MB</p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload('logo', e.target.files[0])}
                    className="hidden"
                    id="logo-upload"
                  />
                  <label
                    htmlFor="logo-upload"
                    className="btn-primary cursor-pointer inline-block"
                  >
                    Choose File
                  </label>
                </div>
              )}
            </div>
          </div>

          {/* Signature Upload */}
          <div>
            <label className="block text-sm font-medium mb-2">Doctor Signature</label>
            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
              {settings.signature ? (
                <div className="space-y-4">
                  <img
                    src={settings.signature}
                    alt="Doctor Signature"
                    className="max-h-32 mx-auto"
                  />
                  <button
                    onClick={() => handleInputChange('signature', null)}
                    className="text-red-600 text-sm hover:underline"
                  >
                    Remove Signature
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <Signature className="w-12 h-12 text-text-secondary mx-auto" />
                  <div>
                    <p className="text-text-secondary">Upload signature</p>
                    <p className="text-text-secondary text-sm">PNG, JPG up to 1MB</p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload('signature', e.target.files[0])}
                    className="hidden"
                    id="signature-upload"
                  />
                  <label
                    htmlFor="signature-upload"
                    className="btn-primary cursor-pointer inline-block"
                  >
                    Choose File
                  </label>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="btn-primary flex items-center disabled:opacity-50 gap-2"
        >
          <Save className="w-5 h-5" />
          {saving ? <InlineLoader /> : 'Save Settings'}
        </button>
      </div>
    </div>
  );
}