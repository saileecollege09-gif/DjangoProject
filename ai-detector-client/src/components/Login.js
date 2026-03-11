import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/api/login/', { email, password });
      localStorage.setItem('token', res.data.access); // Assuming JWT response
      navigate('/dashboard');
    } catch (err) {
      alert("Login Failed: Check your credentials");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-xl">
        <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">VeriAI Login</h2>
        <form className="space-y-4" onSubmit={handleLogin}>
          <input type="email" placeholder="Email" className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none" 
            onChange={(e) => setEmail(e.target.value)} required />
          <input type="password" placeholder="Password" className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none" 
            onChange={(e) => setPassword(e.target.value)} required />
          <button className="w-full py-3 text-white bg-blue-600 rounded-lg font-bold hover:bg-blue-700 transition">Enter Dashboard</button>
        </form>
        <p className="mt-4 text-center text-sm">New here? <Link to="/signup" className="text-blue-600 font-bold underline">Sign Up</Link></p>
      </div>
    </div>
  );
}

