import { useEffect, useState } from 'react';
import axios from 'axios';

export default function StudentDashboard() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('auth');

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await axios.get('http://127.0.0.1:8000/api/student-results/', {
          headers: { Authorization: `Token ${token}` }
        });
        setResults(res.data);
      } catch (err) {
        console.error("Dashboard Load Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [token]);

  if (loading) return <div className="p-10 text-center">Loading Results...</div>;

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-12 bg-slate-50 min-h-screen">
      <header>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">My Results</h1>
        <p className="text-slate-500 font-medium">Track your performance and completed modules.</p>
      </header>

      <section>
        <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Performance History</h2>
        <div className="grid gap-4">
          {results.length === 0 ? (
            <p className="text-slate-300 italic text-sm">No exam attempts recorded yet.</p>
          ) : (
            results.map(res => {
              const percentage = (res.score / res.total_questions) * 100;
              const threshold = res.pass_mark || 50;
              const isPassed = percentage >= threshold;

              return (
                <div key={res.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h4 className="font-bold text-slate-800 text-lg">{res.exam_title}</h4>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">{res.date}</p>
                    </div>
                    <div className="text-right">
                      <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter ${
                        isPassed ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                      }`}>
                        {isPassed ? 'MODULE COMPLETED' : 'RETAKE REQUIRED'}
                      </span>
                      <p className="text-sm font-black text-slate-700 mt-2">{res.score} / {res.total_questions} Points</p>
                    </div>
                  </div>

                  <div className="relative w-full bg-slate-100 h-4 rounded-full overflow-hidden border border-slate-50">
                    <div 
                      className={`h-full transition-all duration-1000 ease-out ${isPassed ? 'bg-green-500' : 'bg-red-500'}`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  
                  <div className="flex justify-between mt-2">
                    <span className="text-[10px] text-slate-400 font-black">ACHIEVED: {percentage.toFixed(0)}%</span>
                    <span className="text-[10px] text-indigo-500 font-black uppercase italic">REQUIRED: {threshold}%</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>
    </div>
  );
}