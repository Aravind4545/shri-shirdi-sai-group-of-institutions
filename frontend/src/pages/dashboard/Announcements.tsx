import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Bell, AlertCircle } from 'lucide-react';

const Announcements = () => {
  const { themeColor } = useOutletContext<any>();
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    fetch('/api/dashboard/announcements', {
      headers: { 'x-auth-token': localStorage.getItem('token') || '' }
    })
      .then(res => res.json())
      .then(data => {
        const fallback = [
          { _id: 'a1', title: 'Upcoming Parent-Teacher Meeting', content: 'PTM is scheduled for next Saturday.', date: new Date().toISOString() },
          { _id: 'a2', title: 'Holiday Notice', content: 'School will remain closed on Monday due to public holiday.', date: new Date().toISOString() }
        ];
        setAnnouncements(data && data.length > 0 ? data : fallback);
      })
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-8 flex items-center">
        <Bell className="w-6 h-6 mr-2" /> Institution Announcements
      </h2>

      {announcements.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-gray-200">
          <p className="text-gray-500 font-medium">No new announcements.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {announcements.map((ann: any) => (
            <div key={ann._id} className={`bg-white p-6 rounded-2xl shadow-sm border-l-4 ${ann.priority === 'High' ? 'border-red-500' : `border-${themeColor.split('-')[1]}-500`}`}>
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-lg text-gray-900 flex items-center">
                  {ann.priority === 'High' && <AlertCircle className="w-5 h-5 text-red-500 mr-2" />}
                  {ann.title}
                </h3>
                <span className="text-xs font-semibold text-gray-400">{new Date(ann.date).toLocaleDateString()}</span>
              </div>
              <p className="text-gray-600 leading-relaxed">{ann.content}</p>
              <div className="mt-4 flex gap-2">
                <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-bold">{ann.targetProgram}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Announcements;
