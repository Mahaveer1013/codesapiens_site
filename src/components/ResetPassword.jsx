import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';

export default function ResetPassword() {
  const [mode, setMode] = useState('forgotPassword'); // 'forgotPassword'
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [formData, setFormData] = useState({
    email: '',
  });
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(formData.email, {
        redirectTo: `${window.location.origin}/?type=recovery`,
      });
      if (error) throw error;
      setMessage('✅ Password reset link has been sent to your email!');
      setTimeout(() => {
        navigate('/?type=signIn');
      }, 2000);
    } catch (err) {
      setMessage(`❌ ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 sm:px-6 py-8 sm:py-12">
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-xl p-6 sm:p-8">
        <div className="mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
            Reset Password
          </h2>
          <p className="text-sm sm:text-base text-gray-600">
            Enter your email to receive a password reset link
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 absolute left-3 top-2.5 sm:top-3" />
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                disabled={loading}
                className="w-full pl-10 sm:pl-11 pr-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none disabled:opacity-50 text-sm sm:text-base"
                placeholder="admin@example.com"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 sm:py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:transform-none text-sm sm:text-base"
          >
            {loading ? 'Sending…' : 'Send Reset Link'}
          </button>
          <div className="text-center">
            <p className="text-sm sm:text-base text-gray-600">
              Back to{' '}
              <button
                type="button"
                onClick={() => navigate('/?type=signIn')}
                disabled={loading}
                className="text-blue-600 hover:text-blue-700 font-medium disabled:opacity-50"
              >
                Sign In
              </button>
            </p>
          </div>
          {message && (
            <div
              className={`p-2 sm:p-3 rounded-lg text-xs sm:text-sm ${
                message.startsWith('✅')
                  ? 'bg-green-50 text-green-800 border border-green-200'
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}
            >
              {message}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}