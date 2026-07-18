import React, { useState, useEffect } from 'react';
import { Star, Send, UserCheck, BookOpen, MessageCircle, AlertCircle, CheckCircle2 } from 'lucide-react';

const TeacherFeedbackForm = () => {
  const [teachers, setTeachers] = useState<any[]>([]);
  const [selectedTeacher, setSelectedTeacher] = useState<string>('');
  const [learningRating, setLearningRating] = useState<number>(0);
  const [classesRating, setClassesRating] = useState<number>(0);
  const [doubtsRating, setDoubtsRating] = useState<number>(0);
  const [comments, setComments] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      const res = await fetch('/api/teacher-feedback/teachers', {
        headers: { 'x-auth-token': localStorage.getItem('token') || '' }
      });
      if (res.ok) {
        setTeachers(await res.json());
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTeacher || !learningRating || !classesRating || !doubtsRating) {
      setError('Please provide ratings for all criteria');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/teacher-feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': localStorage.getItem('token') || ''
        },
        body: JSON.stringify({
          teacherId: selectedTeacher,
          learningRating,
          classesRating,
          doubtsRating,
          comments
        })
      });

      if (res.ok) {
        setSuccess(true);
        setSelectedTeacher('');
        setLearningRating(0);
        setClassesRating(0);
        setDoubtsRating(0);
        setComments('');
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError('Failed to submit feedback');
      }
    } catch (err) {
      setError('Server error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const RatingStars = ({ value, onChange, label, icon: Icon }: any) => (
    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 mb-4">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-indigo-600">
          <Icon className="w-5 h-5" />
        </div>
        <h4 className="font-bold text-slate-800 text-lg">{label}</h4>
      </div>
      <div className="flex items-center gap-2 pl-13">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            className={`p-2 rounded-xl transition-all ${
              value >= star ? 'text-amber-400 scale-110' : 'text-slate-300 hover:text-amber-200 hover:scale-105'
            }`}
          >
            <Star className={`w-8 h-8 ${value >= star ? 'fill-current' : ''}`} />
          </button>
        ))}
        <span className="ml-4 font-bold text-slate-500">
          {value === 0 ? 'Not rated' : `${value} / 5`}
        </span>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-8 text-white shadow-lg">
        <h2 className="text-3xl font-black mb-2">Teacher Feedback</h2>
        <p className="text-indigo-100 font-medium text-lg">Your feedback helps us maintain the highest quality of education. Please rate your teachers honestly.</p>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-8">
          {success && (
            <div className="mb-6 bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl flex items-center gap-3 font-semibold">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              Thank you! Your feedback has been submitted successfully and sent to the HOD.
            </div>
          )}

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-800 p-4 rounded-xl flex items-center gap-3 font-semibold">
              <AlertCircle className="w-5 h-5 text-red-600" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-wide">Select Teacher</label>
              <select
                value={selectedTeacher}
                onChange={(e) => setSelectedTeacher(e.target.value)}
                className="w-full border-2 border-slate-200 rounded-2xl p-4 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 text-lg font-semibold text-slate-700 bg-slate-50 transition-all"
              >
                <option value="">-- Choose a faculty member --</option>
                {teachers.map(t => (
                  <option key={t.id} value={t.id}>{t.fullName} {t.designation ? `(${t.designation})` : ''}</option>
                ))}
              </select>
            </div>

            <div className="pt-4">
              <label className="block text-sm font-bold text-slate-700 mb-4 uppercase tracking-wide">Detailed Ratings</label>
              
              <RatingStars 
                value={learningRating} 
                onChange={setLearningRating} 
                label="Overall Learning Experience" 
                icon={BookOpen} 
              />
              
              <RatingStars 
                value={classesRating} 
                onChange={setClassesRating} 
                label="Classroom Teaching & Engagement" 
                icon={UserCheck} 
              />
              
              <RatingStars 
                value={doubtsRating} 
                onChange={setDoubtsRating} 
                label="Doubt Solving & Availability" 
                icon={MessageCircle} 
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-wide">Additional Comments (Optional)</label>
              <textarea
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                rows={4}
                className="w-full border-2 border-slate-200 rounded-2xl p-4 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 text-slate-700 bg-slate-50 transition-all"
                placeholder="Share any specific feedback, suggestions, or appreciation..."
              />
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-xl font-bold flex items-center shadow-lg shadow-indigo-500/30 transition-all hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0"
              >
                {isSubmitting ? 'Submitting...' : (
                  <>
                    <Send className="w-5 h-5 mr-2" />
                    Submit Feedback
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TeacherFeedbackForm;
