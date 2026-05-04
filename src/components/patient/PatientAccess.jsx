import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Phone, Shield, FileText } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axiosConfig';

export default function PatientAccess() {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [reportCode, setReportCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setPatientAuth } = useAuth();

  const handleSendOTP = async () => {
    if (!phone || phone.length < 10) {
      alert('Please enter a valid phone number');
      return;
    }

    setLoading(true);
    try {
      await api.post('/patient-auth/send-otp', { phoneNumber: phone });
      setOtpSent(true);
      alert('OTP sent to your phone');
    } catch (err) {
      console.error('Send OTP error', err);
      alert('Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp || otp.length < 4) {
      alert('Please enter valid OTP');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/patient-auth/verify-otp', { phoneNumber: phone, otp });
      const authPayload = { phone, verified: true, token: response.data.token, user: response.data };
      setPatientAuth(authPayload);
      
      // If we have patient objects returned, we can navigate directly
      if (response.data.patients && response.data.patients.length === 1) {
        navigate('/patient/profile', { state: { patient: response.data.patients[0] } });
      } else {
        navigate('/patients');
      }
    } catch (err) {
      console.error('Verify OTP error', err);
      alert('Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReportCode = async () => {
    if (!reportCode) {
      alert('Please enter report code');
      return;
    }

    setLoading(true);
    try {
      // Just verify if the report exists, then navigate
      await api.get(`/patient-reports/${reportCode}`);
      navigate(`/report/${reportCode}`);
    } catch (err) {
      console.error('Report lookup error', err);
      alert('Report not found. Please check the code.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="text-center py-8 px-4">
        <div className="flex items-center justify-center mb-4">
          <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
            <Shield className="w-6 h-6 text-white" />
          </div>
        </div>
        <Link to="/" className="inline-block text-h1 font-bold text-text-primary mb-2 hover:text-primary transition-colors">
          NidanPro
        </Link>
        <p className="text-text-secondary">Digitize. Optimize. Deliver.</p>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-4 pb-8">
        <div className="max-w-md mx-auto space-y-6">

          {/* OTP Login Section */}
          <div className="card p-6">
            <div className="flex items-center mb-4">
              <Phone className="w-5 h-5 text-primary mr-2" />
              <h2 className="text-h3 font-semibold">Login with Phone</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Phone Number</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter your phone number"
                  className="input-field"
                  disabled={otpSent}
                />
              </div>

              {!otpSent ? (
                <button
                  onClick={handleSendOTP}
                  disabled={loading}
                  className="btn-primary w-full"
                >
                  {loading ? 'Sending...' : 'Send OTP'}
                </button>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Enter OTP</label>
                    <input
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="Enter 6-digit OTP"
                      className="input-field"
                      maxLength={6}
                    />
                  </div>
                  <button
                    onClick={handleVerifyOTP}
                    disabled={loading}
                    className="btn-primary w-full"
                  >
                    {loading ? 'Verifying...' : 'Verify & Login'}
                  </button>
                  <button
                    onClick={() => {
                      setOtpSent(false);
                      setOtp('');
                    }}
                    className="text-primary text-sm w-full text-center"
                  >
                    Change Phone Number
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Divider */}
          <div className="flex items-center">
            <div className="flex-1 border-t border-border"></div>
            <span className="px-4 text-text-secondary text-sm">OR</span>
            <div className="flex-1 border-t border-border"></div>
          </div>

          {/* Report Code Section */}
          <div className="card p-6">
            <div className="flex items-center mb-4">
              <FileText className="w-5 h-5 text-secondary mr-2" />
              <h2 className="text-h3 font-semibold">View Report Directly</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Report Code</label>
                <input
                  type="text"
                  value={reportCode}
                  onChange={(e) => setReportCode(e.target.value.toUpperCase())}
                  placeholder="Enter report code"
                  className="input-field"
                />
              </div>
              <button
                onClick={handleReportCode}
                disabled={loading}
                className="btn-secondary w-full"
              >
                {loading ? 'Loading...' : 'View Report'}
              </button>
            </div>
          </div>

          {/* Help Text */}
          <div className="text-center text-text-secondary text-sm">
            <p>Need help? Contact your lab for assistance.</p>
          </div>
        </div>
      </div>
    </div>
  );
}