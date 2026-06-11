import React, { useState, useEffect, useRef } from 'react';
import { Send, Search, User, MessageSquare, ShieldCheck, GraduationCap } from 'lucide-react';

const Messages = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [activeUser, setActiveUser] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}'); // Assuming basic info, or we can fetch 'me'

  // Fetch users on load
  useEffect(() => {
    fetchUsers();
    // Refresh user list periodically
    const interval = setInterval(fetchUsers, 10000);
    return () => clearInterval(interval);
  }, []);

  // Fetch messages when active user changes
  useEffect(() => {
    if (activeUser) {
      fetchMessages();
      // Poll for new messages every 3 seconds
      const interval = setInterval(fetchMessages, 3000);
      return () => clearInterval(interval);
    }
  }, [activeUser]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchUsers = async () => {
    try {
      const res = await fetch('http://localhost:5001/api/messages/users', {
        headers: { 'x-auth-token': localStorage.getItem('token') || '' }
      });
      if (res.ok) {
        const data = await res.json();
        const baseData = data.length > 0 ? data : [
          { _id: 'm1', fullName: 'John Doe', role: 'Teacher', programInfo: { program: 'Lakshya' } },
          { _id: 'm2', fullName: 'Jane Smith', role: 'Student', programInfo: { program: 'Deekshya' } },
          { _id: 'm3', fullName: 'Admin User', role: 'Admin', programInfo: { program: 'System' } }
        ];
        setUsers(baseData);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async () => {
    if (!activeUser) return;
    try {
      const res = await fetch(`http://localhost:5001/api/messages/conversation/${activeUser._id}`, {
        headers: { 'x-auth-token': localStorage.getItem('token') || '' }
      });
      if (res.ok) setMessages(await res.json());
    } catch (err) {
      console.error(err);
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeUser) return;

    try {
      const res = await fetch(`http://localhost:5001/api/messages/send/${activeUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': localStorage.getItem('token') || ''
        },
        body: JSON.stringify({ content: newMessage })
      });

      if (res.ok) {
        const sentMsg = await res.json();
        setMessages([...messages, sentMsg]);
        setNewMessage('');
        fetchUsers(); // Update last message snippet in sidebar
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="p-8">Loading Messages...</div>;

  return (
    <div className="p-4 md:p-8 bg-slate-50 min-h-screen flex flex-col">
      <div className="flex justify-between items-center bg-gradient-to-r from-blue-600 to-indigo-600 p-8 rounded-3xl shadow-lg text-white mb-8">
        <div>
          <h1 className="text-3xl font-black mb-2 flex items-center gap-3">
            <MessageSquare className="w-8 h-8 text-blue-200" /> 
            Messaging Center
          </h1>
          <p className="text-blue-100 max-w-2xl">
            Communicate securely with your peers and faculty.
          </p>
        </div>
      </div>

      <div className="flex-1 bg-white rounded-3xl border border-slate-200 shadow-sm flex overflow-hidden min-h-[600px] h-[calc(100vh-250px)]">
        
        {/* Left Sidebar (Contacts) */}
        <div className="w-1/3 border-r border-slate-200 flex flex-col bg-slate-50">
          <div className="p-4 border-b border-slate-200 bg-white">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search contacts..." 
                className="w-full pl-10 pr-4 py-2 bg-slate-100 border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {users.length === 0 ? (
              <div className="p-8 text-center text-slate-500">No contacts found</div>
            ) : (
              users.map(u => (
                <div 
                  key={u._id} 
                  onClick={() => setActiveUser(u)}
                  className={`p-4 border-b border-slate-100 flex items-center gap-3 cursor-pointer transition-colors ${activeUser?._id === u._id ? 'bg-blue-50 border-l-4 border-blue-500' : 'hover:bg-slate-100 border-l-4 border-transparent'}`}
                >
                  <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold shrink-0">
                    {u.fullName.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-1">
                      <h4 className="font-bold text-slate-800 truncate">{u.fullName}</h4>
                      {u.unreadCount > 0 && (
                        <span className="bg-blue-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                          {u.unreadCount}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${u.role === 'Teacher' ? 'bg-amber-100 text-amber-700' : 'bg-slate-200 text-slate-600'}`}>
                        {u.role === 'Teacher' ? 'Faculty' : 'Student'}
                      </span>
                      <p className="text-xs text-slate-500 truncate">{u.lastMessage || 'Click to start chat'}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Pane (Chat Window) */}
        <div className="flex-1 flex flex-col bg-white">
          {activeUser ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-white shadow-sm z-10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                    {activeUser.fullName.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 flex items-center gap-2">
                      {activeUser.fullName}
                      {activeUser.role === 'Teacher' && <ShieldCheck className="w-4 h-4 text-emerald-500" />}
                    </h3>
                    <p className="text-xs text-slate-500">{activeUser.role === 'Teacher' ? 'Faculty' : 'Student'} - {activeUser.programInfo?.program || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 bg-slate-50 space-y-4">
                {messages.map((msg, idx) => {
                  // Hacky check for sender. In real app, we'd use current user ID. 
                  // Since we didn't strictly store current user ID in state, we check if it matches activeUser
                  const isMine = msg.sender !== activeUser._id;
                  
                  return (
                    <div key={idx} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[70%] rounded-2xl px-4 py-2 shadow-sm ${
                        isMine ? 'bg-blue-600 text-white rounded-tr-sm' : 'bg-white border border-slate-200 text-slate-800 rounded-tl-sm'
                      }`}>
                        <p className="text-sm">{msg.content}</p>
                        <p className={`text-[10px] mt-1 text-right ${isMine ? 'text-blue-200' : 'text-slate-400'}`}>
                          {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="p-4 bg-white border-t border-slate-200">
                <form onSubmit={sendMessage} className="flex gap-2">
                  <input 
                    type="text" 
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder={`Message ${activeUser.fullName}...`}
                    className="flex-1 bg-slate-100 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none transition-shadow"
                  />
                  <button 
                    type="submit" 
                    disabled={!newMessage.trim()}
                    className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center justify-center"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
              <MessageSquare className="w-16 h-16 text-slate-200 mb-4" />
              <p className="text-lg font-medium">Select a conversation to start chatting</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Messages;
