import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { FileText, Video, File, Download } from 'lucide-react';

const StudyMaterials = () => {
  const { themeColor, textColor } = useOutletContext<any>();
  const [materials, setMaterials] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5001/api/dashboard/materials', {
      headers: { 'x-auth-token': localStorage.getItem('token') || '' }
    })
      .then(res => res.json())
      .then(data => {
        const fallback = [
          { _id: 's1', title: 'Physics Mechanics Concepts', type: 'PDF', subject: 'Physics', url: '#' },
          { _id: 's2', title: 'Calculus Basics', type: 'Video', subject: 'Mathematics', url: '#' },
          { _id: 's3', title: 'Organic Chemistry Notes', type: 'PDF', subject: 'Chemistry', url: '#' }
        ];
        setMaterials(data && data.length > 0 ? data : fallback);
      })
      .catch(err => console.error(err));
  }, []);

  const getIcon = (type: string) => {
    if (type === 'PDF') return <FileText className={`w-8 h-8 ${textColor}`} />;
    if (type === 'Video') return <Video className={`w-8 h-8 ${textColor}`} />;
    return <File className={`w-8 h-8 ${textColor}`} />;
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Study Materials</h2>
        <div className="flex space-x-2">
          <select className="border border-gray-300 rounded-lg px-4 py-2 text-sm bg-white outline-none">
            <option>All Subjects</option>
            <option>Mathematics</option>
            <option>Physics</option>
            <option>Chemistry</option>
            <option>Biology</option>
            <option>Civics</option>
          </select>
        </div>
      </div>

      {materials.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-gray-200">
          <p className="text-gray-500 font-medium">No materials available yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {materials.map((mat: any) => (
            <div key={mat._id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl ${themeColor} bg-opacity-10`}>
                  {getIcon(mat.type)}
                </div>
                <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded">{mat.type}</span>
              </div>
              <h3 className="font-bold text-gray-900 text-lg mb-1">{mat.title}</h3>
              <p className="text-sm text-gray-500 mb-4 h-10 overflow-hidden">{mat.description}</p>
              
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                <span className="text-xs font-semibold text-gray-400">{mat.subject}</span>
                <a href={mat.url} target="_blank" rel="noreferrer" className={`flex items-center text-sm font-bold ${textColor} hover:underline`}>
                  View <Download className="w-4 h-4 ml-1" />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudyMaterials;
