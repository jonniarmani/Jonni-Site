import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, X, Send, Mail, Loader2, User, Bot, LogIn } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { Avatar } from './ui/avatar';
import { getGeminiResponse } from '../services/geminiService';
import { fetchRecentEmails } from '../services/gmailService';
import { useAuthStore, initializeTokenClient } from '../lib/AuthStore';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', text: "Hello! I'm your Jonni Armani Media AI assistant. How can I help with your media business or emails today?", sender: 'bot', timestamp: new Date() }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  
  const { accessToken, setAccessToken } = useAuthStore();
  const tokenClientRef = useRef<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize token client when component mounts
    const timer = setTimeout(() => {
      tokenClientRef.current = initializeTokenClient((token) => {
        setAccessToken(token);
        setIsOpen(true);
      });
    }, 1000);
    return () => clearTimeout(timer);
  }, [setAccessToken]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages]);

  const handleLogin = () => {
    if (tokenClientRef.current) {
      tokenClientRef.current.requestAccessToken();
    } else {
      alert("Auth client not initialized. Please ensure your Client ID is configured.");
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      let context = "";
      if (accessToken && (input.toLowerCase().includes('email') || input.toLowerCase().includes('mail'))) {
        setIsSyncing(true);
        context = await fetchRecentEmails(accessToken);
        setIsSyncing(false);
      }

      const response = await getGeminiResponse(input, context);
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
      setIsSyncing(false);
    }
  };

  return (
    <>
      {/* Toggle Button */}
      <motion.button
        className="fixed bottom-24 right-8 z-[100] w-14 h-14 rounded-full bg-brand-gold text-white shadow-2xl flex items-center justify-center hover:scale-110 transition-transform"
        onClick={() => setIsOpen(!isOpen)}
        whileTap={{ scale: 0.9 }}
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed bottom-40 right-8 z-[100] w-[350px] sm:w-[400px] h-[500px]"
          >
            <Card className="flex flex-col h-full shadow-2xl border-white/10 bg-brand-black text-white overflow-hidden">
              {/* Header */}
              <div className="bg-brand-gold p-4 flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                    <Bot size={18} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-widest text-white leading-none">JAM Assistant</h3>
                    <div className="flex items-center mt-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-400 mr-1.5 animate-pulse" />
                      <span className="text-[8px] uppercase font-bold tracking-tighter opacity-80">AI Powered Agent</span>
                    </div>
                  </div>
                </div>
                {!accessToken ? (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-white hover:bg-white/20 rounded-full"
                    onClick={handleLogin}
                    title="Connect Gmail"
                  >
                    <LogIn size={18} />
                  </Button>
                ) : (
                  <div className="flex items-center space-x-1" title="Gmail Connected">
                    <Mail size={14} className="text-white/80" />
                    <span className="text-[8px] font-black uppercase">Linked</span>
                  </div>
                )}
              </div>

              {/* Messages Area */}
              <ScrollArea className="flex-1 p-4" viewportRef={scrollRef}>
                <div className="space-y-4">
                  {messages.map((m) => (
                    <div key={m.id} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`flex max-w-[80%] ${m.sender === 'user' ? 'flex-row-reverse' : 'flex-row'} items-start`}>
                        <Avatar className={`w-8 h-8 ${m.sender === 'user' ? 'ml-2' : 'mr-2'} ${m.sender === 'user' ? 'bg-brand-gold' : 'bg-white/10'}`}>
                          {m.sender === 'user' ? <User size={14} /> : <Bot size={14} />}
                        </Avatar>
                        <div className={`p-3 rounded-2xl text-xs leading-relaxed ${
                          m.sender === 'user' 
                            ? 'bg-brand-gold text-white rounded-tr-none' 
                            : 'bg-white/5 text-gray-200 border border-white/10 rounded-tl-none'
                        }`}>
                          {m.text}
                        </div>
                      </div>
                    </div>
                  ))}
                  {(isLoading || isSyncing) && (
                    <div className="flex justify-start">
                      <div className="bg-white/5 p-3 rounded-2xl flex items-center space-x-2">
                        <Loader2 className="w-4 h-4 animate-spin text-brand-gold" />
                        <span className="text-[10px] uppercase font-bold tracking-widest opacity-50">
                          {isSyncing ? "Syncing Gmail..." : "AI is thinking..."}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>

              {/* Footer / Input */}
              <div className="p-4 bg-white/5 border-t border-white/10">
                <div className="flex space-x-2">
                  <Input 
                    placeholder="Type a message or ask about emails..." 
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/20 text-xs h-10"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  />
                  <Button 
                    className="bg-brand-gold hover:bg-brand-gold/80 h-10 w-10 p-0"
                    onClick={handleSend}
                    disabled={isLoading}
                  >
                    <Send size={16} />
                  </Button>
                </div>
                {!accessToken && (
                  <button 
                    onClick={handleLogin}
                    className="mt-2 text-[8px] uppercase tracking-widest font-black text-brand-gold hover:underline w-full text-center"
                  >
                    Connect Gmail for full personality integration
                  </button>
                )}
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
