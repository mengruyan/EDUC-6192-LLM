import React, { useState } from 'react';

interface LoginViewProps {
  onLogin: (email: string, password: string) => void;
  onSwitchToSignUp: () => void;
  error?: string;
}

const LoginView: React.FC<LoginViewProps> = ({ onLogin, onSwitchToSignUp, error }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(email, password);
  };

  const setDemoCredentials = (email: string) => {
    setEmail(email);
    setPassword('password123');
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center font-sans p-4">
        <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-indigo-600">
                中华文化 | AI Grader
            </h1>
            <p className="text-slate-600 mt-2">Automated grading assistant for Chinese Culture assignments.</p>
        </div>
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Login</h2>
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="••••••••"
            />
          </div>
          
          {error && <p className="text-sm text-red-600 text-center">{error}</p>}

          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Sign in
            </button>
          </div>
        </form>
        <div className="mt-6 border-t pt-4">
            <p className="text-sm text-center text-gray-500">For demonstration purposes:</p>
            <div className="mt-2 flex justify-center gap-2">
                <button onClick={() => setDemoCredentials('teacher@school.edu')} className="text-xs text-indigo-600 hover:underline">Login as Teacher</button>
                <span className="text-gray-300">|</span>
                <button onClick={() => setDemoCredentials('li.wei@school.edu')} className="text-xs text-indigo-600 hover:underline">Login as Student</button>
            </div>
        </div>
         <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
                Don't have an account?{' '}
                <button onClick={onSwitchToSignUp} className="font-medium text-indigo-600 hover:text-indigo-500">
                    Sign up
                </button>
            </p>
        </div>
      </div>
    </div>
  );
};

export default LoginView;