import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function ExamList() {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('auth');

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const res = await axios.get('http://127.0.0.1:8000/api/exams/', {
          headers: { Authorization: `Token ${token}` }
        });
        setExams(res.data);
      } catch (err) {
        console.error("Error fetching exams:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchExams();
  }, [token]);

  if (loading) return <div className="p-10 text-center">Loading Exams...</div>;

  return (
    <div className="p-8 max-w-6xl mx-auto bg-slate-50 min-h-screen">
      <header className="mb-10">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Available Exams</h1>
        <p className="text-slate-500 font-medium">Select a module to begin your assessment.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {exams.length === 0 ? (
          <p className="text-slate-400 italic">No exams are currently available.</p>
        ) : (
          exams.map(exam => (
            <div key={exam.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:border-indigo-300 transition-all group">
              <h3 className="font-bold text-lg text-slate-800 group-hover:text-indigo-600 transition-colors">{exam.title}</h3>
              <p className="text-slate-500 text-xs mt-2 line-clamp-2">{exam.description}</p>
              
              <div className="mt-6 pt-4 border-t border-slate-50 flex justify-between items-center">
                <span className="text-[10px] font-black text-indigo-500 uppercase">Pass Mark: {exam.pass_mark}%</span>
                <Link 
                  to={`/take-exam/${exam.id}`} 
                  className="bg-indigo-50 text-indigo-600 px-4 py-2 rounded-xl text-xs font-black hover:bg-indigo-600 hover:text-white transition"
                >
                  START →
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}