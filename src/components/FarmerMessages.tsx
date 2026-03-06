import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { MessageSquare, ArrowLeft, User, Search, Send } from 'lucide-react';

interface FarmerMessagesProps {
  onBack: () => void;
}

export default function FarmerMessages({ onBack }: FarmerMessagesProps) {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<any>(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch('/api/messages');
        const data = await response.json();
        setMessages(data);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
      setLoading(false);
    };
    fetchMessages();
  }, []);

  return (
    <div className="space-y-8">
      <button 
        onClick={onBack}
        className="flex items-center text-stone-500 hover:text-stone-900 font-bold transition-colors"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Dashboard
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Message List */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-[2.5rem] shadow-sm border border-stone-100 overflow-hidden flex flex-col h-[600px]"
        >
          <div className="p-6 border-b border-stone-100">
            <h3 className="text-xl font-bold text-stone-900 flex items-center">
              <MessageSquare className="h-5 w-5 mr-2 text-primary" />
              Messages
            </h3>
          </div>
          <div className="p-4 border-b border-stone-100">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
              <input 
                type="text" 
                placeholder="Search messages..." 
                className="w-full pl-10 pr-4 py-2 bg-stone-50 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="p-8 text-center text-stone-400 text-sm">Loading...</div>
            ) : messages.length === 0 ? (
              <div className="p-8 text-center text-stone-400 text-sm">No messages</div>
            ) : (
              messages.map((msg) => (
                <button
                  key={msg.id}
                  onClick={() => setSelectedMessage(msg)}
                  className={`w-full p-4 text-left border-b border-stone-50 transition-colors hover:bg-stone-50 flex items-start space-x-3 ${
                    selectedMessage?.id === msg.id ? 'bg-primary/5 border-l-4 border-l-primary' : ''
                  }`}
                >
                  <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center flex-shrink-0">
                    <User className="h-5 w-5 text-stone-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <p className={`text-sm font-bold truncate ${!msg.read && selectedMessage?.id !== msg.id ? 'text-stone-900' : 'text-stone-600'}`}>
                        {msg.subject}
                      </p>
                      <span className="text-[10px] text-stone-400 whitespace-nowrap ml-2">
                        {new Date(msg.date).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-xs text-stone-500 truncate">{msg.body}</p>
                  </div>
                </button>
              ))
            )}
          </div>
        </motion.div>

        {/* Message Content */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2 bg-white rounded-[2.5rem] shadow-sm border border-stone-100 overflow-hidden flex flex-col h-[600px]"
        >
          {selectedMessage ? (
            <>
              <div className="p-6 border-b border-stone-100 flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-bold text-stone-900">{selectedMessage.subject}</h4>
                    <p className="text-xs text-stone-500">From: {selectedMessage.from}</p>
                  </div>
                </div>
                <span className="text-xs text-stone-400">
                  {new Date(selectedMessage.date).toLocaleString()}
                </span>
              </div>
              <div className="flex-1 p-8 overflow-y-auto">
                <div className="prose prose-stone max-w-none">
                  <p className="text-stone-700 leading-relaxed">{selectedMessage.body}</p>
                </div>
              </div>
              <div className="p-6 border-t border-stone-100">
                <div className="flex space-x-4">
                  <input 
                    type="text" 
                    placeholder="Type your reply..." 
                    className="flex-1 px-4 py-3 bg-stone-50 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                  <button className="bg-primary text-white p-3 rounded-2xl hover:bg-primary-dark transition-colors">
                    <Send className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
              <div className="w-20 h-20 bg-stone-50 rounded-full flex items-center justify-center mb-4">
                <MessageSquare className="h-10 w-10 text-stone-200" />
              </div>
              <h4 className="text-lg font-bold text-stone-800 mb-2">Select a message</h4>
              <p className="text-stone-500 max-w-xs">Choose a conversation from the list to view the message details and reply.</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
