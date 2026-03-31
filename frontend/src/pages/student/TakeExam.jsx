import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function TakeExam() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem('auth');

  const [exam, setExam] = useState(null);
  const [answers, setAnswers] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alreadyTaken, setAlreadyTaken] = useState(false);

  const [modal, setModal] = useState({
    show: false,
    passed: false,
    score: 0,
    message: "",
    detail: ""
  });

  // ✅ LOAD EXAM + CHECK ATTEMPT
  useEffect(() => {
    // Load exam
    axios.get(`http://127.0.0.1:8000/api/exams/${id}/`, {
      headers: { Authorization: `Token ${token}` }
    })
    .then(res => setExam(res.data))
    .catch(err => console.error("Could not load exam", err));

    // Check if already taken
    axios.get(`http://127.0.0.1:8000/api/exams/${id}/taken/`, {
      headers: { Authorization: `Token ${token}` }
    })
    .then(res => {
      if (res.data.taken) {
  setAlreadyTaken(true);

  setModal({
    show: true,
    passed: false,
    score: 0,
    message: "ALREADY TAKEN",
    detail: "You have already completed this exam. You can go back to dashboard."
  });
}
    })
    .catch(err => console.error("Error checking attempt", err));

  }, [id, token, navigate]);

  // ✅ HANDLERS
  const handleCheckboxChange = (qId, optId) => {
    const currentSelections = answers[qId] || [];
    const newSelections = currentSelections.includes(optId)
      ? currentSelections.filter(item => item !== optId)
      : [...currentSelections, optId];

    setAnswers({ ...answers, [qId]: newSelections });
  };

  const handleEssayChange = (qId, val) => {
    setAnswers({ ...answers, [qId]: val });
  };

  // ✅ SUBMIT EXAM
  const submitExam = async () => {
    if (alreadyTaken) return;

    if (!exam.questions || Object.keys(answers).length < exam.questions.length) {
      setModal({
        show: true,
        passed: false,
        score: 0,
        message: "INCOMPLETE",
        detail: "Please answer all questions before submitting."
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await axios.post(
        'http://127.0.0.1:8000/api/submit-exam/',
        {
          exam_id: id,
          answers: answers
        },
        {
          headers: { Authorization: `Token ${token}` }
        }
      );

      setModal({
        show: true,
        passed: res.data.is_passed,
        score: res.data.score,
        message: res.data.is_passed ? "CONGRATULATIONS!" : "EFFORT ACKNOWLEDGED",
        detail: res.data.is_passed
          ? "You have successfully cleared this module."
          : "You didn't reach the passing mark this time."
      });

      setAlreadyTaken(true);

    } catch (err) {
      const errorMsg = err.response?.data?.error || "Network Error. Try again.";

      setModal({
        show: true,
        passed: false,
        score: 0,
        message: "ERROR",
        detail: errorMsg
      });

    } finally {
      setIsSubmitting(false);
    }
  };

  if (!exam) {
    return (
      <div className="p-10 text-center font-bold text-slate-500">
        Loading Exam Content...
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-8 min-h-screen">
      <header className="mb-10">
        <h1 className="text-3xl font-black text-slate-900 mb-2 uppercase">
          {exam.title}
        </h1>
        <p className="text-slate-500">{exam.description}</p>
      </header>

      {/* QUESTIONS */}
      <div className="space-y-8 mb-12">
        {exam.questions.map((q, index) => (
          <div key={q.id} className="p-6 bg-white border rounded-3xl shadow-sm">
            <div className="flex justify-between mb-4">
              <span className="text-xs font-bold">
                Question {index + 1}
              </span>
              <span className="text-xs text-indigo-500 font-bold">
                {q.question_type === 'MCQ' ? 'MCQ' : 'ESSAY'}
              </span>
            </div>

            <p className="font-bold mb-4">{q.text}</p>

            {q.question_type === 'MCQ' ? (
              <div className="space-y-2">
                {q.options.map(opt => (
                  <label key={opt.id} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={(answers[q.id] || []).includes(opt.id)}
                      onChange={() => handleCheckboxChange(q.id, opt.id)}
                    />
                    {opt.text}
                  </label>
                ))}
              </div>
            ) : (
              <textarea
                className="w-full border p-3 rounded"
                value={answers[q.id] || ''}
                onChange={(e) => handleEssayChange(q.id, e.target.value)}
              />
            )}
          </div>
        ))}
      </div>

      {/* SUBMIT BUTTON */}
      <button
        onClick={submitExam}
        disabled={isSubmitting || alreadyTaken}
        className={`w-full py-4 rounded-xl font-bold ${
          isSubmitting || alreadyTaken
            ? 'bg-gray-400'
            : 'bg-indigo-600 text-white'
        }`}
      >
        {alreadyTaken
          ? "ALREADY SUBMITTED"
          : isSubmitting
          ? "SUBMITTING..."
          : "SUBMIT EXAM"}
      </button>

      {/* MODAL */}
      {modal.show && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center">
          <div className="bg-white p-8 rounded-xl text-center max-w-sm w-full">
            <h2 className="text-2xl font-bold mb-2">{modal.message}</h2>

            <p className="mb-4">
              {modal.score > 0 && <>Score: {modal.score}<br/></>}
              {modal.detail}
            </p>

            <button
              onClick={() => navigate('/dashboard')}
              className="bg-black text-white px-4 py-2 rounded"
            >
              BACK TO DASHBOARD
            </button>
          </div>
        </div>
      )}
    </div>
  );
}