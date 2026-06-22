import React, { useState, useEffect } from 'react';
import { BookOpen, Video, FileText, Search, Plus, Trash2, ExternalLink, Filter, X } from 'lucide-react';

interface MaterialItem {
  id: string;
  title: string;
  description: string;
  type: 'PDF' | 'Video' | 'Note';
  program: string;
  stream: string;
  subject: string;
  url: string;
  uploadedAt: string;
}

const TeacherStudyMaterials = () => {
  const [materials, setMaterials] = useState<MaterialItem[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [filterProgram, setFilterProgram] = useState('All');
  
  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<'PDF' | 'Video' | 'Note'>('PDF');
  const [program, setProgram] = useState('Lakshya');
  const [stream, setStream] = useState('MPC');
  const [subject, setSubject] = useState('Physics');
  const [url, setUrl] = useState('');

  useEffect(() => {
    // Initial Mock Data
    const initialMaterials: MaterialItem[] = [
      {
        id: '1',
        title: 'JEE Advanced Limits & Continuity notes',
        description: 'Complete formulas, theory notes, and solved questions for limit & continuity.',
        type: 'PDF',
        program: 'Lakshya',
        stream: 'MPC',
        subject: 'Mathematics',
        url: 'https://example.com/math-limits.pdf',
        uploadedAt: '2026-06-15'
      },
      {
        id: '2',
        title: 'Electrostatics Part 1 Lecture Video',
        description: 'Video explanation on Coulomb\'s Law and electric field lines with derivations.',
        type: 'Video',
        program: 'Lakshya',
        stream: 'MPC',
        subject: 'Physics',
        url: 'https://youtube.com/watch?v=mock_physics_1',
        uploadedAt: '2026-06-14'
      },
      {
        id: '3',
        title: 'Organic Chemistry: Nomenclature guide',
        description: 'Basic nomenclature guidelines for alkanes, alkenes, alkynes, and functional groups.',
        type: 'Note',
        program: 'Deekshya',
        stream: 'BiPC',
        subject: 'Chemistry',
        url: 'https://example.com/chem-nomenclature.pdf',
        uploadedAt: '2026-06-12'
      },
      {
        id: '4',
        title: 'UPSC Indian Polity Constitutional Framework',
        description: 'PDF notes covering historical background, drafting of the constitution and salient features.',
        type: 'PDF',
        program: 'DAFNE',
        stream: 'MEC',
        subject: 'Civics',
        url: 'https://example.com/polity-constitutional-framework.pdf',
        uploadedAt: '2026-06-10'
      },
      {
        id: '5',
        title: 'NEET Human Physiology: Digestion & Absorption',
        description: 'Complete hand-written class notes detailing the human digestive system mechanics.',
        type: 'PDF',
        program: 'Deekshya',
        stream: 'BiPC',
        subject: 'Biology',
        url: 'https://example.com/neet-biology-digestion.pdf',
        uploadedAt: '2026-06-08'
      },
      {
        id: '6',
        title: 'Integration by Parts: Tricks & Shortcuts',
        description: 'Video tutorial sharing smart tips and shortcuts for solving integration by parts quickly.',
        type: 'Video',
        program: 'Lakshya',
        stream: 'MPC',
        subject: 'Mathematics',
        url: 'https://youtube.com/watch?v=mock_integration_tricks',
        uploadedAt: '2026-06-05'
      }
    ];
    setMaterials(initialMaterials);
  }, []);

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !subject || !url) return;

    const newMaterial: MaterialItem = {
      id: Date.now().toString(),
      title,
      description,
      type,
      program,
      stream,
      subject,
      url,
      uploadedAt: new Date().toISOString().split('T')[0]
    };

    setMaterials(prev => [newMaterial, ...prev]);
    
    // Clear inputs
    setTitle('');
    setDescription('');
    setUrl('');
    setType('PDF');
    setProgram('Lakshya');
    setStream('MPC');
    setSubject('Physics');
    setShowModal(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this study material?')) {
      setMaterials(prev => prev.filter(m => m.id !== id));
    }
  };

  // Filtered Materials
  const filteredMaterials = materials.filter(m => {
    const matchesSearch = m.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          m.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          m.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'All' || m.type === filterType;
    const matchesProgram = filterProgram === 'All' || m.program === filterProgram;

    return matchesSearch && matchesType && matchesProgram;
  });

  // Stats
  const totalCount = materials.length;
  const pdfCount = materials.filter(m => m.type === 'PDF').length;
  const videoCount = materials.filter(m => m.type === 'Video').length;
  const notesCount = materials.filter(m => m.type === 'Note').length;

  return (
    <div className="space-y-6">
      {/* Upper Banner */}
      <div className="flex justify-between items-center bg-slate-900 text-white p-6 rounded-3xl shadow-sm">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Study Materials Hub</h2>
          <p className="text-slate-400 text-sm mt-1">Upload and manage PDFs, video lectures, and revision notes for your programs.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-3 rounded-xl transition-all shadow-md cursor-pointer"
        >
          <Plus className="w-5 h-5" />
          Upload Material
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-indigo-50 rounded-xl">
            <BookOpen className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Materials</p>
            <h4 className="text-2xl font-black text-slate-800">{totalCount}</h4>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-red-50 rounded-xl">
            <FileText className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">PDF Notes</p>
            <h4 className="text-2xl font-black text-slate-800">{pdfCount}</h4>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 rounded-xl">
            <Video className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Videos Uploaded</p>
            <h4 className="text-2xl font-black text-slate-800">{videoCount}</h4>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-amber-50 rounded-xl">
            <FileText className="w-6 h-6 text-amber-600" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Class Notes</p>
            <h4 className="text-2xl font-black text-slate-800">{notesCount}</h4>
          </div>
        </div>
      </div>

      {/* Filter and List Container */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-6">
        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by title, subject..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm transition-all"
            />
          </div>

          <div className="flex flex-wrap gap-3 w-full md:w-auto items-center">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider">
              <Filter className="w-3.5 h-3.5" /> Filter By:
            </div>
            
            {/* Type Filter */}
            <select
              value={filterType}
              onChange={e => setFilterType(e.target.value)}
              className="px-3 py-2 border border-slate-300 rounded-xl text-xs font-bold text-slate-600 bg-slate-50 focus:outline-none focus:border-emerald-500"
            >
              <option value="All">All Types</option>
              <option value="PDF">PDF</option>
              <option value="Video">Video</option>
              <option value="Note">Note</option>
            </select>

            {/* Program Filter */}
            <select
              value={filterProgram}
              onChange={e => setFilterProgram(e.target.value)}
              className="px-3 py-2 border border-slate-300 rounded-xl text-xs font-bold text-slate-600 bg-slate-50 focus:outline-none focus:border-emerald-500"
            >
              <option value="All">All Programs</option>
              <option value="Lakshya">Lakshya</option>
              <option value="Deekshya">Deekshya</option>
              <option value="DAFNE">DAFNE</option>
            </select>
          </div>
        </div>

        {/* Materials Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-bold text-xs uppercase tracking-wider">
                <th className="py-4 px-4">Material</th>
                <th className="py-4 px-4">Type</th>
                <th className="py-4 px-4">Subject</th>
                <th className="py-4 px-4">Program / Stream</th>
                <th className="py-4 px-4">Uploaded</th>
                <th className="py-4 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredMaterials.length > 0 ? (
                filteredMaterials.map(m => {
                  let badgeColor = 'bg-red-50 text-red-700 border-red-100';
                  let icon = <FileText className="w-3.5 h-3.5" />;
                  if (m.type === 'Video') {
                    badgeColor = 'bg-emerald-50 text-emerald-700 border-emerald-100';
                    icon = <Video className="w-3.5 h-3.5" />;
                  } else if (m.type === 'Note') {
                    badgeColor = 'bg-amber-50 text-amber-700 border-amber-100';
                    icon = <BookOpen className="w-3.5 h-3.5" />;
                  }

                  let progBadge = 'bg-blue-50 text-blue-700 border-blue-100';
                  if (m.program === 'Deekshya') progBadge = 'bg-emerald-50 text-emerald-700 border-emerald-100';
                  if (m.program === 'DAFNE') progBadge = 'bg-amber-50 text-amber-700 border-amber-100';

                  return (
                    <tr key={m.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                      <td className="py-4 px-4">
                        <div>
                          <p className="font-bold text-slate-800 text-sm">{m.title}</p>
                          <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{m.description}</p>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-bold ${badgeColor}`}>
                          {icon}
                          {m.type}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-sm font-semibold text-slate-600">{m.subject}</td>
                      <td className="py-4 px-4">
                        <div className="flex flex-col gap-1">
                          <span className={`inline-block w-max px-2 py-0.5 border rounded-lg text-xxs font-black tracking-wider uppercase ${progBadge}`}>
                            {m.program}
                          </span>
                          <span className="text-xxs font-black tracking-widest text-slate-400 uppercase">{m.stream} Stream</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-xs font-bold text-slate-400">{m.uploadedAt}</td>
                      <td className="py-4 px-4">
                        <div className="flex items-center justify-center gap-3">
                          <a
                            href={m.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg transition-colors cursor-pointer"
                            title="Open Resource URL"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                          <button
                            onClick={() => handleDelete(m.id)}
                            className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg transition-colors cursor-pointer"
                            title="Delete Resource"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400 font-medium italic text-sm">
                    No study materials found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Upload Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-xl overflow-hidden border border-slate-200 flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-emerald-100 text-emerald-700 rounded-xl">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-lg">Upload Study Material</h3>
                  <p className="text-xxs text-slate-400 uppercase tracking-widest font-black">Resource Manager</p>
                </div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-1.5 bg-slate-200 hover:bg-slate-300 text-slate-600 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUpload} className="p-6 space-y-4 overflow-y-auto flex-1">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Material Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. Limits & Derivatives Handout"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-emerald-500 text-sm font-medium transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Brief Description</label>
                <textarea
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Provide a short description of topics covered in this resource..."
                  rows={2}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-emerald-500 text-sm font-medium transition-all resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Resource Type</label>
                  <select
                    value={type}
                    onChange={e => setType(e.target.value as any)}
                    className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-sm font-semibold text-slate-600 bg-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="PDF">PDF File</option>
                    <option value="Video">Video Link</option>
                    <option value="Note">Revision Notes</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Subject</label>
                  <input
                    type="text"
                    required
                    value={subject}
                    onChange={e => setSubject(e.target.value)}
                    placeholder="e.g. Physics"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-emerald-500 text-sm font-medium transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Target Program</label>
                  <select
                    value={program}
                    onChange={e => setProgram(e.target.value)}
                    className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-sm font-semibold text-slate-600 bg-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Lakshya">Lakshya</option>
                    <option value="Deekshya">Deekshya</option>
                    <option value="DAFNE">DAFNE</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Target Stream</label>
                  <select
                    value={stream}
                    onChange={e => setStream(e.target.value)}
                    className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-sm font-semibold text-slate-600 bg-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="MPC">MPC (Engineering)</option>
                    <option value="BiPC">BiPC (Medical)</option>
                    <option value="MEC">MEC (Civics/Com)</option>
                    <option value="CEC">CEC (Civics/Com)</option>
                    <option value="All">All Streams</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Resource Link / URL</label>
                <input
                  type="url"
                  required
                  value={url}
                  onChange={e => setUrl(e.target.value)}
                  placeholder="https://drive.google.com/mock-link"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-emerald-500 text-sm font-medium transition-all"
                />
              </div>

              <button
                type="submit"
                className="w-full mt-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-md cursor-pointer text-sm"
              >
                Upload Resource
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherStudyMaterials;
