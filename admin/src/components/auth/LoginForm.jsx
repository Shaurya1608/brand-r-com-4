"use client";
import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import Cookies from 'js-cookie';

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/dashboard';

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        // Use js-cookie to store token, it is a common industry standard for SPAs
        Cookies.set('admin_token', data.token, { expires: 30, secure: true, sameSite: 'strict' });
        
        // Redirect to originally requested page (or dashboard as default)
        router.push(redirectTo);
      } else {
        setError(data.message || 'Invalid email or password');
      }
    } catch (err) {
      setError('Failed to connect to the server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-6 lg:p-8 bg-white min-h-screen relative">
      <div className="w-full max-w-[360px]">
        <div className="text-center mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-1.5">Sign In to Admin Portal</h2>
          <p className="text-[13px] text-gray-500">Welcome back! Please enter your details.</p>
        </div>

        <div className="flex gap-3 mb-6">
          <button className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg border border-gray-200 bg-gray-50 hover:bg-gray-100 text-gray-700 text-[13px] font-medium transition-colors">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Google
          </button>
          <button className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg border border-gray-200 bg-gray-50 hover:bg-gray-100 text-gray-700 text-[13px] font-medium transition-colors">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-gray-700">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.379.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.416 22 12c0-5.523-4.477-10-10-10z" />
            </svg>
            Github
          </button>
        </div>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-[11px]">
            <span className="bg-white px-3 text-gray-400">Or log in with email</span>
          </div>
        </div>

        <form className="space-y-4" onSubmit={handleLogin}>
          {error && (
            <div className="p-3 rounded-lg bg-red-50 text-red-600 text-[12px] border border-red-100 text-center">
              {error}
            </div>
          )}
          
          <div className="space-y-1.5">
            <label className="text-[11px] font-medium text-gray-700">Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@brandrcomm.com" 
              className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-[13px] text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400 transition-all shadow-sm" 
            />
          </div>

          <div className="space-y-1.5 mb-1">
            <label className="text-[11px] font-medium text-gray-700">Password</label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password" 
                className="w-full bg-white border border-gray-200 rounded-lg pl-3 pr-10 py-2 text-[13px] text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400 transition-all shadow-sm" 
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? <Eye size={16} /> : <EyeOff size={16} />}
              </button>
            </div>
            <div className="flex justify-end mt-1.5">
              <a href="#" className="text-[10px] text-[#6a9a38] hover:underline font-medium">Forgot password?</a>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className={`w-full bg-[#1a1a1a] hover:bg-black text-white font-semibold rounded-lg py-2.5 mt-5 text-[13px] transition-colors shadow-sm ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </form>

        <p className="text-center text-[11px] text-gray-500 mt-8">
          Don't have access? <a href="#" className="text-[#6a9a38] hover:underline font-medium">Contact Super Admin</a>
        </p>
      </div>
    </div>
  );
}
