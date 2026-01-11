import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext'; // Import the Context Hook
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; 
// We still need axios for WhatsApp OTP (since that's not in AuthContext yet), 
// but we will use the BASE_URL from context or hardcode it for now.
const BASE_URL = "https://parosa-755646660410.asia-south2.run.app/api";

const Login = () => {
  const [authMethod, setAuthMethod] = useState('phone'); 
  const [isRegistering, setIsRegistering] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOtp] = useState('');
  
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '' });
  const [error, setError] = useState('');
  
  // ✅ USE FUNCTIONS FROM CONTEXT
  const { login, register, verifyOTP, user } = useAuth(); 
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  // ==========================================
  // 1. WHATSAPP HANDLERS (Keep Axios here or move to Context)
  // ==========================================
  const sendWhatsAppOtp = async () => {
    try {
      const res = await axios.post(`${BASE_URL}/auth/send-mobile-otp`, { phone: formData.phone });
      if(res.data.success) {
         setShowOTP(true);
         alert("OTP sent to WhatsApp!");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP");
    }
  };

  const verifyWhatsAppOtp = async () => {
    try {
      // Note: If you want this user to be stored in Global Context, 
      // you should essentially create a 'verifyMobileOTP' in AuthContext too.
      // For now, we manually set it if the backend returns the same structure.
      const res = await axios.post(`${BASE_URL}/auth/verify-mobile-otp`, { phone: formData.phone, otp, ...formData });
      
      if(res.data.success) {
        // Since verifyMobileOTP isn't in context yet, we might need to reload 
        // or manually setLocalStorage to sync with AuthProvider on refresh.
        localStorage.setItem("parosa_user", JSON.stringify(res.data.user));
        localStorage.setItem("parosa_token", res.data.token);
        window.location.href = "/"; // Force reload to pick up auth state
      }
    } catch (err) {
      setError("Invalid OTP");
    }
  };

  // ==========================================
  // 2. EMAIL HANDLERS (Updated to use Context)
  // ==========================================
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // CASE A: REGISTER (Send OTP)
    if (isRegistering) {
       const result = await register(formData.name, formData.email, formData.phone, formData.password);
       if (result.success) {
          setShowOTP(true); // Show OTP input
       } else {
          setError(result.message);
       }
    } 
    // CASE B: LOGIN (Direct Email/Pass)
    else {
       const result = await login(formData.email, formData.password);
       if (result.success) {
         navigate('/');
       } else {
         setError(result.message);
       }
    }
  };

  // ✅ CORRECTED: Use Context verifyOTP
  const handleVerifyEmailOtp = async () => {
    const result = await verifyOTP(formData.email, otp);
    if (result.success) {
      navigate('/');
    } else {
      setError(result.message);
    }
  };

  // ==========================================
  // UI RENDER
  // ==========================================
  return (
    <div className="min-h-screen pt-24 pb-12 px-4 bg-parosa-bg flex items-center justify-center">
      <div className="bg-white p-8 md:p-12 shadow-sm border border-gray-100 max-w-md w-full rounded-xl">
        
        <div className="text-center mb-8">
          <h1 className="text-2xl font-serif text-parosa-dark mb-2">Welcome to Parosa</h1>
        </div>

        {/* TABS */}
        <div className="flex border-b mb-8">
          <button 
            onClick={() => { setAuthMethod('phone'); setShowOTP(false); setError(''); }}
            className={`flex-1 pb-3 text-xs font-bold uppercase tracking-widest transition-colors ${authMethod === 'phone' ? 'border-b-2 border-green-600 text-green-700' : 'text-gray-400'}`}
          >
            WhatsApp
          </button>
          <button 
            onClick={() => { setAuthMethod('email'); setShowOTP(false); setError(''); }}
            className={`flex-1 pb-3 text-xs font-bold uppercase tracking-widest transition-colors ${authMethod === 'email' ? 'border-b-2 border-parosa-dark text-parosa-dark' : 'text-gray-400'}`}
          >
            Email
          </button>
        </div>

        {error && <div className="bg-red-50 text-red-600 text-xs p-3 mb-6 text-center rounded">{error}</div>}

        {/* --- PHONE AUTH FORM --- */}
        {authMethod === 'phone' && (
          <div className="space-y-6">
            {!showOTP ? (
              <>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">Mobile Number</label>
                  <input 
                    type="tel" name="phone" 
                    className="w-full border-b border-gray-200 py-3 text-lg focus:outline-none focus:border-green-500" 
                    placeholder="9876543210" 
                    onChange={handleChange} 
                  />
                </div>
                <button onClick={sendWhatsAppOtp} className="w-full bg-green-700 text-white py-4 text-xs uppercase tracking-[0.2em] font-bold hover:bg-green-800 transition-colors">
                  Get WhatsApp OTP
                </button>
              </>
            ) : (
              <div className="animate-in fade-in slide-in-from-bottom-4">
                <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">Enter OTP sent to {formData.phone}</label>
                <input 
                  type="text" 
                  className="w-full border-b border-gray-200 py-2 text-center text-3xl tracking-[0.5em] font-bold text-parosa-dark focus:outline-none focus:border-green-500 mb-6"
                  placeholder="XXXXXX"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  maxLength={6}
                />
                <button onClick={verifyWhatsAppOtp} className="w-full bg-parosa-dark text-white py-4 text-xs uppercase tracking-[0.2em] font-bold hover:bg-black transition-colors">
                  Verify & Login
                </button>
                <button onClick={() => setShowOTP(false)} className="w-full mt-4 text-xs text-gray-400 underline">Change Number</button>
              </div>
            )}
          </div>
        )}

        {/* --- EMAIL AUTH FORM --- */}
        {authMethod === 'email' && (
          <div className="space-y-6">
             {!showOTP ? (
                <form onSubmit={handleEmailSubmit} className="space-y-6">
                  {isRegistering && (
                    <div>
                      <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">Name</label>
                      <input type="text" name="name" className="w-full border-b border-gray-200 py-2 focus:outline-none" onChange={handleChange} required />
                    </div>
                  )}
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">Email</label>
                    <input type="email" name="email" className="w-full border-b border-gray-200 py-2 focus:outline-none" onChange={handleChange} required />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">Password</label>
                    <input type="password" name="password" className="w-full border-b border-gray-200 py-2 focus:outline-none" onChange={handleChange} required />
                  </div>

                  <button type="submit" className="w-full bg-parosa-dark text-white py-4 text-xs uppercase tracking-[0.2em] font-bold hover:bg-parosa-accent transition-colors">
                    {isRegistering ? 'Create Account' : 'Sign In'}
                  </button>

                  <div className="text-center mt-4">
                    <button type="button" onClick={() => setIsRegistering(!isRegistering)} className="text-xs text-gray-500 underline">
                      {isRegistering ? "Already have an account? Login" : "New here? Create Account"}
                    </button>
                  </div>
                </form>
             ) : (
                <div className="animate-in fade-in slide-in-from-bottom-4">
                   <div className="text-center mb-4">
                      <span className="text-xs text-green-600 font-bold bg-green-50 px-3 py-1 rounded-full">OTP Sent to Email</span>
                   </div>
                   
                   <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">Enter Email OTP</label>
                   <input 
                     type="text" 
                     className="w-full border-b border-gray-200 py-2 text-center text-3xl tracking-[0.5em] font-bold text-parosa-dark focus:outline-none focus:border-green-500 mb-6"
                     placeholder="XXXXXX"
                     value={otp}
                     onChange={(e) => setOtp(e.target.value)}
                     maxLength={6}
                   />
                   
                   {/* ✅ BUTTON CALLS handleVerifyEmailOtp */}
                   <button onClick={handleVerifyEmailOtp} className="w-full bg-parosa-dark text-white py-4 text-xs uppercase tracking-[0.2em] font-bold hover:bg-black transition-colors">
                     Verify Email
                   </button>
                   
                   <button onClick={() => setShowOTP(false)} className="w-full mt-4 text-xs text-gray-400 underline">
                     Back to details
                   </button>
                </div>
             )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;