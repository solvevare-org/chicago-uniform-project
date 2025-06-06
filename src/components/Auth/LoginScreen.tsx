import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../lib/auth';

const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await authService.login(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#121212] text-white">
      <div className="w-full max-w-md p-8 bg-[#1A1A1A] rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              id="email"
              className="w-full px-4 py-2 rounded bg-[#333333] text-white border border-[#444444] focus:outline-none focus:border-green-500"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              id="password"
              className="w-full px-4 py-2 rounded bg-[#333333] text-white border border-[#444444] focus:outline-none focus:border-green-500"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>
          {error && <div className="text-red-400 mb-2">{error}</div>}
          <button
            type="submit"
            className="w-full py-2 bg-green-500 text-black rounded font-medium hover:bg-green-400 transition"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <div className="mt-4 text-sm text-center">
         | <a href="/forgot-password" className="text-green-400 hover:underline">Forgot Password?</a>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;