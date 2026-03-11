import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';

export default function Signup() {
  const [formData, setFormData] = useState({ email: '', password: '', username: '' });
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/signup/', formData);
      alert("Account created! Please login.");
      navigate('/login');
    } catch (err) {
      alert("Signup failed. User might already exist.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-xl">
        <h2 className="text-3xl font-bold text-center text-green-600 mb-6">Create Account</h2>
        <form className="space-y-4" onSubmit={handleSignup}>
          <input type="text" placeholder="Username" className="w-full p-3 border rounded-lg outline-none" 
            onChange={(e) => setFormData({...formData, username: e.target.value})} required />
          <input type="email" placeholder="Email" className="w-full p-3 border rounded-lg outline-none" 
            onChange={(e) => setFormData({...formData, email: e.target.value})} required />
          <input type="password" placeholder="Password" className="w-full p-3 border rounded-lg outline-none" 
            onChange={(e) => setFormData({...formData, password: e.target.value})} required />
          <button className="w-full py-3 text-white bg-green-600 rounded-lg font-bold hover:bg-green-700 transition">Register</button>
        </form>
        <p className="mt-4 text-center text-sm">Already have an account? <Link to="/login" className="text-green-600 font-bold underline">Login</Link></p>
      </div>
    </div>
  );
}

