import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginWithEmailAndPassword, signInWithGoogle } from '../firebase/auth';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await loginWithEmailAndPassword(formData.email, formData.password);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);

    try {
      await signInWithGoogle();
      navigate('/');
    } catch (err) {
      setError(err.message || 'Failed to sign in with Google');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`flex items-center justify-center min-h-screen p-4 bg-gray-50 dark:bg-gray-900`}>
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white">Login</h2>
        {error && <div className="p-2 mb-4 text-red-600 bg-red-200 rounded">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="mb-4">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            />
          </div>
          <button 
            type="submit" 
            className="w-full p-2 text-white bg-blue-500 rounded hover:bg-blue-600"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <button 
          onClick={handleGoogleSignIn} 
          className="w-full p-2 mt-4 text-gray-800 border border-gray-300 rounded hover:bg-gray-100"
          disabled={loading}
        >
          Sign in with Google
        </button>
        <div className="mt-4 text-center">
          <Link to="/forgot-password" className="text-blue-500">Forgot Password?</Link>
          <p className="mt-2">
            Don&apos;t have an account? <Link to="/signup" className="text-blue-500">Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
