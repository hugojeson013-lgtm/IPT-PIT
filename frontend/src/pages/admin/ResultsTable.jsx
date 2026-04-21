import { useEffect, useState } from 'react';
import axios from 'axios';

export default function ResultsTable() {
  const [results, setResults] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [sections, setSections] = useState([]);
  const [years, setYears] = useState([]);
  const [selectedSection, setSelectedSection] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('auth');

  // ✅ Fetch results
  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await axios.get('http://127.0.0.1:8000/api/admin-results/', {
          headers: { Authorization: `Token ${token}` }
        });

        console.log("RESULTS:", res.data); // 🔍 DEBUG

        setResults(res.data);
        setFilteredResults(res.data);
      } catch (err) {
        console.error("Error fetching results", err);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [token]);

  // ✅ Generate dropdown options FROM results (FIXED)
  // ✅ Generate dropdown options (CLEANED)
useEffect(() => {
  if (!results || results.length === 0) return;

  const uniqueSections = [
    ...new Set(
      results
        .map(r => r.section)
        .filter(sec => sec && sec.toLowerCase() !== 'n/a')
    )
  ];

  const uniqueYears = [
    ...new Set(
      results
        .map(r => r.school_year)
        .filter(yr => yr && yr.toLowerCase() !== 'n/a')
    )
  ];

  setSections(uniqueSections);
  setYears(uniqueYears);

}, [results]);

  // ✅ Filter logic
  useEffect(() => {
    if (!results || results.length === 0) return;

    const filtered = results.filter((r) => {
      const matchSection = selectedSection
        ? r.section?.trim() === selectedSection.trim()
        : true;

      const matchYear = selectedYear
        ? r.school_year?.trim() === selectedYear.trim()
        : true;

      return matchSection && matchYear;
    });

    setFilteredResults(filtered);
  }, [selectedSection, selectedYear, results]);

  if (loading) return <div className="p-10 text-center">Loading results...</div>;

  return (
    <div className="p-6 bg-white rounded-xl shadow-sm border border-slate-200 mt-8">
      <h2 className="text-xl font-bold text-slate-800 mb-4">Student Exam Results</h2>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <select
          className="p-2 border rounded"
          value={selectedSection}
          onChange={(e) => setSelectedSection(e.target.value)}
        >
          <option value="">All Sections</option>
          {sections.map((sec) => (
            <option key={sec} value={sec}>{sec}</option>
          ))}
        </select>

        <select
          className="p-2 border rounded"
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
        >
          <option value="">All Years</option>
          {years.map((yr) => (
            <option key={yr} value={yr}>{yr}</option>
          ))}
        </select>
      </div>

      {/* Results Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-center border-collapse border-2 border-black">
          <thead>
            <tr className="text-black text-[17px] font-bold uppercase tracking-wider">
              <th className="border-2 border-black py-4 px-4 text-left">Student</th>
              <th className="border-2 border-black py-4 px-4">Section</th>
              <th className="border-2 border-black py-4 px-4">School Year</th>
              <th className="border-2 border-black py-4 px-4">Exam Title</th>
              <th className="border-2 border-black py-4 px-4 text-center">Score</th>
              <th className="border-2 border-black py-4 px-4 text-center">Status</th>
              <th className="border-2 border-black py-4 px-4">Date Submitted</th>
            </tr>
          </thead>
          <tbody>
            {filteredResults.map((res) => {
              const percentage = (res.score / res.total_questions) * 100;
              const isPassed = percentage >= 50;

              return (
                <tr key={res.id} className="hover:bg-slate-50 transition-colors">
                  <td className="border-2 border-black py-4 px-4 font-medium text-slate-900 text-left">{res.student_name}</td>
                  <td className="border-2 border-black py-4 px-4 text-slate-600">{res.section}</td>
                  <td className="border-2 border-black py-4 px-4 text-slate-600">{res.school_year}</td>
                  <td className="border-2 border-black py-4 px-4 text-slate-600">{res.exam_title}</td>
                  <td className="border-2 border-black py-4 px-4 text-center font-bold text-indigo-600">
                    {res.score} / {res.total_questions}
                  </td>
                  <td className="border-2 border-black py-4 px-4 text-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      isPassed ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {isPassed ? 'PASSED' : 'FAILED'}
                    </span>
                  </td>
                  <td className="border-2 border-black py-4 px-4 text-slate-500 text-sm">{res.date}</td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {filteredResults.length === 0 && (
          <div className="py-10 text-center text-slate-400 italic">
            No exams match the selected filters.
          </div>
        )}
      </div>
    </div>
  );
}