import { useState } from 'react';
import { Settings, Database, MessageSquare, UploadCloud, Activity } from 'lucide-react';

const AIControls = () => {
  const [activeTab, setActiveTab] = useState('settings');

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800 flex items-center"><Settings className="w-6 h-6 mr-2 text-indigo-600" /> AI Control Center</h2>
        <p className="text-slate-500 font-medium text-sm">Manage language models, update the knowledge base, and view system analytics.</p>
      </div>

      <div className="flex border-b border-slate-200 gap-8">
        <button 
          onClick={() => setActiveTab('settings')}
          className={`pb-4 font-bold transition-colors ${activeTab === 'settings' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
        >
          Model Settings
        </button>
        <button 
          onClick={() => setActiveTab('knowledge')}
          className={`pb-4 font-bold transition-colors ${activeTab === 'knowledge' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
        >
          Knowledge Base (RAG)
        </button>
        <button 
          onClick={() => setActiveTab('logs')}
          className={`pb-4 font-bold transition-colors ${activeTab === 'logs' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
        >
          Chat Logs & Moderation
        </button>
      </div>

      {activeTab === 'settings' && (
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
          <h3 className="text-xl font-bold text-slate-800 mb-6">LLM Configuration</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Active AI Model</label>
              <select className="w-full border border-slate-300 rounded-xl p-3 outline-none focus:ring-2 focus:ring-indigo-500 font-semibold">
                <option>GPT-4o (Default)</option>
                <option>GPT-3.5 Turbo</option>
                <option>Claude 3.5 Sonnet</option>
                <option>Local Mock (Testing)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Temperature (Creativity)</label>
              <input type="range" min="0" max="1" step="0.1" defaultValue="0.7" className="w-full mt-2" />
              <div className="flex justify-between text-xs text-slate-500 font-medium mt-1">
                <span>0.0 (Precise)</span><span>1.0 (Creative)</span>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <label className="flex items-center p-4 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors">
              <input type="checkbox" defaultChecked className="w-5 h-5 text-indigo-600 rounded border-slate-300" />
              <span className="ml-3 font-bold text-slate-700">Enable Exam Prediction Engine</span>
            </label>
            <label className="flex items-center p-4 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors">
              <input type="checkbox" defaultChecked className="w-5 h-5 text-indigo-600 rounded border-slate-300" />
              <span className="ml-3 font-bold text-slate-700">Enable Voice Assistant (Web Speech API)</span>
            </label>
          </div>
          <button className="mt-8 bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold shadow-md hover:bg-indigo-700 transition-colors">Save Configurations</button>
        </div>
      )}

      {activeTab === 'knowledge' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
            <h3 className="text-xl font-bold text-slate-800 mb-2 flex items-center"><UploadCloud className="w-5 h-5 mr-2 text-blue-500" /> Upload Context</h3>
            <p className="text-sm text-slate-500 mb-6">Upload PDFs or Text files to augment the AI's knowledge base.</p>
            <div className="border-2 border-dashed border-slate-300 rounded-2xl p-8 text-center hover:border-indigo-500 transition-colors cursor-pointer bg-slate-50">
              <Database className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <p className="font-bold text-slate-600">Drag and drop files here</p>
              <p className="text-xs text-slate-400 mt-1">Supports PDF, DOCX, TXT</p>
            </div>
            <div className="mt-6">
              <label className="block text-sm font-bold text-slate-700 mb-2">Assign to Program</label>
              <select className="w-full border border-slate-300 rounded-xl p-3 outline-none font-semibold">
                <option>All Programs</option><option>Lakshya</option><option>Deekshya</option><option>DAFNE</option>
              </select>
            </div>
            <button className="w-full mt-6 bg-slate-800 text-white px-6 py-3 rounded-xl font-bold shadow-md hover:bg-slate-900 transition-colors">Process & Vectorize</button>
          </div>
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
             <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center"><Activity className="w-5 h-5 mr-2 text-emerald-500" /> Vector Database Status</h3>
             <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="font-bold text-slate-700">Total Documents</span>
                  <span className="font-mono font-black text-indigo-600">142</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="font-bold text-slate-700">Embedded Chunks</span>
                  <span className="font-mono font-black text-indigo-600">4,592</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="font-bold text-slate-700">Pinecone Connection</span>
                  <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded">Active</span>
                </div>
             </div>
          </div>
        </div>
      )}

      {activeTab === 'logs' && (
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 text-center">
          <MessageSquare className="w-16 h-16 text-slate-200 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-slate-800 mb-2">Moderation Dashboard</h3>
          <p className="text-slate-500 mb-6 max-w-lg mx-auto">View anonymized chat logs, detect policy violations, and audit the AI's responses.</p>
          <button className="bg-indigo-600 text-white px-6 py-2 rounded-xl font-bold shadow-md hover:bg-indigo-700 transition-colors">Load Audit Logs</button>
        </div>
      )}

    </div>
  );
};

export default AIControls;
