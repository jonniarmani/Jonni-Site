import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { db, doc, onSnapshot, collection, handleFirestoreError, OperationType } from '../lib/firebase';
import { addDoc, query, where, orderBy, getDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { motion } from 'motion/react';
import { MessageSquare, Send, History, Check, Loader2, Gauge, AlertCircle, Briefcase, ChevronRight, Activity, Layers, Star, User, Radio, Image, PlayCircle, Maximize2 } from 'lucide-react';
import { useContent } from '../lib/ContentContext';

export default function Portal() {
  const { id } = useParams();
  const { content } = useContent();
  const [loading, setLoading] = useState(true);
  const [relatedData, setRelatedData] = useState<any>(null);
  const [relatedType, setRelatedType] = useState<'lead' | 'project' | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [honeypot, setHoneypot] = useState("");
  const [startTime] = useState(Date.now());

  useEffect(() => {
    if (!id) return;

    let unsub: (() => void) | undefined;

    const findResource = async () => {
      try {
        setLoading(true);
        // Try project first
        const projectRef = doc(db, 'projects', id);
        const projectSnap = await getDoc(projectRef);
        
        if (projectSnap.exists()) {
          setRelatedType('project');
          unsub = onSnapshot(projectRef, (doc) => {
            if (doc.exists()) {
              setRelatedData({ id: doc.id, ...doc.data() });
              setLoading(false);
            }
          });
        } else {
          // Try lead
          const leadRef = doc(db, 'leads', id);
          const leadSnap = await getDoc(leadRef);
          
          if (leadSnap.exists()) {
            setRelatedType('lead');
            unsub = onSnapshot(leadRef, (doc) => {
              if (doc.exists()) {
                setRelatedData({ id: doc.id, ...doc.data() });
                setLoading(false);
              }
            });
          } else {
            setError("The visual transmission channel could not be located. Identity mismatch or expired link.");
            setLoading(false);
          }
        }
      } catch (err) {
        setError("Security rejection. Channel access denied.");
        console.error(err);
        setLoading(false);
      }
    };

    findResource();
    return () => unsub?.();
  }, [id]);

  useEffect(() => {
    if (!id || !relatedType) return;

    const q = query(
      collection(db, 'communications'),
      where('relatedId', '==', id),
      orderBy('createdAt', 'asc')
    );

    const unsub = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (err) => {
      console.error("Communication Sync Error:", err);
    });

    return () => unsub();
  }, [id, relatedType]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || sending || !id || !relatedType) return;

    setSending(true);
    try {
      await addDoc(collection(db, 'communications'), {
        relatedId: id,
        relatedType,
        senderId: 'client',
        senderName: relatedData?.name || relatedData?.clientName || 'Client',
        text: newMessage,
        createdAt: serverTimestamp(),
        isRead: false
      });
      setNewMessage("");
      // Force scroll to bottom could be added here
    } catch (err) {
      console.error("Transmission failed:", err);
      alert("Asset delivery failed. Please check your connection.");
    }
    setSending(false);
  };

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Anti-Spam
    const timeToFill = Date.now() - startTime;
    if (honeypot || timeToFill < 2000) {
      console.warn("Spam detected in booking system.");
      alert("Consultation protocol initiated. Awaiting agency confirmation."); // Fake success
      return;
    }

    const dateInput = (e.target as HTMLFormElement).elements.namedItem('bookingDate') as HTMLInputElement;
    const date = dateInput.value;
    if (!date || sending || !id || !relatedType) return;

    setSending(true);
    try {
      // Update core record
      const collectionName = relatedType === 'lead' ? 'leads' : 'projects';
      await updateDoc(doc(db, collectionName, id), {
        bookingDate: date,
        bookingStatus: 'requested'
      });

      // Log in communications
      await addDoc(collection(db, 'communications'), {
        relatedId: id,
        relatedType,
        senderId: 'system',
        senderName: 'Scheduling Engine',
        text: `Consultation requested for: ${new Date(date).toLocaleString()}. Master Control will review and confirm.`,
        createdAt: serverTimestamp(),
        isRead: false
      });
      
      alert("Consultation protocol initiated. Awaiting agency confirmation.");
    } catch (err) {
      console.error("Booking failed:", err);
      alert("Scheduling error. Critical timeout.");
    }
    setSending(false);
  };

  if (loading) return (
    <div className="min-h-screen pt-40 flex flex-col items-center justify-center bg-zinc-50">
      <Loader2 className="w-12 h-12 text-brand-cyan animate-spin mb-4" />
      <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">Synchronizing Visual Core...</span>
    </div>
  );

  if (error) return (
    <div className="min-h-screen pt-40 container mx-auto px-6 text-center">
      <div className="max-w-md mx-auto p-12 bg-white border border-red-100 shadow-xl">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-6" />
        <h2 className="text-2xl font-display font-bold uppercase tracking-tight mb-4">Transmission Error</h2>
        <p className="text-gray-500 text-sm font-medium mb-8 leading-relaxed">{error}</p>
        <Link to="/" className="inline-block bg-brand-black text-white px-8 py-4 text-[10px] font-black uppercase tracking-widest hover:bg-brand-cyan transition-colors">
          Return to Hub
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen pt-24 pb-40 bg-zinc-50">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <h1 className="text-3xl sm:text-5xl font-display font-bold uppercase tracking-tight">Client <span className="text-brand-cyan italic">Transmission Portal</span></h1>
            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-2 flex items-center">
              <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2 animate-pulse" />
              Secure Protocol Active • {relatedData?.title || 'System Resource'}
            </p>
          </div>
          <div className="flex flex-col lg:flex-row gap-12">
            
            {/* Sidebar: Overview */}
            <div className="lg:w-1/3 space-y-8">
              <div className="bg-white border border-gray-100 p-8 shadow-sm">
                <div className="flex items-center space-x-3 mb-8">
                  <div className="w-10 h-10 rounded-full bg-brand-black flex items-center justify-center text-brand-cyan">
                    {relatedType === 'project' ? <Briefcase size={20} /> : <MessageSquare size={20} />}
                  </div>
                  <div>
                    <span className="text-[8px] font-black uppercase tracking-widest text-brand-cyan block">Visual Production Protocol</span>
                    <h2 className="text-xl font-display font-bold uppercase tracking-tight">{relatedType === 'project' ? 'Active Workflow' : 'Lead Transmission'}</h2>
                  </div>
                </div>

                <div className="space-y-6">
                   <div className="space-y-1">
                      <label className="text-[8px] uppercase font-black text-gray-400">Subject Asset</label>
                      <p className="text-sm font-bold uppercase tracking-tight">{relatedData?.title || relatedData?.service || 'Unnamed Production'}</p>
                   </div>
                   <div className="space-y-1">
                      <label className="text-[8px] uppercase font-black text-gray-400">Assigned Identity</label>
                      <p className="text-sm font-bold opacity-60">{relatedData?.name || relatedData?.clientName}</p>
                   </div>
                   
                   {relatedType === 'project' && (
                     <div className="pt-6 border-t border-gray-50 space-y-4">
                        <div className="flex justify-between items-end">
                           <label className="text-[8px] uppercase font-black text-gray-400">Execution Progress</label>
                           <span className="text-xl font-display font-bold text-brand-cyan">{relatedData.progress}%</span>
                        </div>
                        <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
                           <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${relatedData.progress}%` }}
                              className="h-full bg-brand-cyan"
                           />
                        </div>
                        <div className="flex justify-between text-[7px] font-black uppercase text-gray-300">
                           <span>Planning</span>
                           <span>Production</span>
                           <span>Final Asset</span>
                        </div>
                        
                        <div className="p-4 bg-zinc-50 border border-gray-100 mt-6">
                           <div className="flex items-center text-[8px] font-black uppercase text-brand-black mb-1">
                             <Activity size={10} className="mr-2" /> Current Phase
                           </div>
                           <p className="text-xs font-bold uppercase text-brand-cyan">{relatedData.status?.split('-').join(' ')}</p>
                        </div>
                        
                        <div className="pt-6 border-t border-gray-100 space-y-4">
                           <div className="flex items-center space-x-2">
                              <Radio size={14} className={relatedData.directTransmissionEnabled ? "text-brand-cyan animate-pulse" : "text-gray-300"} />
                              <span className="text-[10px] font-black uppercase tracking-widest leading-none">Transmission Status</span>
                           </div>
                           <div className={`p-4 border ${relatedData.directTransmissionEnabled ? 'bg-zinc-50 border-brand-cyan' : 'bg-gray-50 border-gray-100'}`}>
                              <div className="flex items-center justify-between">
                                 <span className="text-[8px] font-black uppercase tracking-widest text-gray-400">Signal:</span>
                                 <span className={`text-[8px] font-black uppercase ${relatedData.directTransmissionEnabled ? 'text-brand-cyan' : 'text-gray-300'}`}>
                                    {relatedData.directTransmissionEnabled ? 'Active / Synchronized' : 'Standby / Encrypted'}
                                 </span>
                              </div>
                           </div>
                        </div>
                     </div>
                   )}

                   <div className="pt-8 border-t border-gray-100">
                      <div className="flex items-center space-x-2 mb-4">
                         <Star size={14} className="text-brand-cyan fill-brand-cyan" />
                         <span className="text-[10px] font-black uppercase tracking-widest leading-none">Schedule Consultation</span>
                      </div>
                      
                      {relatedData.bookingDate ? (
                         <div className="bg-emerald-50 border border-emerald-100 p-4">
                            <span className="block text-[8px] font-black uppercase text-emerald-600 mb-1">Protocol Established</span>
                            <p className="text-[10px] font-bold text-emerald-900">
                               {new Date(relatedData.bookingDate).toLocaleString()}
                            </p>
                            <span className="block text-[7px] uppercase font-black text-emerald-500 mt-2">Status: {relatedData.bookingStatus || 'Awaiting Sync'}</span>
                         </div>
                      ) : (
                         <form onSubmit={handleBooking} className="space-y-4">
                            {/* Honeypot Security Layer */}
                            <div className="hidden" aria-hidden="true">
                              <input 
                                type="text" 
                                name="booking_verification" 
                                tabIndex={-1} 
                                autoComplete="off"
                                value={honeypot}
                                onChange={(e) => setHoneypot(e.target.value)}
                              />
                            </div>

                            <div className="relative">
                               <input 
                                 type="datetime-local" 
                                 name="bookingDate"
                                 required
                                 className="w-full bg-zinc-100 border border-gray-200 p-3 text-[10px] uppercase font-bold outline-none focus:ring-1 focus:ring-brand-cyan"
                               />
                            </div>
                            <button 
                              disabled={sending}
                              className="w-full bg-brand-black text-white py-3 text-[9px] font-black uppercase tracking-widest hover:bg-brand-cyan transition-all shadow-lg shadow-brand-black/10 active:scale-95 disabled:opacity-50"
                            >
                               Initiate Booking
                            </button>
                            <p className="text-[7px] text-gray-400 font-medium leading-relaxed italic">
                               *Booking request will be transmitted for review. Master control will confirm via correspondence.
                            </p>
                         </form>
                      )}
                   </div>
                </div>
              </div>
              
              <div className="bg-brand-black text-white p-8 space-y-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-cyan bg-opacity-10 rounded-full -mr-16 -mt-16 blur-2xl" />
                <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-500">Authority Note</h3>
                <p className="text-xs font-medium leading-relaxed italic opacity-80">
                  "Our goal is absolute visual dominance for your brand. Use this channel to coordinate precisely with our technical leads."
                </p>
                <div className="pt-4 flex items-center space-x-3">
                   <div className="w-8 h-8 rounded-full border border-brand-cyan border-opacity-30 p-1">
                      {content.about.profileImage ? (
                        <img src={content.about.profileImage} className="w-full h-full object-cover rounded-full grayscale" alt="" />
                      ) : (
                        <User size={20} className="w-full h-full text-brand-cyan" />
                      )}
                   </div>
                   <div>
                      <span className="block text-[8px] font-black uppercase tracking-widest">Jonni Armani</span>
                      <span className="block text-[7px] font-bold text-brand-cyan uppercase">Production Lead</span>
                   </div>
                </div>
              </div>
            </div>

             {/* Main: Chat Environment and Gallery */}
            <div className="lg:w-2/3 space-y-12">
              
              {/* Asset Gallery Section (New feature requested) */}
              {relatedType === 'project' && relatedData.galleryAssets?.length > 0 && (
                <div className="bg-white border border-gray-100 shadow-sm p-8">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h3 className="text-xl font-display font-bold uppercase tracking-tight">Client <span className="text-brand-cyan">Asset Gallery</span></h3>
                      <p className="text-[8px] text-gray-400 font-black uppercase tracking-[0.3em] mt-1">Direct Secure delivery of visual components</p>
                    </div>
                    <div className="flex items-center space-x-2 text-[8px] font-black uppercase text-gray-400">
                      <Layers size={12} className="text-brand-cyan" />
                      <span>{relatedData.galleryAssets.length} Artifacts</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {relatedData.galleryAssets.map((asset: any, idx: number) => (
                      <motion.div 
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="group relative bg-zinc-900 overflow-hidden aspect-video border border-zinc-800"
                      >
                        {asset.type === 'video' ? (
                          <div className="relative w-full h-full">
                            <video 
                              src={asset.url} 
                              className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity"
                              onMouseEnter={(e) => (e.target as HTMLVideoElement).play()}
                              onMouseLeave={(e) => {
                                (e.target as HTMLVideoElement).pause();
                                (e.target as HTMLVideoElement).currentTime = 0;
                              }}
                              muted
                              loop
                            />
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none group-hover:opacity-0 transition-opacity">
                              <PlayCircle size={40} className="text-white opacity-40" />
                            </div>
                          </div>
                        ) : (
                          <img 
                            src={asset.url} 
                            alt={asset.title} 
                            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-700 group-hover:scale-110" 
                          />
                        )}
                        
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                          <h4 className="text-[10px] font-black uppercase tracking-widest text-brand-cyan mb-1">{asset.title || 'Visual Component'}</h4>
                          <div className="flex justify-between items-center">
                            <span className="text-[7px] font-bold text-gray-400 uppercase tracking-tighter">Artifact ID: {idx + 1}</span>
                            <a 
                              href={asset.url} 
                              target="_blank" 
                              rel="noreferrer"
                              className="w-8 h-8 rounded-full bg-brand-cyan bg-opacity-20 backdrop-blur-sm flex items-center justify-center text-brand-cyan hover:bg-brand-cyan hover:text-black transition-all"
                            >
                              <Maximize2 size={12} />
                            </a>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex flex-col bg-white border border-gray-100 shadow-xl h-[600px]">
              <div className="p-6 border-b border-gray-50 flex items-center justify-between">
                <div>
                   <h3 className="text-sm font-black uppercase tracking-widest">Correspondence Core</h3>
                   <p className="text-[9px] text-gray-400 font-bold uppercase tracking-tighter mt-1">Direct Secure Line to Media Agency</p>
                </div>
                <div className="flex items-center space-x-2 text-emerald-500">
                   <Check size={14} />
                   <span className="text-[8px] font-black uppercase tracking-widest">Active Transmission</span>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-gray-50">
                {messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full opacity-20 text-center px-12">
                     <History size={48} className="mb-4" />
                     <p className="text-xs uppercase font-black tracking-[0.2em]">Transmission history empty. Initializing channel...</p>
                  </div>
                ) : (
                  messages.map((msg) => (
                    <motion.div 
                      initial={{ opacity: 0, x: msg.senderId === 'client' ? 20 : -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      key={msg.id} 
                      className={`flex flex-col ${msg.senderId === 'client' ? 'items-end' : 'items-start'}`}
                    >
                      <div className={`max-w-[85%] p-4 text-xs sm:text-sm leading-relaxed shadow-sm ${
                        msg.senderId === 'client' 
                          ? 'bg-brand-black text-white' 
                          : 'bg-white border border-gray-100 text-zinc-900'
                      }`}>
                        {msg.text}
                      </div>
                      <span className="text-[8px] font-black uppercase text-gray-400 mt-2 tracking-widest">
                        {msg.senderName} • {msg.createdAt?.toDate ? 'Time' : '...'}
                      </span>
                    </motion.div>
                  ))
                )}
              </div>

              <form onSubmit={handleSend} className="p-6 bg-gray-50 border-t border-gray-100 flex items-center space-x-4">
                <input 
                  autoFocus
                  className="flex-1 bg-white border border-gray-200 p-4 text-sm font-medium outline-none focus:ring-2 focus:ring-brand-cyan focus:border-brand-cyan transition-all" 
                  placeholder="Input transmission protocol..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                />
                <button 
                  type="submit"
                  disabled={sending}
                  className="w-14 h-14 bg-brand-cyan text-white flex items-center justify-center hover:bg-brand-black transition-all shadow-lg active:scale-95 disabled:opacity-50"
                >
                  <Send size={20} />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);
}
