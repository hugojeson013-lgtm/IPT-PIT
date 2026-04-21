import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Profile() {
  const [profileData, setProfileData] = useState({
    username: '',
    email: '',
    profile: {
      first_name: '',
      middle_name: '',
      last_name: '',
      section: '',
      school_year: ''
    }
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const token = localStorage.getItem('auth');
  const headers = { Authorization: `Token ${token}` };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get('http://127.0.0.1:8000/api/profile/', { headers });
        // Handle case where profile might be null in DB
        setProfileData({
            ...res.data,
            profile: res.data.profile || {
                first_name: '',
                middle_name: '',
                last_name: '',
                section: '',
                school_year: ''
            }
        });
        setLoading(false);
      } catch (err) {
        console.error("Error fetching profile", err);
        setMessage({ text: 'Failed to load profile.', type: 'error' });
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'email') {
      setProfileData({ ...profileData, email: value });
    } else {
      setProfileData({
        ...profileData,
        profile: { ...profileData.profile, [name]: value }
      });
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ text: '', type: '' });

    try {
      const res = await axios.put('http://127.0.0.1:8000/api/profile/', profileData, { headers });
      setProfileData(res.data);
      setMessage({ text: 'Profile updated successfully!', type: 'success' });
    } catch (err) {
      console.error("Error updating profile", err);
      setMessage({ text: 'Failed to update profile.', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const inputStyle = "w-full p-4 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-medium bg-white text-slate-800 transition-shadow hover:shadow-sm";
  const labelStyle = "block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1";

  return (
    <div className="max-w-3xl mx-auto p-6 animate-fade-in">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-white text-2xl font-black shadow-lg">
          {profileData.profile.first_name?.charAt(0) || profileData.username.charAt(0)}
        </div>
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">My Profile</h1>
          <p className="text-slate-500 font-medium">Manage your personal and academic information</p>
        </div>
      </div>

      <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 relative overflow-hidden">
        {/* Decorative background element */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-indigo-50 to-transparent rounded-full -translate-y-1/2 translate-x-1/2 opacity-50 pointer-events-none"></div>
        
        {message.text && (
          <div className={`mb-6 p-4 rounded-xl font-bold text-sm ${message.type === 'success' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-red-50 text-red-600 border border-red-200'} animate-slide-down`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6 relative z-10">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <h2 className="text-sm font-black text-indigo-400 uppercase tracking-widest border-b border-indigo-50 pb-2 mb-4">Account Details</h2>
            </div>
            
            <div>
              <label className={labelStyle}>Username</label>
              <input 
                type="text" 
                value={profileData.username} 
                disabled 
                className={`${inputStyle} bg-slate-50 text-slate-400 cursor-not-allowed`}
              />
              <p className="text-[10px] text-slate-400 mt-1 ml-1 font-semibold">Username cannot be changed.</p>
            </div>

            <div>
              <label className={labelStyle}>Email</label>
              <input 
                type="email" 
                name="email"
                value={profileData.email} 
                onChange={handleChange}
                className={inputStyle}
                placeholder="Enter your email"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
            <div className="md:col-span-3">
              <h2 className="text-sm font-black text-indigo-400 uppercase tracking-widest border-b border-indigo-50 pb-2 mb-4 mt-2">Personal Information</h2>
            </div>

            <div>
              <label className={labelStyle}>First Name</label>
              <input 
                type="text" 
                name="first_name"
                value={profileData.profile.first_name} 
                onChange={handleChange}
                className={inputStyle}
                required
              />
            </div>

            <div>
              <label className={labelStyle}>Middle Name</label>
              <input 
                type="text" 
                name="middle_name"
                value={profileData.profile.middle_name || ''} 
                onChange={handleChange}
                className={inputStyle}
              />
            </div>

            <div>
              <label className={labelStyle}>Last Name</label>
              <input 
                type="text" 
                name="last_name"
                value={profileData.profile.last_name} 
                onChange={handleChange}
                className={inputStyle}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
            <div className="md:col-span-2">
              <h2 className="text-sm font-black text-indigo-400 uppercase tracking-widest border-b border-indigo-50 pb-2 mb-4 mt-2">Academic Details</h2>
            </div>

            <div>
              <label className={labelStyle}>Section</label>
              <input 
                type="text" 
                name="section"
                value={profileData.profile.section} 
                onChange={handleChange}
                className={inputStyle}
                required
              />
            </div>

            <div>
              <label className={labelStyle}>School Year</label>
              <input 
                type="text" 
                name="school_year"
                value={profileData.profile.school_year} 
                onChange={handleChange}
                className={inputStyle}
                required
              />
            </div>
          </div>

          <div className="pt-8">
            <button 
              type="submit" 
              disabled={saving}
              className={`w-full md:w-auto md:min-w-[200px] bg-indigo-600 hover:bg-indigo-700 text-white font-black py-4 px-8 rounded-xl shadow-lg shadow-indigo-200 transition-all ${saving ? 'opacity-70 cursor-wait' : 'hover:-translate-y-1'}`}
            >
              {saving ? 'SAVING CHANGES...' : 'SAVE CHANGES'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
