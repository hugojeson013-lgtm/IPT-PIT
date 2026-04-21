import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

export default function Register() {
  const [formData, setFormData] = useState({
    username: '', password: '', email: '',
    first_name: '', middle_name: '', last_name: '',
    section: '', start_year: '2025', end_year: '2026'
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    // ✅ VALIDATION (BLOCK N/A + EMPTY)
    if (!formData.section.trim() || formData.section.toLowerCase() === "n/a") {
      setError("Section cannot be empty or 'N/A'");
      return;
    }

    if (!formData.email.includes('@')) {
      setError("Please enter a valid email address containing '@'.");
      return;
    }

    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(formData.password)) {
      setError("Password must be at least 8 characters and contain both letters and numbers.");
      return;
    }

    const payload = {
      ...formData,
      school_year: `${formData.start_year}-${formData.end_year}`
    };

    try {
      await axios.post('http://127.0.0.1:8000/api/register/', payload);
      alert("Registration successful! Please login.");
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed. Please try again.");
    }
  };

  const inputStyle = "w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition";
  const labelStyle = "block text-sm font-semibold text-slate-700 mb-2";

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4 py-12">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight uppercase">Create Account</h1>
          <p className="text-slate-500 mt-2">Join the examination portal as a student</p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg text-center font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-6">

          {/* ACCOUNT */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <h2 className="text-xs font-black uppercase text-indigo-600 tracking-widest border-b pb-2 mb-4">Account Security</h2>
            </div>

            <input type="text" required className={inputStyle}
              placeholder="Username"
              onChange={(e) => setFormData({...formData, username: e.target.value})} />

            <input type="email" required className={inputStyle}
              placeholder="Email"
              onChange={(e) => setFormData({...formData, email: e.target.value})} />
          </div>

          {/* PERSONAL */}
          <div className="grid grid-cols-3 gap-4">
            <input type="text" required className={inputStyle}
              placeholder="First Name"
              onChange={(e) => setFormData({...formData, first_name: e.target.value})} />

            <input type="text" required className={inputStyle}
              placeholder="Middle Name"
              onChange={(e) => setFormData({...formData, middle_name: e.target.value})} />

            <input type="text" required className={inputStyle}
              placeholder="Last Name"
              onChange={(e) => setFormData({...formData, last_name: e.target.value})} />
          </div>

          {/* ACADEMIC */}
          <div className="grid grid-cols-2 gap-6">
            <input type="text" required className={inputStyle}
              placeholder="Section (e.g. BSIT-4A)"
              onChange={(e) => setFormData({...formData, section: e.target.value})} />

            <div className="flex gap-2 items-center bg-white border border-slate-300 rounded-lg focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500 transition px-2">
              <select className="w-full py-3 bg-transparent outline-none cursor-pointer" value={formData.start_year} onChange={(e) => setFormData({...formData, start_year: e.target.value})}>
                {Array.from({length: 15}, (_, i) => 2020 + i).map(y => <option key={y} value={y}>{y}</option>)}
              </select>
              <span className="text-slate-400 font-bold">-</span>
              <select className="w-full py-3 bg-transparent outline-none cursor-pointer" value={formData.end_year} onChange={(e) => setFormData({...formData, end_year: e.target.value})}>
                {Array.from({length: 15}, (_, i) => 2020 + i).map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
          </div>

          {/* PASSWORD */}
          <div>
            <input type="password" required className={inputStyle}
              placeholder="Password"
              onChange={(e) => setFormData({...formData, password: e.target.value})} />
            <p className="text-[11px] text-slate-500 mt-1 ml-1 font-semibold">Min. 8 characters, must contain letters and numbers.</p>
          </div>

          <button className="w-full bg-indigo-600 text-white py-3 rounded-lg">
            Register
          </button>
        </form>
      </div>
    </div>
  );
}