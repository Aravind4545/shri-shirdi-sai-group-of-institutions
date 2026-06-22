import { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, Mic, Paperclip, Loader2 } from 'lucide-react';

const FloatingAIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && messages.length === 0) fetchHistory();
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const fetchHistory = async () => {
    try {
      const res = await fetch('https://shri-shirdi-sai-group-of-institutions.onrender.com/api/ai/chat-history', {
        headers: { 'x-auth-token': localStorage.getItem('token') || '' }
      });
      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages || []);
      }
    } catch (err) { console.error(err); }
  };

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      // Hardcoded program to Lakshya for simulation if user is logged in
      const res = await fetch('https://shri-shirdi-sai-group-of-institutions.onrender.com/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-auth-token': localStorage.getItem('token') || '' },
        body: JSON.stringify({ message: userMsg.content, program: 'Lakshya' })
      });
      if (res.ok) {
        const data = await res.json();
        setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
      }
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  // Simulated Voice API
  const handleVoice = () => {
    alert("Voice recognition activated. (Mocked Web Speech API)");
    setInput("Can you explain the doubt I had in physics yesterday?");
  };

  // Simulated File Upload
  const handleUpload = () => {
    alert("Opening file picker... (Mocked Image/PDF upload)");
  };

  return (
    <>
      {/* Floating Button */}
      <button 
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 p-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-2xl hover:scale-110 transition-transform z-50 ${isOpen ? 'hidden' : 'block'}`}
      >
        <Bot className="w-8 h-8" />
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-[500px] bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden z-50 animate-in slide-in-from-bottom-10 fade-in duration-300">
          
          {/* Header */}
          <div className="bg-indigo-600 p-4 flex justify-between items-center text-white">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mr-3 backdrop-blur-sm">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold">Sai AI Assistant</h3>
                <p className="text-xs text-indigo-200">Online & Ready to help</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-2 rounded-full transition-colors"><X className="w-5 h-5" /></button>
          </div>

          {/* Messages Container */}
          <div className="flex-1 p-4 overflow-y-auto bg-slate-50 space-y-4">
            {messages.length === 0 && !loading && (
              <div className="text-center text-slate-500 mt-10">
                <Bot className="w-12 h-12 mx-auto text-indigo-200 mb-2" />
                <p className="text-sm font-semibold text-slate-600">Hi! I'm your AI tutor.</p>
                <p className="text-xs">Ask me about your syllabus, upload a doubt, or generate a study plan!</p>
              </div>
            )}

            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-2xl p-3 text-sm shadow-sm ${
                  msg.role === 'user' ? 'bg-indigo-600 text-white rounded-br-sm' : 'bg-white text-slate-800 border border-slate-200 rounded-bl-sm'
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
            
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white border border-slate-200 rounded-2xl p-3 shadow-sm rounded-bl-sm flex items-center">
                  <Loader2 className="w-4 h-4 text-indigo-600 animate-spin mr-2" /> <span className="text-xs text-slate-500 font-semibold">Thinking...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-3 bg-white border-t border-slate-100">
            <form onSubmit={handleSend} className="flex items-center gap-2">
              <button type="button" onClick={handleUpload} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 rounded-full transition-colors"><Paperclip className="w-5 h-5" /></button>
              <input 
                type="text" 
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Ask your doubt..." 
                className="flex-1 bg-slate-100 border-none outline-none rounded-full px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500"
              />
              {input.trim() ? (
                <button type="submit" className="p-2 bg-indigo-600 text-white rounded-full shadow-md hover:bg-indigo-700 transition-colors"><Send className="w-4 h-4" /></button>
              ) : (
                <button type="button" onClick={handleVoice} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 rounded-full transition-colors"><Mic className="w-5 h-5" /></button>
              )}
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default FloatingAIAssistant;
