import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOtp] = useState('');
  
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '' });
  const [error, setError] = useState('');
  
  const { login, register, verifyOTP } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // 1. LOGIN
    if (isLogin) {
      const res = await login(formData.email, formData.password);
      if (res.success) {
        navigate('/');
        window.location.reload();
      } else {
        setError(res.message);
      }
    } 
    // 2. REGISTER (Send OTP)
    else if (!showOTP) {
      const res = await register(formData.name, formData.email, formData.phone, formData.password);
      if (res.success) {
        setShowOTP(true);
        alert("OTP sent to your email!");
      } else {
        setError(res.message);
      }
    }
    // 3. VERIFY OTP
    else {
      const res = await verifyOTP(formData.email, otp);
      if (res.success) {
        alert("Welcome to Parosa!");
        navigate('/');
        window.location.reload();
      } else {
        setError(res.message);
      }
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 bg-parosa-bg flex items-center justify-center">
      <div className="bg-white p-8 md:p-12 shadow-sm border border-gray-100 max-w-md w-full">
        
        <div className="text-center mb-10">
          <h1 className="text-2xl font-serif text-parosa-dark mb-2">
            {showOTP ? 'Verify Email' : (isLogin ? 'Welcome Back' : 'Create Account')}
          </h1>
          <p className="text-xs text-gray-400 uppercase tracking-widest">
            {showOTP ? `Code sent to ${formData.email}` : (isLogin ? 'Login to continue' : 'Join the Parosa Family')}
          </p>
        </div>

        {error && <div className="bg-red-50 text-red-600 text-xs p-3 mb-6 text-center">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {showOTP ? (
             /* OTP VIEW */
             <div>
               <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">Enter OTP</label>
               <input 
                 type="text" 
                 className="w-full border-b border-gray-200 py-2 text-center text-2xl tracking-[0.5em] font-bold text-parosa-dark focus:outline-none"
                 placeholder="XXXXXX"
                 value={otp}
                 onChange={(e) => setOtp(e.target.value)}
                 maxLength={6}
                 required
               />
             </div>
          ) : (
            /* NORMAL FORM VIEW */
            <>
              {!isLogin && (
                <>
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">Full Name</label>
                    <input type="text" name="name" className="w-full border-b border-gray-200 py-2 focus:outline-none" onChange={handleChange} required />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">Phone Number</label>
                    <input type="tel" name="phone" className="w-full border-b border-gray-200 py-2 focus:outline-none" placeholder="+91..." onChange={handleChange} required />
                  </div>
                </>
              )}

              <div>
                <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">Email Address</label>
                <input type="email" name="email" className="w-full border-b border-gray-200 py-2 focus:outline-none" onChange={handleChange} required />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">Password</label>
                <input type="password" name="password" className="w-full border-b border-gray-200 py-2 focus:outline-none" onChange={handleChange} required />
              </div>
            </>
          )}

          <button className="w-full bg-parosa-dark text-white py-4 text-xs uppercase tracking-[0.2em] font-bold hover:bg-parosa-accent transition-colors mt-4">
            {showOTP ? 'Verify & Login' : (isLogin ? 'Sign In' : 'Get OTP')}
          </button>
        </form>

        {!showOTP ? (
          <div className="mt-8 text-center">
            <button onClick={() => { setIsLogin(!isLogin); setError(''); }} className="text-xs text-gray-500 hover:text-parosa-dark underline">
              {isLogin ? "Don't have an account? Create one" : "Already have an account? Sign In"}
            </button>
          </div>
        ) : (
          <div className="mt-8 text-center">
            <button onClick={() => setShowOTP(false)} className="text-xs text-gray-400 hover:text-red-500">Cancel Verification</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;