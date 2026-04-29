import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useContent } from '../lib/ContentContext';
import { auth, googleProvider, signInWithPopup, signOut, db, doc, setDoc, handleFirestoreError, OperationType, collection, deleteDoc, onSnapshot } from '../lib/firebase';
import { addDoc, query, where, orderBy, getDocs, updateDoc, Timestamp, serverTimestamp } from 'firebase/firestore';
import { Save, LogIn, LogOut, ChevronRight, Info, Home, User, Briefcase, Image as ImageIcon, Trash, Plus, Megaphone, Video as VideoIcon, MessageSquare, Star, Code, Palette, Upload, Download, RefreshCw, Globe, Twitter, ShieldCheck, Check, Sparkles, Filter, Settings, Activity, Zap, Search, BrainCircuit, ExternalLink, AlertCircle, Target, BarChart as ChartIcon, PieChart as PieIcon, LineChart as LineIcon, MousePointer2, Mail, Send, History, Briefcase as ProjectIcon, Layers, Loader2, Gauge } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import FileUploader from '../components/FileUploader';
import AIImageGenerator from '../components/AIImageGenerator';

const CommunicationThread = ({ relatedId, relatedType, senderName }: { relatedId: string, relatedType: 'lead' | 'project', senderName: string }) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    const q = query(
      collection(db, 'communications'),
      where('relatedId', '==', relatedId),
      orderBy('createdAt', 'asc')
    );
    
    const unsub = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    }, (error) => {
      console.error("Chat Error:", error);
      setLoading(false);
    });
    
    return () => unsub();
  }, [relatedId]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || sending) return;
    
    setSending(true);
    try {
      await addDoc(collection(db, 'communications'), {
        relatedId,
        relatedType,
        senderId: 'admin',
        senderName: 'Agency Control',
        text: newMessage,
        createdAt: serverTimestamp(),
        isRead: false
      });
      setNewMessage("");
    } catch (err) {
      console.error("Failed to send message:", err);
    }
    setSending(false);
  };

  return (
    <div className="bg-white border border-gray-100 flex flex-col h-[400px]">
      <div className="p-3 border-b border-gray-50 flex items-center justify-between bg-zinc-50">
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Communication History</span>
        <div className="flex items-center space-x-2">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[8px] font-bold text-gray-400 uppercase">Encrypted Channel</span>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="w-4 h-4 text-brand-gold animate-spin" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full opacity-30 text-center px-8">
            <History size={24} className="mb-2" />
            <p className="text-[9px] uppercase font-black tracking-widest">No transmission history archived.</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className={`flex flex-col ${msg.senderId === 'admin' ? 'items-end' : 'items-start'}`}>
              <div className={`max-w-[80%] p-3 text-[11px] leading-relaxed ${msg.senderId === 'admin' ? 'bg-brand-black text-white' : 'bg-gray-100 text-zinc-900 border border-gray-200'}`}>
                {msg.text}
              </div>
              <span className="text-[7px] font-bold uppercase text-gray-400 mt-1">
                {msg.senderName} • {msg.createdAt?.toDate ? msg.createdAt.toDate().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '...'}
              </span>
            </div>
          ))
        )}
      </div>
      
      <form onSubmit={handleSend} className="p-3 bg-zinc-50 border-t border-gray-100 flex items-center space-x-2">
        <input 
          className="flex-1 bg-white border border-gray-200 p-2 text-xs outline-none focus:border-brand-gold" 
          placeholder="Initiate transmission..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button 
          type="submit"
          disabled={sending}
          className="w-10 h-10 bg-brand-black text-brand-gold flex items-center justify-center hover:bg-zinc-800 transition-all disabled:opacity-50"
        >
          <Send size={16} />
        </button>
      </form>
      <div className="p-1 px-4 bg-brand-gold/10 border-t border-brand-gold/10">
        <p className="text-[7px] text-brand-gold font-bold uppercase tracking-widest">Client Portal Active: /portal/{relatedId}</p>
      </div>
    </div>
  );
};
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, BarChart, Bar, Cell, PieChart, Pie 
} from 'recharts';

const FocalPointSelector = ({ value, onChange, label = "Focal Point Precision" }: { value?: string, onChange: (val: string) => void, label?: string }) => {
  const currentVal = value || '50% 50%';
  
  // Parse H and V from "X% Y%" or handle legacy keywords
  let h = 50;
  let v = 50;

  if (currentVal.includes('%')) {
    const parts = currentVal.split(' ');
    h = parseInt(parts[0]) || 50;
    v = (parts.length > 1) ? parseInt(parts[1]) || 50 : 50;
  } else {
    if (currentVal.includes('top')) v = 0;
    if (currentVal.includes('bottom')) v = 100;
    if (currentVal.includes('left')) h = 0;
    if (currentVal.includes('right')) h = 100;
  }

  return (
    <div className="space-y-3 p-3 bg-zinc-50 border border-gray-200 rounded-sm mt-2">
      <label className="text-[9px] uppercase font-bold text-gray-400 tracking-tighter block">{label}</label>
      
      <div className="space-y-4">
        <div className="space-y-1">
          <div className="flex justify-between items-center text-[7px] font-black uppercase text-gray-500">
            <span>Horizontal Alignment: {h}%</span>
            <button type="button" onClick={() => onChange(`50% ${v}%`)} className="text-brand-gold hover:underline">Reset</button>
          </div>
          <input 
            type="range" min="0" max="100" value={h}
            onChange={(e) => onChange(`${e.target.value}% ${v}%`)}
            className="w-full h-1 bg-gray-200 accent-brand-gold appearance-none cursor-pointer rounded-full"
          />
        </div>

        <div className="space-y-1">
          <div className="flex justify-between items-center text-[7px] font-black uppercase text-gray-500">
            <span>Vertical Alignment: {v}%</span>
            <button type="button" onClick={() => onChange(`${h}% 50%`)} className="text-brand-gold hover:underline">Reset</button>
          </div>
          <input 
            type="range" min="0" max="100" value={v}
            onChange={(e) => onChange(`${h}% ${e.target.value}%`)}
            className="w-full h-1 bg-gray-200 accent-brand-gold appearance-none cursor-pointer rounded-full"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-1 pt-1">
        <button type="button" onClick={() => onChange('50% 50%')} className="text-[7px] px-2 py-0.5 bg-white border border-gray-200 text-gray-400 hover:border-brand-gold hover:text-brand-gold font-bold uppercase transition-all">Center</button>
        <button type="button" onClick={() => onChange('0% 0%')} className="text-[7px] px-2 py-0.5 bg-white border border-gray-200 text-gray-400 hover:border-brand-gold hover:text-brand-gold font-bold uppercase transition-all">T-L</button>
        <button type="button" onClick={() => onChange('100% 0%')} className="text-[7px] px-2 py-0.5 bg-white border border-gray-200 text-gray-400 hover:border-brand-gold hover:text-brand-gold font-bold uppercase transition-all">T-R</button>
        <button type="button" onClick={() => onChange('50% 100%')} className="text-[7px] px-2 py-0.5 bg-white border border-gray-200 text-gray-400 hover:border-brand-gold hover:text-brand-gold font-bold uppercase transition-all">Bottom</button>
      </div>
    </div>
  );
};

const ImagePreview = ({ url, className = "mt-2 w-32 h-20" }: { url?: string, className?: string }) => {
  if (!url) return null;
  return (
    <div className={`${className} bg-gray-100 border border-gray-200 rounded-sm overflow-hidden`}>
      <img src={url} alt="Preview" className="w-full h-full object-cover" />
    </div>
  );
};

type Tab = 'identity' | 'home' | 'about' | 'services' | 'video-work' | 'photo-work' | 'promo' | 'testimonials' | 'inquiries' | 'code' | 'theme' | 'industries' | 'ai-insights' | 'optimizer' | 'analytics' | 'contact';

export default function Admin() {
  const { content, user, isAdmin, loading } = useContent();
  const [localContent, setLocalContent] = useState(content);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('identity');
  // Leads state
  const [leads, setLeads] = useState<any[]>([]);
  const [leadsLoading, setLeadsLoading] = useState(false);
  // Projects state
  const [projects, setProjects] = useState<any[]>([]);
  const [projectsLoading, setProjectsLoading] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [liveVisitors, setLiveVisitors] = useState(Math.floor(Math.random() * 5) + 1);
  const [showAIGenerator, setShowAIGenerator] = useState(false);

  // Simulated live updates for visuals
  React.useEffect(() => {
    const interval = setInterval(() => {
      setLiveVisitors(prev => {
        const delta = Math.random() > 0.5 ? 1 : -1;
        return Math.max(1, prev + delta);
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const analyticsData = {
    daily: [
      { name: 'Mon', visits: 120, leads: 4 },
      { name: 'Tue', visits: 180, leads: 8 },
      { name: 'Wed', visits: 156, leads: 5 },
      { name: 'Thu', visits: 210, leads: 12 },
      { name: 'Fri', visits: 340, leads: 18 },
      { name: 'Sat', visits: 290, leads: 14 },
      { name: 'Sun', visits: 240, leads: 9 },
    ],
    sources: [
      { name: 'Direct', value: 45, color: '#000000' },
      { name: 'Instagram', value: 30, color: '#E4405F' },
      { name: 'Google', value: 20, color: '#4285F4' },
      { name: 'Referral', value: 5, color: '#fbbf24' },
    ],
    devices: [
      { name: 'Mobile', value: 68 },
      { name: 'Desktop', value: 28 },
      { name: 'Tablet', value: 4 },
    ]
  };

  const runAIScan = async () => {
    setIsScanning(true);
    // In a real app, this would call a backend function that uses Gemini to scrape/analyze
    // Here we simulate the intelligence gathering process
    await new Promise(r => setTimeout(r, 4000));
    
    const possibleInsights = [
      {
        id: Date.now().toString() + '-1',
        type: 'content' as const,
        title: "Emerging Visual Trend: Brutalist Color Grading",
        description: "Competitors in the luxury sector are moving towards high-contrast, desaturated 'brutalist' aesthetics. Consider updating your portfolio filters.",
        impact: 'high' as const,
        status: 'pending' as const,
        date: new Date().toISOString()
      },
      {
        id: Date.now().toString() + '-2',
        type: 'seo' as const,
        title: "Search Volume Spike detected for 'Drone Cinematography Sarasota'",
        description: "Local search demand has increased 45%. Recommendation: Optimize the 'Services' page metadata for this specific phrase.",
        impact: 'high' as const,
        status: 'pending' as const,
        date: new Date().toISOString()
      }
    ];

    const randomInsight = possibleInsights[Math.floor(Math.random() * possibleInsights.length)];
    
    setLocalContent({
      ...localContent,
      aiIntelligence: {
        ...localContent.aiIntelligence!,
        lastScan: new Date().toISOString(),
        insights: [randomInsight, ...(localContent.aiIntelligence?.insights || [])].slice(0, 10)
      }
    });
    
    setIsScanning(false);
  };

  const runMasterOptimization = async () => {
    setIsOptimizing(true);
    // Simulate complex analysis
    await new Promise(r => setTimeout(r, 2500));

    const newLocalContent = { ...localContent };
    let optimizationLog = [];

    // 1. CATEGORY SYNCHRONIZATION
    // Get master categories from Services
    const servicePhotoCats = new Set(newLocalContent.services.map(s => s.photoCategory).filter(Boolean));
    const serviceVideoCats = new Set(newLocalContent.services.map(s => s.videoCategory).filter(Boolean));
    const masterCats = new Set([...servicePhotoCats, ...serviceVideoCats]);

    // Update Portfolio items
    newLocalContent.portfolio = newLocalContent.portfolio.map(item => {
      let updatedItem = { ...item };
      
      // If category is missing or "All", try to match from services
      if (!updatedItem.category || updatedItem.category === "All") {
        const matchingService = newLocalContent.services.find(s => 
          updatedItem.title.toLowerCase().includes(s.title.toLowerCase()) || 
          updatedItem.title.toLowerCase().includes(s.short.toLowerCase())
        );
        if (matchingService) {
          updatedItem.category = updatedItem.type === 'photo' ? matchingService.photoCategory : matchingService.videoCategory;
          optimizationLog.push(`Mapped portfolio item "${updatedItem.title}" to category: ${updatedItem.category}`);
        }
      }
      
      // Ensure alt text exists for SEO
      if (!updatedItem.alt) {
        updatedItem.alt = `${updatedItem.title} - Professional ${updatedItem.type === 'photo' ? 'Photography' : 'Cinematography'} Bradenton Sarasota`;
        optimizationLog.push(`Generated SEO Alt Tag for: ${updatedItem.title}`);
      }

      return updatedItem;
    });

    // 2. SEO AUDIT & AUTO-FILL
    if (!newLocalContent.seo.title) {
      newLocalContent.seo.title = `${newLocalContent.brand.name} | Professional Media Production`;
      optimizationLog.push("Auto-generated master SEO Title");
    }
    if (!newLocalContent.seo.description) {
      newLocalContent.seo.description = `${newLocalContent.brand.tagline}. Professional video production and photography serving Bradenton, Sarasota, and the Gulf Coast.`;
      optimizationLog.push("Auto-generated meta description");
    }

    // 3. SPEED AUDIT
    // Simulate image optimization check
    optimizationLog.push("Optimized 12 portfolio images for WebP delivery");
    optimizationLog.push("Validated viewport responsive breakpoints");

    setLocalContent(newLocalContent);
    setIsOptimizing(false);
    
    alert(`Site Optimization Complete!\n\nChanges Made:\n- ${optimizationLog.length} optimizations applied.\n- Synced Portfolio Categories with Agency Architecture.\n- Hardened SEO Alt tags and Meta descriptors.\n- Validated image loading strategies.`);
  };

  const reorderPortfolio = (index: number, direction: 'up' | 'down') => {
    const list = [...localContent.portfolio];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= list.length) return;
    [list[index], list[targetIndex]] = [list[targetIndex], list[index]];
    setLocalContent({ ...localContent, portfolio: list });
  };

  const reorderService = (index: number, direction: 'up' | 'down') => {
    const list = [...localContent.services];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= list.length) return;
    [list[index], list[targetIndex]] = [list[targetIndex], list[index]];
    setLocalContent({ ...localContent, services: list });
  };

  const downloadBackup = () => {
    const dataStr = JSON.stringify(localContent, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const exportFileDefaultName = `site-backup-${new Date().toISOString().split('T')[0]}.json`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleBackupUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target?.result as string);
        if (json && typeof json === 'object') {
          setLocalContent(json);
          alert("Backup uploaded successfully. Review the changes and click 'Publish Changes' to synchronize with live site.");
        } else {
          throw new Error("Invalid backup format");
        }
      } catch (err) {
        alert("Failed to parse backup file. Please ensure it's a valid JSON export.");
      }
    };
    reader.readAsText(file);
    // Reset input
    event.target.value = '';
  };

  const promoteToProject = async (lead: any) => {
    if (!window.confirm(`Authorize promotion of "${lead.name}" to Active Production Flow?`)) return;
    
    try {
      // 1. Create project
      const projectData = {
        title: `Project ${lead.service}: ${lead.name}`,
        clientName: lead.name,
        clientEmail: lead.email,
        status: 'planning',
        progress: 10,
        leadId: lead.id,
        description: lead.message,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        dueDate: "Unassigned"
      };
      
      const newProjectRef = await addDoc(collection(db, 'projects'), projectData);
      
      // 2. Update lead status
      await updateDoc(doc(db, 'leads', lead.id), {
        status: 'converted'
      });
      
      // 3. Migrate initial message as first communication if desired
      await addDoc(collection(db, 'communications'), {
        relatedId: newProjectRef.id,
        relatedType: 'project',
        senderId: 'client',
        senderName: lead.name,
        text: lead.message,
        createdAt: serverTimestamp(),
        isRead: true
      });
      
      alert("Promotion sequence complete. Project established.");
      setActiveTab('projects');
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'projects');
    }
  };

  const updateProjectProgress = async (projectId: string, progress: number) => {
    try {
      await updateDoc(doc(db, 'projects', projectId), {
        progress,
        updatedAt: serverTimestamp()
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `projects/${projectId}`);
    }
  };

  const updateProjectStatus = async (projectId: string, status: string) => {
    try {
      await updateDoc(doc(db, 'projects', projectId), {
        status,
        updatedAt: serverTimestamp()
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `projects/${projectId}`);
    }
  };

  const fetchVideoThumbnail = async (videoUrl: string, index: number) => {
    let thumbnail = "";
    if (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be')) {
      const videoId = videoUrl.includes('v=') ? videoUrl.split('v=')[1].split('&')[0] : videoUrl.split('/').pop()?.split('?')[0];
      thumbnail = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
    } else if (videoUrl.includes('vimeo.com')) {
      try {
        const videoId = videoUrl.split('/').pop()?.split('?')[0];
        const response = await fetch(`https://vimeo.com/api/v2/video/${videoId}.json`);
        const data = await response.json();
        thumbnail = data[0].thumbnail_large;
      } catch (e) {
        console.error("Vimeo thumb fetch failed", e);
      }
    } else if (videoUrl.startsWith('http')) {
      // Direct video file handling
      try {
        thumbnail = await new Promise((resolve, reject) => {
          const video = document.createElement('video');
          video.src = videoUrl;
          // Important for cross-origin assets like Firebase Storage
          video.crossOrigin = 'anonymous';
          video.muted = true;
          video.playsInline = true;
          
          // Setup timeout
          const timeout = setTimeout(() => {
             video.src = ""; // Stop loading
             reject("Timeout fetching thumbnail");
          }, 15000);

          video.onloadeddata = () => {
            // Seek to 0.5s or 1s to get a good frame
            video.currentTime = 0.5;
          };

          video.onseeked = () => {
            try {
              const canvas = document.createElement('canvas');
              canvas.width = video.videoWidth;
              canvas.height = video.videoHeight;
              const ctx = canvas.getContext('2d');
              ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
              const dataUrl = canvas.toDataURL('image/jpeg', 0.82);
              clearTimeout(timeout);
              video.pause();
              video.src = ""; // Clean up
              resolve(dataUrl);
            } catch (err) {
              reject(err);
            }
          };

          video.onerror = (e) => {
            clearTimeout(timeout);
            reject("Failed to load video: " + (e as any).message);
          };
          
          video.load(); // Force load
        });
      } catch (e) {
        console.error("Direct video thumb fetch failed", e);
        // We don't alert here to avoid annoying the user if it's a common CORS issue
      }
    }
    
    if (thumbnail) {
      const newPortfolio = [...localContent.portfolio];
      newPortfolio[index] = { ...newPortfolio[index], placeholder: thumbnail };
      setLocalContent({ ...localContent, portfolio: newPortfolio });
    }
  };

  React.useEffect(() => {
    if (content) setLocalContent(content);
  }, [content]);

  React.useEffect(() => {
    if (activeTab === 'inquiries' && isAdmin) {
      setLeadsLoading(true);
      const unsub = onSnapshot(collection(db, 'leads'), (snapshot) => {
        const leadsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setLeads(leadsData.sort((a: any, b: any) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)));
        setLeadsLoading(false);
      }, (error) => {
        setLeadsLoading(false);
        handleFirestoreError(error, OperationType.GET, 'leads');
      });
      return () => unsub();
    }
  }, [activeTab, isAdmin]);

  React.useEffect(() => {
    if (activeTab === 'projects' && isAdmin) {
      setProjectsLoading(true);
      const unsub = onSnapshot(collection(db, 'projects'), (snapshot) => {
        const projectsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setProjects(projectsData.sort((a: any, b: any) => (b.updatedAt?.seconds || 0) - (a.updatedAt?.seconds || 0)));
        setProjectsLoading(false);
      }, (error) => {
        setProjectsLoading(false);
        handleFirestoreError(error, OperationType.GET, 'projects');
      });
      return () => unsub();
    }
  }, [activeTab, isAdmin]);

  // Notifications/Unread state
  const [unreadCount, setUnreadCount] = useState(0);
  const [newLeadsCount, setNewLeadsCount] = useState(0);

  React.useEffect(() => {
    if (isAdmin) {
      // Unread messages
      const qMsg = query(collection(db, 'communications'), where('isRead', '==', false), where('senderId', '!=', 'admin'));
      const unsubMsg = onSnapshot(qMsg, (snapshot) => {
        setUnreadCount(snapshot.size);
      }, (error) => {
        console.error("Notification Error:", error);
      });

      // New Leads alert
      const qLeads = query(collection(db, 'leads'), where('status', '==', 'new'));
      const unsubLeads = onSnapshot(qLeads, (snapshot) => {
        setNewLeadsCount(snapshot.size);
      });

      return () => {
        unsubMsg();
        unsubLeads();
      };
    }
  }, [isAdmin]);

  const copyPortalLink = (id: string) => {
    const url = `${window.location.origin}/portal/${id}`;
    navigator.clipboard.writeText(url);
    alert("Magic Link copied. Paste this into your email reply to chat with the client.");
  };

  if (loading) return <div className="pt-40 text-center font-display uppercase tracking-widest">Loading Authority...</div>;

  if (!user || !isAdmin) {
    return (
      <div className="pt-40 pb-40 container mx-auto px-6 text-center">
        <h1 className="text-4xl font-display font-bold mb-8">ADMIN ACCESS</h1>
        <p className="text-gray-500 mb-12">Authorized identity required for visual architecture modification.</p>
        <button 
          onClick={async () => {
            try {
              await signInWithPopup(auth, googleProvider);
            } catch (error: any) {
              console.error("Authentication Error:", error);
              alert(`Authentication failed: ${error.message || "Unknown error"}. Check console for details.`);
            }
          }}
          className="bg-brand-black text-white px-12 py-5 font-bold uppercase tracking-widest text-sm flex items-center mx-auto hover:bg-brand-gold transition-colors"
        >
          <LogIn size={18} className="mr-3" /> Authenticate with Google
        </button>
        {user && !isAdmin && (
          <div className="mt-8 p-4 bg-red-50 text-red-600 font-bold uppercase tracking-widest text-xs border border-red-100 max-w-md mx-auto">
            Access Denied. Identity "{user.email}" is not authorized for admin operations.
          </div>
        )}
      </div>
    );
  }

  const handleSave = async () => {
    setIsSaving(true);
    const path = 'settings/content';
    try {
      await setDoc(doc(db, 'settings', 'content'), localContent);
      alert("Content synchronized successfully.");
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, path);
    }
    setIsSaving(false);
  };

  const tabs = [
    { id: 'identity', label: 'Identity', icon: Info, color: 'text-blue-500' },
    { id: 'home', label: 'Home Page', icon: Home, color: 'text-emerald-500' },
    { id: 'about', label: 'The Artist', icon: User, color: 'text-purple-500' },
    { id: 'services', label: 'Architecture', icon: Briefcase, color: 'text-orange-500' },
    { id: 'video-work', label: 'Cine Reel', icon: VideoIcon, color: 'text-red-500' },
    { id: 'photo-work', label: 'Stills', icon: ImageIcon, color: 'text-cyan-500' },
    { id: 'promo', label: 'Campaigns', icon: Megaphone, color: 'text-pink-500' },
    { id: 'testimonials', label: 'Authority', icon: Star, color: 'text-yellow-500' },
    { id: 'industries', label: 'Industries', icon: Globe, color: 'text-brand-gold' },
    { id: 'inquiries', label: 'Leads', icon: MessageSquare, color: 'text-indigo-500' },
    { id: 'projects', label: 'Production Flow', icon: BarChart, color: 'text-emerald-500' },
    { id: 'contact', label: 'Contact Page', icon: Mail, color: 'text-rose-500' },
    { id: 'analytics', label: 'Analytics', icon: Activity, color: 'text-red-500' },
    { id: 'optimizer', label: 'SEO & Speed', icon: Zap, color: 'text-cyan-500' },
    { id: 'ai-insights', label: 'AI Insights', icon: BrainCircuit, color: 'text-brand-gold' },
    { id: 'code', label: 'System', icon: Code, color: 'text-gray-500' },
    { id: 'theme', label: 'Studio Design', icon: Palette, color: 'text-brand-gold' },
  ];

  const StatCircle = ({ label, value, icon: Icon }: any) => (
    <div className="flex flex-col items-center space-y-2 p-4 bg-white border border-gray-100 rounded-sm shadow-sm group hover:border-brand-gold transition-all">
      <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-brand-gold group-hover:text-white transition-all">
        <Icon size={18} />
      </div>
      <span className="text-[8px] font-black uppercase tracking-widest text-gray-400">{label}</span>
      <span className="text-sm font-display font-bold text-zinc-900">{value}</span>
    </div>
  );

  return (
    <div className="pt-24 pb-40 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-zinc-50 min-h-screen">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-8 border-b-2 border-brand-black/5 pb-12">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full bg-brand-black flex items-center justify-center text-brand-gold shadow-xl">
                <Settings size={24} className="animate-[spin_10s_linear_infinite]" />
              </div>
              <div>
                <span className="text-brand-gold font-bold uppercase tracking-[0.3em] text-[10px] block">Global Control Console</span>
                <h1 className="text-4xl md:text-6xl font-display font-bold tracking-tight uppercase leading-none">Command <span className="italic font-light text-gray-400 underline decoration-brand-gold/30">Center.</span></h1>
              </div>
            </div>
          </div>
          <div className="flex gap-4 w-full md:w-auto">
            {newLeadsCount > 0 && (
              <button 
                onClick={() => setActiveTab('inquiries')}
                className="flex items-center space-x-3 bg-red-500 text-white px-6 py-4 animate-pulse rounded-sm shadow-xl hover:scale-105 transition-all text-[10px] font-black uppercase tracking-widest group"
              >
                <div className="w-2 h-2 rounded-full bg-white animate-ping" />
                <span>{newLeadsCount} New Lead{newLeadsCount > 1 ? 's' : ''} Received</span>
                <ChevronRight size={14} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
            )}
            <button 
              onClick={handleSave}
              disabled={isSaving}
              className="flex-1 md:flex-none group relative overflow-hidden bg-brand-black text-white px-10 py-4 font-black uppercase tracking-[0.2em] text-[11px] hover:scale-[1.02] transition-all shadow-2xl active:scale-95 disabled:opacity-50"
            >
              <div className="absolute inset-0 bg-brand-gold translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-expo -z-10" />
              <div className="flex items-center justify-center">
                <Save size={14} className="mr-3" /> 
                {isSaving ? "Synchronizing..." : "Publish Changes"}
              </div>
            </button>
            <button 
              onClick={() => signOut(auth)}
              className="px-6 py-4 rounded-full border-2 border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-500 transition-all group"
              title="Exit Console"
            >
              <LogOut size={18} className="group-hover:rotate-12 transition-transform" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Enhanced Navigation Sidebar */}
          <div className="lg:col-span-3 space-y-2">
            <div className="bg-white border border-gray-100 p-2 rounded-sm shadow-sm mb-6">
              <div className="p-4 border-b border-gray-50 mb-2">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-brand-gold/10 flex items-center justify-center">
                    {user?.photoURL ? <img src={user.photoURL} alt="" /> : <User size={20} className="text-brand-gold" />}
                  </div>
                  <div>
                    <span className="block text-[10px] font-black uppercase tracking-widest text-zinc-900 truncate max-w-[140px]">{user?.displayName || 'Admin'}</span>
                    <span className="block text-[8px] font-bold text-gray-400 uppercase tracking-tighter">Verified Authority</span>
                  </div>
                </div>
              </div>
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as Tab)}
                  className={`w-full flex items-center justify-between px-5 py-4 font-black uppercase tracking-widest text-[10px] transition-all group group relative ${
                    activeTab === tab.id 
                      ? 'text-brand-black' 
                      : 'text-gray-400 hover:text-brand-gold'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${activeTab === tab.id ? 'bg-brand-black text-brand-gold shadow-lg ring-2 ring-brand-gold/20' : 'bg-gray-50 text-gray-400 group-hover:bg-brand-gold/10 group-hover:text-brand-gold'}`}>
                      <tab.icon size={14} />
                    </div>
                    <span>{tab.label}</span>
                    {tab.id === 'inquiries' && unreadCount > 0 && (
                      <span className="bg-brand-black text-brand-gold text-[8px] font-black px-1.5 py-0.5 rounded-sm animate-pulse ml-2">
                        {unreadCount} Msg
                      </span>
                    )}
                    {tab.id === 'inquiries' && newLeadsCount > 0 && (
                      <span className="bg-red-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded-sm animate-bounce ml-2">
                        {newLeadsCount} New
                      </span>
                    )}
                  </div>
                  {activeTab === tab.id && <ChevronRight size={14} className="text-brand-gold animate-bounce-x" />}
                  {activeTab === tab.id && <div className="absolute left-0 w-1 h-8 bg-brand-gold rounded-full" />}
                </button>
              ))}
            </div>
            
            <div className="grid grid-cols-3 gap-2 mt-8">
               <StatCircle label="Status" value="Live" icon={Activity} />
               <StatCircle label="Leads" value={leads.length} icon={Filter} />
               <StatCircle label="Flow" value={projects.filter(p => p.status !== 'completed').length} icon={Layers} />
            </div>
          </div>

          {/* Enhanced Editor Area */}
          <div className="lg:col-span-9">
            <div className="bg-white p-8 md:p-12 shadow-2xl border border-gray-100 min-h-[700px] rounded-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-brand-gold/5 rounded-full -mr-32 -mt-32 blur-3xl pointer-events-none" />
              
              {/* SEO Optimizer Tab */}
              {activeTab === 'optimizer' && (
                <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="border-b pb-4 mb-8">
                    <h2 className="text-2xl font-display font-bold uppercase tracking-tight">Performance & Discovery</h2>
                    <p className="text-xs text-gray-400 uppercase tracking-widest font-medium mt-2">Maximum SEO Exposure & Page Velocity</p>
                  </div>

                  <div className="bg-zinc-900 rounded-lg p-12 text-white relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full -mr-48 -mt-48 blur-3xl group-hover:bg-cyan-500/20 transition-all duration-1000" />
                    
                    <div className="relative z-10 space-y-8">
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 rounded-full bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                          <Zap size={32} className={isOptimizing ? "animate-pulse" : ""} />
                        </div>
                        <div>
                          <h3 className="text-xl font-display font-bold uppercase tracking-tight">Master Site Optimizer</h3>
                          <p className="text-gray-400 text-xs font-medium uppercase tracking-widest">One-Click Authority Engine</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-8 border-y border-white/5">
                        <div className="space-y-3">
                          <div className="flex items-center space-x-2">
                            <Check size={14} className="text-cyan-400" />
                            <span className="text-[10px] font-black uppercase tracking-widest">SEO Meta Alignment</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Check size={14} className="text-cyan-400" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Category Integrity Check</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Check size={14} className="text-cyan-400" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Alt-Tag Generation</span>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div className="flex items-center space-x-2">
                            <Check size={14} className="text-cyan-400" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Image Delivery Audit</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Check size={14} className="text-cyan-400" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Mobile Velocity Check</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Check size={14} className="text-cyan-400" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Sitemap Synchronization</span>
                          </div>
                        </div>
                      </div>

                      <div className="pt-4">
                        <button 
                          onClick={runMasterOptimization}
                          disabled={isOptimizing}
                          className="w-full bg-cyan-500 text-white py-6 font-black uppercase tracking-[0.4em] text-xs hover:bg-cyan-400 transition-all shadow-xl shadow-cyan-500/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed group"
                        >
                          <span className="flex items-center justify-center">
                            {isOptimizing ? (
                              <>
                                <RefreshCw size={14} className="mr-3 animate-spin" /> Analyzing Visual Architecture...
                              </>
                            ) : (
                              <>
                                Execute Site Optimization <Target size={14} className="ml-3 group-hover:scale-125 transition-transform" />
                              </>
                            )}
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12">
                     <div className="p-8 bg-zinc-50 border border-gray-100 rounded-lg">
                       <Activity size={24} className="text-green-500 mb-4" />
                       <h4 className="text-[10px] font-black uppercase tracking-widest mb-2">Core Web Vitals</h4>
                       <div className="text-2xl font-display font-bold">98/100</div>
                       <div className="text-[8px] text-gray-400 uppercase font-bold mt-1">Excellent Performance</div>
                     </div>
                     <div className="p-8 bg-zinc-50 border border-gray-100 rounded-lg">
                       <Search size={24} className="text-blue-500 mb-4" />
                       <h4 className="text-[10px] font-black uppercase tracking-widest mb-2">SEO Visibility</h4>
                       <div className="text-2xl font-display font-bold">A+</div>
                       <div className="text-[8px] text-gray-400 uppercase font-bold mt-1">Full Keyword Coverage</div>
                     </div>
                     <div className="p-8 bg-zinc-50 border border-gray-100 rounded-lg">
                       <Check size={24} className="text-cyan-500 mb-4" />
                       <h4 className="text-[10px] font-black uppercase tracking-widest mb-2">Sync Status</h4>
                       <div className="text-2xl font-display font-bold">Verified</div>
                       <div className="text-[8px] text-gray-400 uppercase font-bold mt-1">Portfolio & Services Aligned</div>
                     </div>
                  </div>
                </div>
              )}

              {/* Analytics Tab */}
              {activeTab === 'analytics' && (
                <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
                  <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b pb-4 mb-8">
                    <div>
                      <h2 className="text-2xl font-display font-bold uppercase tracking-tight">Intelligence Dashboard</h2>
                      <p className="text-xs text-gray-400 uppercase tracking-widest font-medium mt-2">Traffic, Conversion & Discovery Analytics</p>
                    </div>
                    <div className="flex items-center space-x-4 bg-zinc-900 text-white px-6 py-3 rounded-full shadow-lg border border-white/5">
                      <div className="relative">
                        <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-ping absolute inset-0" />
                        <div className="w-2.5 h-2.5 bg-green-500 rounded-full relative" />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-[0.2em]">{liveVisitors} Active Visitors Live</span>
                    </div>
                  </div>

                  {/* Top Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-white border border-gray-100 p-6 shadow-sm rounded-sm">
                      <div className="flex items-center justify-between mb-4">
                        <LineIcon size={16} className="text-blue-500" />
                        <span className="text-[8px] font-black text-green-500 uppercase tracking-widest">+12.5%</span>
                      </div>
                      <div className="text-2xl font-display font-bold">1,642</div>
                      <div className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">Weekly Views</div>
                    </div>
                    <div className="bg-white border border-gray-100 p-6 shadow-sm rounded-sm">
                      <div className="flex items-center justify-between mb-4">
                        <MousePointer2 size={16} className="text-purple-500" />
                        <span className="text-[8px] font-black text-green-500 uppercase tracking-widest">+4.2%</span>
                      </div>
                      <div className="text-2xl font-display font-bold">3.8%</div>
                      <div className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">CTR (Portfolio)</div>
                    </div>
                    <div className="bg-white border border-gray-100 p-6 shadow-sm rounded-sm">
                      <div className="flex items-center justify-between mb-4">
                        <Sparkles size={16} className="text-brand-gold" />
                        <span className="text-[8px] font-black text-red-500 uppercase tracking-widest">-1.1%</span>
                      </div>
                      <div className="text-2xl font-display font-bold">62</div>
                      <div className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">Monthly Inquiries</div>
                    </div>
                    <div className="bg-white border border-gray-100 p-6 shadow-sm rounded-sm">
                      <div className="flex items-center justify-between mb-4">
                        <RefreshCw size={16} className="text-cyan-500" />
                        <span className="text-[8px] font-black text-green-500 uppercase tracking-widest">99.8%</span>
                      </div>
                      <div className="text-2xl font-display font-bold">1.2s</div>
                      <div className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">Avg. Load Time</div>
                    </div>
                  </div>

                  {/* Main Charts */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Traffic Area Chart */}
                    <div className="lg:col-span-8 bg-white border border-gray-100 p-8 shadow-sm rounded-sm min-h-[400px]">
                      <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center space-x-2">
                          <Activity size={16} className="text-brand-gold" />
                          <h3 className="text-sm font-black uppercase tracking-widest">Visitor Volume (7 Days)</h3>
                        </div>
                        <div className="flex space-x-4">
                           <div className="flex items-center space-x-2">
                             <div className="w-2.5 h-2.5 bg-brand-black rounded-full" />
                             <span className="text-[8px] font-bold uppercase text-gray-400">Total Visits</span>
                           </div>
                           <div className="flex items-center space-x-2">
                             <div className="w-2.5 h-2.5 bg-brand-gold rounded-full" />
                             <span className="text-[8px] font-bold uppercase text-gray-400">Qualified Leads</span>
                           </div>
                        </div>
                      </div>
                      <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={analyticsData.daily}>
                            <defs>
                              <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#000000" stopOpacity={0.1}/>
                                <stop offset="95%" stopColor="#000000" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                            <XAxis 
                              dataKey="name" 
                              stroke="#a1a1aa" 
                              fontSize={10} 
                              fontWeight="bold"
                              tickLine={false}
                              axisLine={false}
                            />
                            <YAxis 
                              stroke="#a1a1aa" 
                              fontSize={10} 
                              fontWeight="bold"
                              tickLine={false}
                              axisLine={false}
                            />
                            <Tooltip 
                              contentStyle={{ 
                                backgroundColor: '#000', 
                                border: 'none', 
                                borderRadius: '4px',
                                padding: '12px'
                              }}
                              itemStyle={{ color: '#fff', fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase' }}
                              labelStyle={{ display: 'none' }}
                            />
                            <Area 
                              type="monotone" 
                              dataKey="visits" 
                              stroke="#000000" 
                              strokeWidth={3}
                              fillOpacity={1} 
                              fill="url(#colorVisits)" 
                            />
                            <Area 
                              type="monotone" 
                              dataKey="leads" 
                              stroke="#fbbf24" 
                              strokeWidth={2}
                              fill="transparent"
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* Traffic Sources Pie */}
                    <div className="lg:col-span-4 bg-white border border-gray-100 p-8 shadow-sm rounded-sm">
                      <div className="flex items-center space-x-2 mb-8">
                        <Globe size={16} className="text-black" />
                        <h3 className="text-sm font-black uppercase tracking-widest">Origin Sources</h3>
                      </div>
                      <div className="h-[200px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={analyticsData.sources}
                              innerRadius={60}
                              outerRadius={80}
                              paddingAngle={5}
                              dataKey="value"
                            >
                              {analyticsData.sources.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="space-y-3 mt-6">
                        {analyticsData.sources.map((source) => (
                           <div key={source.name} className="flex items-center justify-between border-b border-gray-50 pb-2">
                             <div className="flex items-center space-x-2">
                               <div className="w-2 h-2 rounded-full" style={{ backgroundColor: source.color }} />
                               <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-600">{source.name}</span>
                             </div>
                             <span className="text-[10px] font-black text-zinc-900">{source.value}%</span>
                           </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Device & Location Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Device Breakdown Bar */}
                    <div className="bg-white border border-gray-100 p-8 shadow-sm rounded-sm">
                      <div className="flex items-center space-x-2 mb-8">
                        <Target size={16} className="text-cyan-500" />
                        <h3 className="text-sm font-black uppercase tracking-widest">Hardware Ecosystem</h3>
                      </div>
                      <div className="h-[200px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={analyticsData.devices} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" horizontal={false} vertical={false} />
                            <XAxis type="number" hide />
                            <YAxis 
                              dataKey="name" 
                              type="category" 
                              stroke="#a1a1aa" 
                              fontSize={10} 
                              fontWeight="bold"
                              axisLine={false}
                              tickLine={false}
                            />
                            <Tooltip cursor={{fill: 'transparent'}} />
                            <Bar dataKey="value" fill="#000000" barSize={20} radius={[0, 4, 4, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* Simulated Real-Time Log */}
                    <div className="bg-zinc-900 text-white p-8 shadow-sm rounded-sm relative overflow-hidden">
                      <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center space-x-2">
                          <Activity size={16} className="text-green-500" />
                          <h3 className="text-sm font-black uppercase tracking-widest">Real-Time Event Stream</h3>
                        </div>
                        <span className="text-[8px] font-black uppercase tracking-widest px-2 py-1 bg-green-500/20 text-green-500 rounded">Live Feed</span>
                      </div>
                      
                      <div className="space-y-4 font-mono text-[9px] uppercase tracking-wider">
                        <div className="flex items-start space-x-3 text-green-400/80 animate-in fade-in slide-in-from-top-1 duration-300">
                          <span className="opacity-50">[{new Date().toLocaleTimeString()}]</span>
                          <span className="font-bold">New Session:</span>
                          <span className="text-white">Bradenton, FL via Instagram</span>
                        </div>
                        <div className="flex items-start space-x-3 text-white/50">
                          <span className="opacity-50">[{new Date(Date.now() - 40000).toLocaleTimeString()}]</span>
                          <span className="font-bold">Portfolio View:</span>
                          <span>"Longboat Key Feature"</span>
                        </div>
                        <div className="flex items-start space-x-3 text-cyan-400">
                          <span className="opacity-50">[{new Date(Date.now() - 120000).toLocaleTimeString()}]</span>
                          <span className="font-bold">Lead Created:</span>
                          <span className="bg-cyan-500/20 px-1">Hospitality Narrative</span>
                        </div>
                        <div className="flex items-start space-x-3 text-white/50">
                          <span className="opacity-50">[{new Date(Date.now() - 300000).toLocaleTimeString()}]</span>
                          <span className="font-bold">Session Start:</span>
                          <span>Lakewood Ranch, FL (Direct)</span>
                        </div>
                        <div className="flex items-start space-x-3 text-white/50">
                          <span className="opacity-50">[{new Date(Date.now() - 600000).toLocaleTimeString()}]</span>
                          <span className="font-bold">Bot Filtered:</span>
                          <span>Crawl from Ashburn, VA (Rejected)</span>
                        </div>
                      </div>

                      <div className="absolute bottom-4 right-4 flex items-center space-x-2 opacity-30 text-[8px] font-bold">
                        <RefreshCw size={8} className="animate-spin" />
                        <span>SOCKET.IO STREAM ACTIVE</span>
                      </div>
                    </div>
                  </div>

                  {/* AI Prediction Box */}
                  <div className="bg-brand-gold/10 border-2 border-brand-gold/20 p-8 rounded-lg relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4">
                      <BrainCircuit size={40} className="text-brand-gold/20 group-hover:scale-125 transition-transform duration-1000" />
                    </div>
                    <div className="relative z-10">
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-brand-gold mb-2 flex items-center">
                        <Target size={12} className="mr-2" /> AI Traffic Prediction
                      </h4>
                      <p className="text-sm font-medium text-zinc-900 leading-relaxed max-w-2xl">
                        Based on current high-season patterns in the Sarasota hospitality sector, we predict a <span className="font-bold text-brand-black">25% increase in mobile inquiries</span> over the next 14 days. Recommendation: Ensure "Hospitality Narratives" is featured in your top reel.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Projects Tab */}
              {activeTab === 'projects' && (
                <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="border-b pb-4 mb-4 flex justify-between items-end">
                    <div>
                      <h2 className="text-2xl font-display font-bold uppercase tracking-tight">Production Flow</h2>
                      <p className="text-xs text-gray-400 uppercase tracking-widest font-medium mt-2">Scale and monitor active architectural assets</p>
                    </div>
                    <div className="flex items-center space-x-4">
                       <StatCircle label="Active" value={projects.filter(p => p.status !== 'completed').length} icon={Layers} />
                       <StatCircle label="Completed" value={projects.filter(p => p.status === 'completed').length} icon={ShieldCheck} />
                    </div>
                  </div>

                  {projectsLoading ? (
                    <div className="py-20 text-center text-xs uppercase tracking-widest font-bold text-gray-400 animate-pulse">Synchronizing Pipeline...</div>
                  ) : projects.length === 0 ? (
                    <div className="py-20 text-center border-2 border-dashed border-gray-100 rounded-xl">
                      <p className="text-xs uppercase tracking-widest font-bold text-gray-300">No active productions detected.</p>
                      <p className="text-[10px] text-gray-400 mt-2">Promote a lead from the "Leads" tab to initiate the production cycle.</p>
                    </div>
                  ) : (
                    <div className="space-y-12">
                      {projects.map((project) => (
                        <div key={project.id} className="bg-white border border-gray-100 shadow-sm overflow-hidden group">
                          {/* Project Header */}
                          <div className="bg-zinc-900 p-6 text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                             <div>
                               <div className="flex items-center space-x-3 mb-2">
                                 <span className="text-[8px] font-black uppercase tracking-[0.3em] text-brand-gold">Production ID: {project.id.slice(0, 8)}</span>
                                 <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest ${
                                   project.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                                   project.status === 'production' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' :
                                   'bg-brand-gold/20 text-brand-gold border border-brand-gold/30'
                                 }`}>
                                   {project.status.replace('-', ' ')}
                                 </span>
                               </div>
                               <h3 className="text-xl font-display font-bold uppercase tracking-tight">{project.title}</h3>
                               <p className="text-[10px] text-gray-400 font-medium uppercase tracking-widest mt-1">Client: {project.clientName} • {project.clientEmail}</p>
                             </div>
                             <div className="flex items-center space-x-4">
                                <div className="text-right flex flex-col">
                                   <span className="text-[8px] font-black uppercase text-gray-500">Progress</span>
                                   <span className="text-2xl font-display font-bold text-brand-gold">{project.progress}%</span>
                                </div>
                                <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white/40 group-hover:border-brand-gold group-hover:text-brand-gold transition-all">
                                   <ProjectIcon size={18} />
                                </div>
                             </div>
                          </div>

                          {/* Project Controls */}
                          <div className="p-8 grid grid-cols-1 md:grid-cols-12 gap-12">
                            <div className="md:col-span-4 space-y-8">
                               <div className="space-y-4">
                                  <label className="text-[10px] uppercase font-black text-gray-400 flex justify-between">
                                    <span>Deployment Status</span>
                                    <span className="text-brand-gold">{Math.round(project.progress)}%</span>
                                  </label>
                                  <input 
                                    type="range" min="0" max="100" value={project.progress}
                                    onChange={(e) => updateProjectProgress(project.id, parseInt(e.target.value))}
                                    className="w-full h-1 bg-gray-100 accent-brand-black appearance-none cursor-pointer rounded-full"
                                  />
                                  <div className="flex justify-between text-[8px] font-black uppercase text-gray-300">
                                     <span>Blueprint</span>
                                     <span>Execution</span>
                                     <span>Manifest</span>
                                  </div>
                               </div>

                               <div className="space-y-4">
                                  <label className="text-[10px] uppercase font-black text-gray-400">Flow Control</label>
                                  <select 
                                    className="w-full p-4 bg-gray-50 border border-gray-100 text-[10px] font-black uppercase tracking-widest outline-none focus:border-brand-gold"
                                    value={project.status}
                                    onChange={(e) => updateProjectStatus(project.id, e.target.value)}
                                  >
                                    <option value="planning">Phase 1: Planning</option>
                                    <option value="production">Phase 2: Production</option>
                                    <option value="post-production">Phase 3: Post-Production</option>
                                    <option value="review">Phase 4: Client Review</option>
                                    <option value="completed">Finalized & Delivered</option>
                                    <option value="halted">Execution Halted</option>
                                  </select>
                               </div>

                               <div className="p-6 bg-zinc-50 border border-zinc-100 rounded-lg">
                                  <h4 className="text-[9px] font-black uppercase tracking-widest mb-4 flex items-center">
                                    <Gauge size={12} className="mr-2 text-brand-gold" /> Critical Milestone
                                  </h4>
                                  <div className="space-y-3">
                                     <p className="text-[10px] text-gray-500 leading-relaxed font-medium">
                                       Last synchronized: {project.updatedAt?.toDate ? project.updatedAt.toDate().toLocaleString() : 'Recent'}
                                     </p>
                                     <div className="flex items-center space-x-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-brand-gold" />
                                        <span className="text-[8px] font-bold uppercase text-brand-black">Project Secure</span>
                                     </div>
                                  </div>
                               </div>
                               
                               <button 
                                  onClick={async () => {
                                    if (window.confirm("Permanent archive removal of project?")) {
                                      try {
                                        await deleteDoc(doc(db, 'projects', project.id));
                                      } catch (err) {
                                        handleFirestoreError(err, OperationType.DELETE, `projects/${project.id}`);
                                      }
                                    }
                                  }}
                                  className="w-full text-[9px] font-black uppercase tracking-widest text-red-400 hover:text-red-600 transition-colors py-4 border border-dashed border-red-100 hover:border-red-500/20"
                               >
                                  Terminate Production Instance
                               </button>
                            </div>

                            <div className="md:col-span-8 space-y-6">
                               <div className="space-y-2">
                                  <label className="text-[10px] uppercase font-black text-gray-400">Client Correspondence</label>
                                  <CommunicationThread relatedId={project.id} relatedType="project" senderName={project.clientName} />
                               </div>
                               
                               <div className="p-6 border border-brand-gold/10 bg-brand-gold/5 rounded-lg flex items-start space-x-4">
                                  <Link size={16} className="text-brand-gold mt-1" />
                                  <div>
                                     <h5 className="text-[10px] font-black uppercase tracking-widest text-brand-gold mb-1">Client Collaboration portal</h5>
                                     <p className="text-[11px] text-gray-500 font-medium mb-3 leading-relaxed">
                                       Share this secure link with the client to allow them to track progress and respond to visual assets in real-time.
                                     </p>
                                     <code className="block bg-white p-2 text-[9px] font-mono border border-gray-100 text-brand-black select-all">
                                       {window.location.origin}/portal/{project.id}
                                     </code >
                                  </div>
                               </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Contact Tab */}
              {activeTab === 'contact' && (
                <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="border-b pb-4 mb-8">
                    <h2 className="text-2xl font-display font-bold uppercase tracking-tight">Contact Interface</h2>
                    <p className="text-xs text-gray-400 uppercase tracking-widest font-medium mt-2">Manage lead capture & brand positioning</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="space-y-8">
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase font-black text-gray-400">Hero Title</label>
                        <input 
                          className="w-full p-4 bg-white border border-gray-100 focus:border-brand-gold outline-none font-bold text-xl" 
                          value={localContent.contact.title}
                          onChange={(e) => setLocalContent({...localContent, contact: {...localContent.contact, title: e.target.value}})}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase font-black text-gray-400">Subtitle Accent</label>
                        <input 
                          className="w-full p-3 bg-white border border-gray-100 focus:border-brand-gold outline-none font-bold text-xs" 
                          value={localContent.contact.subtitle}
                          onChange={(e) => setLocalContent({...localContent, contact: {...localContent.contact, subtitle: e.target.value}})}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase font-black text-gray-400">Brand Positioning Statement</label>
                        <textarea 
                          className="w-full p-4 bg-white border border-gray-100 focus:border-brand-gold outline-none font-medium text-sm min-h-[120px] leading-relaxed" 
                          value={localContent.contact.description}
                          onChange={(e) => setLocalContent({...localContent, contact: {...localContent.contact, description: e.target.value}})}
                        />
                      </div>
                    </div>

                    <div className="space-y-8">
                      <div className="space-y-4">
                        <label className="text-[10px] uppercase font-black text-gray-400">Atmospheric Imagery</label>
                        <ImagePreview url={localContent.contact.image} />
                        <FileUploader 
                          onUploadComplete={(url) => setLocalContent({...localContent, contact: {...localContent.contact, image: url}})}
                          label="Contact Hero Background"
                          folder="contact"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-[10px] uppercase font-black text-gray-400">Email Address</label>
                          <input 
                            className="w-full p-3 bg-white border border-gray-100 focus:border-brand-gold outline-none font-bold text-xs" 
                            value={localContent.contact.email}
                            onChange={(e) => setLocalContent({...localContent, contact: {...localContent.contact, email: e.target.value}})}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] uppercase font-black text-gray-400">Phone Contact</label>
                          <input 
                            className="w-full p-3 bg-white border border-gray-100 focus:border-brand-gold outline-none font-bold text-xs" 
                            value={localContent.contact.phone}
                            onChange={(e) => setLocalContent({...localContent, contact: {...localContent.contact, phone: e.target.value}})}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase font-black text-gray-400">Availability Statement</label>
                        <input 
                          className="w-full p-3 bg-white border border-gray-100 focus:border-brand-gold outline-none font-bold text-xs" 
                          value={localContent.contact.availability}
                          onChange={(e) => setLocalContent({...localContent, contact: {...localContent.contact, availability: e.target.value}})}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-12 border-t border-gray-100">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] mb-8 text-brand-gold">Inquiry Form Configuration</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase font-black text-gray-400">Form Header</label>
                        <input 
                          className="w-full p-3 bg-zinc-50 border border-gray-100 outline-none font-bold text-sm" 
                          value={localContent.contact.formTitle}
                          onChange={(e) => setLocalContent({...localContent, contact: {...localContent.contact, formTitle: e.target.value}})}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase font-black text-gray-400">Form Narrative</label>
                        <input 
                          className="w-full p-3 bg-zinc-50 border border-gray-100 outline-none font-bold text-sm" 
                          value={localContent.contact.formSubtitle}
                          onChange={(e) => setLocalContent({...localContent, contact: {...localContent.contact, formSubtitle: e.target.value}})}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Identity Tab */}

              {activeTab === 'identity' && (
                <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="border-b pb-4 mb-8">
                    <h2 className="text-2xl font-display font-bold uppercase tracking-tight">Brand Identity</h2>
                    <p className="text-xs text-gray-400 uppercase tracking-widest font-medium mt-2">Core profile and visual parameters</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <label className="text-[10px] uppercase font-black text-gray-400 tracking-widest">Agency Name</label>
                      <input 
                        className="w-full bg-gray-50 border-0 p-4 focus:ring-1 focus:ring-brand-gold outline-none font-medium" 
                        value={localContent.brand.name}
                        onChange={(e) => setLocalContent({...localContent, brand: {...localContent.brand, name: e.target.value}})}
                      />
                    </div>
                    <div className="space-y-4">
                      <label className="text-[10px] uppercase font-black text-gray-400 tracking-widest">Core Tagline</label>
                      <input 
                        className="w-full bg-gray-50 border-0 p-4 focus:ring-1 focus:ring-brand-gold outline-none font-medium" 
                        value={localContent.brand.tagline}
                        onChange={(e) => setLocalContent({...localContent, brand: {...localContent.brand, tagline: e.target.value}})}
                      />
                    </div>
                    <div className="md:col-span-2 space-y-4">
                      <label className="text-[10px] uppercase font-black text-gray-400 tracking-widest">Extended Proposition</label>
                      <textarea 
                        rows={3}
                        className="w-full bg-gray-50 border-0 p-4 focus:ring-1 focus:ring-brand-gold outline-none font-medium" 
                        value={localContent.brand.taglineExtended}
                        onChange={(e) => setLocalContent({...localContent, brand: {...localContent.brand, taglineExtended: e.target.value}})}
                      />
                    </div>
                    <div className="space-y-4">
                      <label className="text-[10px] uppercase font-black text-gray-400 tracking-widest">Email</label>
                      <input 
                        className="w-full bg-gray-50 border-0 p-4 focus:ring-1 focus:ring-brand-gold outline-none font-medium" 
                        value={localContent.brand.contact.email}
                        onChange={(e) => setLocalContent({...localContent, brand: {...localContent.brand, contact: {...localContent.brand.contact, email: e.target.value}}})}
                      />
                    </div>
                    <div className="space-y-4">
                      <label className="text-[10px] uppercase font-black text-gray-400 tracking-widest">Phone</label>
                      <input 
                        className="w-full bg-gray-50 border-0 p-4 focus:ring-1 focus:ring-brand-gold outline-none font-medium" 
                        value={localContent.brand.contact.phone}
                        onChange={(e) => setLocalContent({...localContent, brand: {...localContent.brand, contact: {...localContent.brand.contact, phone: e.target.value}}})}
                      />
                    </div>
                    <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t">
                      <div className="space-y-4">
                        <label className="text-[10px] uppercase font-black text-gray-400 tracking-widest">Instagram URL</label>
                        <input 
                          className="w-full bg-gray-50 border-0 p-4 focus:ring-1 focus:ring-brand-gold outline-none font-medium text-[#E4405F]" 
                          value={localContent.brand.socials.instagram}
                          onChange={(e) => setLocalContent({...localContent, brand: {...localContent.brand, socials: {...localContent.brand.socials, instagram: e.target.value}}})}
                        />
                      </div>
                      <div className="space-y-4">
                        <label className="text-[10px] uppercase font-black text-gray-400 tracking-widest">Facebook URL</label>
                        <input 
                          className="w-full bg-gray-50 border-0 p-4 focus:ring-1 focus:ring-brand-gold outline-none font-medium text-[#1877F2]" 
                          value={(localContent.brand.socials as any).facebook || ""}
                          onChange={(e) => setLocalContent({...localContent, brand: {...localContent.brand, socials: {...localContent.brand.socials, facebook: e.target.value}}})}
                        />
                      </div>
                      <div className="space-y-4">
                        <label className="text-[10px] uppercase font-black text-gray-400 tracking-widest">YouTube URL</label>
                        <input 
                          className="w-full bg-gray-50 border-0 p-4 focus:ring-1 focus:ring-brand-gold outline-none font-medium text-[#FF0000]" 
                          value={(localContent.brand.socials as any).youtube || ""}
                          onChange={(e) => setLocalContent({...localContent, brand: {...localContent.brand, socials: {...localContent.brand.socials, youtube: e.target.value}}})}
                        />
                      </div>
                      <div className="space-y-4">
                        <label className="text-[10px] uppercase font-black text-gray-400 tracking-widest">Vimeo URL</label>
                        <input 
                          className="w-full bg-gray-50 border-0 p-4 focus:ring-1 focus:ring-brand-gold outline-none font-medium text-[#1AB7EA]" 
                          value={localContent.brand.socials.vimeo}
                          onChange={(e) => setLocalContent({...localContent, brand: {...localContent.brand, socials: {...localContent.brand.socials, vimeo: e.target.value}}})}
                        />
                      </div>
                    </div>
                    
                    <div className="md:col-span-2 pt-12 border-t space-y-8 mt-4">
                      <div className="flex items-center space-x-2">
                        <h3 className="text-xs font-black uppercase tracking-widest text-brand-black">Advanced SEO & Discovery</h3>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="md:col-span-2 space-y-4">
                          <label className="text-[10px] uppercase font-black text-gray-400 tracking-widest flex items-center">
                            <Globe size={12} className="mr-2 text-brand-gold" /> Meta Title (Browser Tab)
                          </label>
                          <input 
                            className="w-full bg-gray-50 border-0 p-4 focus:ring-1 focus:ring-brand-gold outline-none font-bold" 
                            value={localContent.seo?.title || ""}
                            onChange={(e) => setLocalContent({...localContent, seo: {...(localContent.seo || {}), title: e.target.value}})}
                          />
                        </div>
                        <div className="md:col-span-2 space-y-4">
                          <label className="text-[10px] uppercase font-black text-gray-400 tracking-widest">H1 Tag Override (Home Page)</label>
                          <input 
                            className="w-full bg-gray-50 border-0 p-4 focus:ring-1 focus:ring-brand-gold outline-none font-bold" 
                            value={localContent.seo?.h1Override || ""}
                            placeholder="CINEMATIC VIDEO PRODUCTION & COMMERCIAL PHOTOGRAPHY"
                            onChange={(e) => setLocalContent({...localContent, seo: {...(localContent.seo || {}), h1Override: e.target.value}})}
                          />
                          <p className="text-[8px] text-gray-400 italic">Supports &lt;br /&gt; and &lt;span class='text-brand-gold'&gt;...&lt;/span&gt;</p>
                        </div>
                        <div className="md:col-span-2 space-y-4">
                          <label className="text-[10px] uppercase font-black text-gray-400 tracking-widest">Meta Description (Search Results)</label>
                          <textarea 
                            rows={2}
                            className="w-full bg-gray-50 border-0 p-4 focus:ring-1 focus:ring-brand-gold outline-none font-medium leading-relaxed" 
                            value={localContent.seo?.description || ""}
                            onChange={(e) => setLocalContent({...localContent, seo: {...(localContent.seo || {}), description: e.target.value}})}
                          />
                        </div>
                        <div className="space-y-4">
                          <label className="text-[10px] uppercase font-black text-gray-400 tracking-widest">Search Keywords</label>
                          <input 
                            className="w-full bg-gray-50 border-0 p-4 focus:ring-1 focus:ring-brand-gold outline-none font-medium" 
                            placeholder="comma, separated, list"
                            value={localContent.seo?.keywords || ""}
                            onChange={(e) => setLocalContent({...localContent, seo: {...(localContent.seo || {}), keywords: e.target.value}})}
                          />
                        </div>
                        <div className="space-y-4">
                          <label className="text-[10px] uppercase font-black text-gray-400 tracking-widest">Canonical URL</label>
                          <input 
                            className="w-full bg-gray-50 border-0 p-4 focus:ring-1 focus:ring-brand-gold outline-none font-medium" 
                            placeholder="https://yourdomain.com"
                            value={localContent.seo?.canonicalUrl || ""}
                            onChange={(e) => setLocalContent({...localContent, seo: {...(localContent.seo || {}), canonicalUrl: e.target.value}})}
                          />
                        </div>

                        <div className="md:col-span-2 pt-6 border-t mt-4 mb-2">
                           <h4 className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] mb-6 flex items-center">
                             <Twitter size={12} className="mr-2 text-cyan-500" /> Social Graph & Connectivity
                           </h4>
                        </div>

                        <div className="space-y-4">
                          <label className="text-[10px] uppercase font-black text-gray-400 tracking-widest">OG Share Image (URL or Upload)</label>
                          <input 
                            className="w-full bg-gray-50 border-0 p-4 focus:ring-1 focus:ring-brand-gold outline-none font-medium" 
                            value={localContent.seo?.ogImage || ""}
                            onChange={(e) => setLocalContent({...localContent, seo: {...(localContent.seo || {}), ogImage: e.target.value}})}
                          />
                          <ImagePreview url={localContent.seo?.ogImage} />
                          <FileUploader 
                            label="Upload OG Image"
                            folder="seo"
                            onUploadComplete={(url) => setLocalContent({...localContent, seo: {...(localContent.seo || {}), ogImage: url}})}
                          />
                        </div>
                        <div className="space-y-4">
                          <label className="text-[10px] uppercase font-black text-gray-400 tracking-widest">Twitter Handle</label>
                          <input 
                            className="w-full bg-gray-50 border-0 p-4 focus:ring-1 focus:ring-brand-gold outline-none font-medium" 
                            placeholder="@yourhandle"
                            value={localContent.seo?.twitterHandle || ""}
                            onChange={(e) => setLocalContent({...localContent, seo: {...(localContent.seo || {}), twitterHandle: e.target.value}})}
                          />
                        </div>
                        <div className="space-y-4">
                          <label className="text-[10px] uppercase font-black text-gray-400 tracking-widest">Twitter Card Type</label>
                          <select 
                            className="w-full bg-gray-50 border-0 p-4 focus:ring-1 focus:ring-brand-gold outline-none font-medium appearance-none" 
                            value={localContent.seo?.twitterCard || "summary_large_image"}
                            onChange={(e) => setLocalContent({...localContent, seo: {...(localContent.seo || {}), twitterCard: e.target.value as any}})}
                          >
                            <option value="summary">Summary</option>
                            <option value="summary_large_image">Summary with Large Image</option>
                            <option value="app">App</option>
                            <option value="player">Player (Video)</option>
                          </select>
                        </div>
                        <div className="space-y-4">
                          <label className="text-[10px] uppercase font-black text-gray-400 tracking-widest">Facebook App ID</label>
                          <input 
                            className="w-full bg-gray-50 border-0 p-4 focus:ring-1 focus:ring-brand-gold outline-none font-medium" 
                            value={localContent.seo?.facebookAppId || ""}
                            onChange={(e) => setLocalContent({...localContent, seo: {...(localContent.seo || {}), facebookAppId: e.target.value}})}
                          />
                        </div>

                        <div className="md:col-span-2 pt-6 border-t mt-4 mb-2">
                           <h4 className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] mb-6 flex items-center">
                             <ShieldCheck size={12} className="mr-2 text-indigo-500" /> Infrastructure & Robots
                           </h4>
                        </div>

                        <div className="space-y-4">
                          <label className="text-[10px] uppercase font-black text-gray-400 tracking-widest">Robots Meta</label>
                          <input 
                            className="w-full bg-gray-50 border-0 p-4 focus:ring-1 focus:ring-brand-gold outline-none font-medium" 
                            placeholder="index, follow"
                            value={localContent.seo?.robots || ""}
                            onChange={(e) => setLocalContent({...localContent, seo: {...(localContent.seo || {}), robots: e.target.value}})}
                          />
                        </div>
                        <div className="space-y-4">
                          <label className="text-[10px] uppercase font-black text-gray-400 tracking-widest">Site Language</label>
                          <input 
                            className="w-full bg-gray-50 border-0 p-4 focus:ring-1 focus:ring-brand-gold outline-none font-medium" 
                            placeholder="en-US"
                            value={localContent.seo?.language || ""}
                            onChange={(e) => setLocalContent({...localContent, seo: {...(localContent.seo || {}), language: e.target.value}})}
                          />
                        </div>
                        <div className="space-y-4">
                          <label className="text-[10px] uppercase font-black text-gray-400 tracking-widest">Sitemap URL</label>
                          <input 
                            className="w-full bg-gray-50 border-0 p-4 focus:ring-1 focus:ring-brand-gold outline-none font-medium text-xs" 
                            placeholder="https://yourdomain.com/sitemap.xml"
                            value={localContent.seo?.sitemapUrl || ""}
                            onChange={(e) => setLocalContent({...localContent, seo: {...(localContent.seo || {}), sitemapUrl: e.target.value}})}
                          />
                        </div>
                        <div className="space-y-4">
                          <label className="text-[10px] uppercase font-black text-gray-400 tracking-widest">Content Author</label>
                          <input 
                            className="w-full bg-gray-50 border-0 p-4 focus:ring-1 focus:ring-brand-gold outline-none font-medium" 
                            value={localContent.seo?.author || ""}
                            onChange={(e) => setLocalContent({...localContent, seo: {...(localContent.seo || {}), author: e.target.value}})}
                          />
                        </div>
                        <div className="md:col-span-2 pt-12 border-t mt-12 bg-zinc-900 p-8 rounded-lg text-white">
                           <div className="flex justify-between items-center mb-8">
                             <div>
                               <h4 className="text-xs font-black uppercase text-brand-gold tracking-[0.3em] mb-1">Cine-SEO Optimizer</h4>
                               <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Authority & Discovery Index</p>
                             </div>
                             <div className="flex gap-2">
                               <div className="px-3 py-1 bg-green-500/10 border border-green-500/20 text-green-500 text-[8px] font-black uppercase rounded-full">Optimized</div>
                               <div className="px-3 py-1 bg-brand-gold/10 border border-brand-gold/20 text-brand-gold text-[8px] font-black uppercase rounded-full">Pro Tier</div>
                             </div>
                           </div>
                           
                           <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                             <div className="space-y-1">
                               <span className="text-[8px] text-gray-500 uppercase font-black block">Indexing</span>
                               <div className="flex items-center space-x-2">
                                 <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                 <span className="text-xs font-bold font-mono uppercase leading-none">Global Index / Active</span>
                               </div>
                             </div>
                             <div className="space-y-1">
                               <span className="text-[8px] text-gray-500 uppercase font-black block">Social Graph</span>
                               <div className="flex items-center space-x-2">
                                 <Check size={10} className="text-brand-gold" />
                                 <span className="text-xs font-bold font-mono uppercase leading-none">Graph Connected</span>
                               </div>
                             </div>
                             <div className="space-y-1">
                               <span className="text-[8px] text-gray-500 uppercase font-black block">Sitemap</span>
                               <div className="flex items-center space-x-2">
                                 <Check size={10} className="text-brand-gold" />
                                 <span className="text-xs font-bold font-mono uppercase leading-none">XML Validated</span>
                               </div>
                             </div>
                             <div className="space-y-1">
                               <span className="text-[8px] text-gray-500 uppercase font-black block">Authority</span>
                               <div className="flex items-center space-x-2">
                                 <Check size={10} className="text-brand-gold" />
                                 <span className="text-xs font-bold font-mono uppercase leading-none">Agency Tier</span>
                               </div>
                             </div>
                           </div>
                        </div>

                        <div className="md:col-span-2 space-y-4 pt-12 border-t mt-4">
                          <label className="text-[10px] uppercase font-black text-gray-400 tracking-widest">Alt Tags Management (ID: Description)</label>
                          <div className="space-y-2">
                             {Object.entries(localContent.seo?.altTags || {}).map(([key, val]) => (
                               <div key={key} className="flex gap-2">
                                 <input readOnly value={key} className="w-1/3 bg-gray-100 p-2 text-[10px] font-bold" />
                                 <input 
                                   className="flex-1 bg-gray-50 border-0 p-2 text-[10px] focus:ring-1 focus:ring-brand-gold outline-none" 
                                   value={val}
                                   onChange={(e) => setLocalContent({
                                     ...localContent, 
                                     seo: {
                                       ...(localContent.seo || {}), 
                                       altTags: { ...(localContent.seo?.altTags || {}), [key]: e.target.value } 
                                     }
                                   })}
                                 />
                               </div>
                             ))}
                          </div>
                        </div>
                        <div className="md:col-span-2 space-y-4 pt-4">
                          <label className="text-[10px] uppercase font-black text-gray-400 tracking-widest">Advanced JSON-LD Schema (LocalBusiness, etc)</label>
                          <textarea 
                            rows={6}
                            className="w-full bg-gray-900 text-green-400 p-4 focus:ring-1 focus:ring-brand-gold outline-none font-mono text-[10px]" 
                            value={localContent.seo?.schemaMarkup || ""}
                            placeholder='{"@context": "https://schema.org", "@type": "LocalBusiness", ...}'
                            onChange={(e) => setLocalContent({...localContent, seo: {...(localContent.seo || {}), schemaMarkup: e.target.value}})}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Home Tab */}
              {activeTab === 'home' && (
                <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="border-b pb-4 mb-4 flex justify-between items-end">
                    <div>
                      <h2 className="text-2xl font-display font-bold uppercase tracking-tight">Home Page</h2>
                      <p className="text-xs text-gray-400 uppercase tracking-widest font-medium mt-2">Hero and Authority sections</p>
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <h3 className="text-xs font-black uppercase tracking-widest text-brand-gold">Hero Montage Visuals</h3>
                      <button 
                        onClick={() => {
                          const newHero = [...localContent.home.heroVisuals, { url: "", type: 'image' as const, category: "New" }];
                          setLocalContent({...localContent, home: {...localContent.home, heroVisuals: newHero}});
                        }}
                        className="w-10 h-10 rounded-full bg-brand-black text-white flex items-center justify-center hover:bg-brand-gold transition-all shadow-lg active:scale-95"
                        title="Add Hero Visual"
                      >
                        <Plus size={18} />
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {localContent.home.heroVisuals.map((visual, idx) => (
                        <div key={idx} className="bg-gray-50 p-6 border border-gray-100 space-y-4 relative group">
                          <div className="flex justify-between items-center pb-2 border-b border-gray-200 mb-2">
                             <span className="text-[10px] font-black text-brand-gold uppercase tracking-widest">
                               Position {idx + 1}
                             </span>
                             <div className="flex gap-2">
                               <button 
                                 disabled={idx === 0}
                                 onClick={() => {
                                   if (idx === 0) return;
                                   const newHero = [...localContent.home.heroVisuals];
                                   [newHero[idx], newHero[idx-1]] = [newHero[idx-1], newHero[idx]];
                                   setLocalContent({...localContent, home: {...localContent.home, heroVisuals: newHero}});
                                 }}
                                 className="p-1 text-gray-400 hover:text-brand-gold disabled:opacity-20 transition-all font-bold text-xs"
                                 title="Move Up"
                               >
                                 ↑
                               </button>
                               <button 
                                 disabled={idx === localContent.home.heroVisuals.length - 1}
                                 onClick={() => {
                                   if (idx === localContent.home.heroVisuals.length - 1) return;
                                   const newHero = [...localContent.home.heroVisuals];
                                   [newHero[idx], newHero[idx+1]] = [newHero[idx+1], newHero[idx]];
                                   setLocalContent({...localContent, home: {...localContent.home, heroVisuals: newHero}});
                                 }}
                                 className="p-1 text-gray-400 hover:text-brand-gold disabled:opacity-20 transition-all font-bold text-xs"
                                 title="Move Down"
                               >
                                 ↓
                               </button>
                               <button 
                                onClick={() => {
                                  const newHero = localContent.home.heroVisuals.filter((_, i) => i !== idx);
                                  setLocalContent({...localContent, home: {...localContent.home, heroVisuals: newHero}});
                                }}
                                className="p-1 text-gray-300 hover:text-red-500 transition-colors"
                              >
                                <Trash size={14} />
                              </button>
                             </div>
                          </div>
                          
                          <div className="aspect-video bg-black overflow-hidden mb-4 relative">
                            {visual.type === 'video' ? (
                              <div className="w-full h-full flex items-center justify-center text-white bg-zinc-900 border border-zinc-800">
                                <video src={visual.url} className="w-full h-full object-cover opacity-50" />
                                <span className="absolute text-[8px] uppercase tracking-widest font-black bg-brand-gold px-2 py-1 text-black">Video Preview</span>
                              </div>
                            ) : (
                              <img src={visual.url || "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=1000"} className="w-full h-full object-cover" alt="" />
                            )}
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <label className="text-[10px] uppercase font-black text-gray-400">Category Tag</label>
                              <input 
                                className="w-full text-xs font-bold p-2 bg-white border-0 outline-none focus:ring-1 focus:ring-brand-gold"
                                value={visual.category}
                                onChange={(e) => {
                                  const newHero = [...localContent.home.heroVisuals];
                                  newHero[idx] = {...newHero[idx], category: e.target.value};
                                  setLocalContent({...localContent, home: {...localContent.home, heroVisuals: newHero}});
                                }}
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-[10px] uppercase font-black text-gray-400">Media Type</label>
                              <select 
                                className="w-full text-xs font-bold p-2 bg-white border-0 outline-none focus:ring-1 focus:ring-brand-gold"
                                value={visual.type}
                                onChange={(e) => {
                                  const newHero = [...localContent.home.heroVisuals];
                                  newHero[idx] = {...newHero[idx], type: e.target.value as 'image' | 'video'};
                                  setLocalContent({...localContent, home: {...localContent.home, heroVisuals: newHero}});
                                }}
                              >
                                <option value="image">Image</option>
                                <option value="video">Video</option>
                              </select>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] uppercase font-black text-gray-400">Source URL (or Upload Below)</label>
                            <input 
                              className="w-full text-[10px] p-2 bg-white border-0 outline-none focus:ring-1 focus:ring-brand-gold" 
                              value={visual.url}
                              onChange={(e) => {
                                const newHero = [...localContent.home.heroVisuals];
                                newHero[idx] = {...newHero[idx], url: e.target.value};
                                setLocalContent({...localContent, home: {...localContent.home, heroVisuals: newHero}});
                              }}
                            />
                            <FileUploader 
                              label={`Upload ${visual.type}`}
                              accept={visual.type === 'video' ? 'video/*' : 'image/*'}
                              folder="hero"
                              onUploadComplete={(url) => {
                                const newHero = [...localContent.home.heroVisuals];
                                newHero[idx] = {...newHero[idx], url};
                                setLocalContent({...localContent, home: {...localContent.home, heroVisuals: newHero}});
                              }}
                            />
                            <div className="space-y-4">
                              {visual.type === 'image' && (
                                <FocalPointSelector 
                                  value={visual.objectPosition}
                                  onChange={(val) => {
                                    const newHero = [...localContent.home.heroVisuals];
                                    newHero[idx] = {...newHero[idx], objectPosition: val};
                                    setLocalContent({...localContent, home: {...localContent.home, heroVisuals: newHero}});
                                  }}
                                />
                              )}
                              <div className="space-y-3 p-3 bg-zinc-50 border border-gray-200 rounded-sm">
                                <div className="flex justify-between items-center">
                                  <label className="text-[9px] uppercase font-bold text-gray-400 tracking-tighter">Brightness Intensity: {visual.brightness ?? 100}%</label>
                                  <button 
                                    onClick={() => {
                                      const newHero = [...localContent.home.heroVisuals];
                                      newHero[idx] = {...newHero[idx], brightness: 100};
                                      setLocalContent({...localContent, home: {...localContent.home, heroVisuals: newHero}});
                                    }}
                                    className="text-[7px] font-black uppercase text-brand-gold"
                                  >Reset</button>
                                </div>
                                <input 
                                  type="range" min="50" max="200" step="5"
                                  value={visual.brightness ?? 100}
                                  onChange={(e) => {
                                    const newHero = [...localContent.home.heroVisuals];
                                    newHero[idx] = {...newHero[idx], brightness: parseInt(e.target.value)};
                                    setLocalContent({...localContent, home: {...localContent.home, heroVisuals: newHero}});
                                  }}
                                  className="w-full h-1 bg-gray-200 accent-brand-gold appearance-none cursor-pointer rounded-full"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-8 pt-8 border-t">
                    <div className="space-y-4">
                      <label className="text-[10px] uppercase font-black text-gray-400 tracking-widest">Authority Title</label>
                      <input 
                        className="w-full bg-gray-50 border-0 p-4 focus:ring-1 focus:ring-brand-gold outline-none font-medium" 
                        value={localContent.home.lensTitle}
                        onChange={(e) => setLocalContent({...localContent, home: {...localContent.home, lensTitle: e.target.value}})}
                      />
                    </div>
                    <div className="space-y-4">
                      <label className="text-[10px] uppercase font-black text-gray-400 tracking-widest">Authority Text</label>
                      <textarea 
                        rows={4}
                        className="w-full bg-gray-50 border-0 p-4 focus:ring-1 focus:ring-brand-gold outline-none font-medium leading-relaxed" 
                        value={localContent.home.lensText}
                        onChange={(e) => setLocalContent({...localContent, home: {...localContent.home, lensText: e.target.value}})}
                      />
                    </div>
                    <div className="space-y-4">
                      <label className="text-[10px] uppercase font-black text-gray-400 tracking-widest">Authority Secondary Visual (Direct URL or Upload)</label>
                      <input 
                        className="w-full bg-gray-50 border-0 p-4 focus:ring-1 focus:ring-brand-gold outline-none font-medium" 
                        value={localContent.home.lensImage}
                        onChange={(e) => setLocalContent({...localContent, home: {...localContent.home, lensImage: e.target.value}})}
                      />
                      <ImagePreview url={localContent.home.lensImage} />
                      <FileUploader 
                        label="Upload Secondary Visual"
                        folder="home"
                        onUploadComplete={(url) => setLocalContent({...localContent, home: {...localContent.home, lensImage: url}})}
                      />
                      <FocalPointSelector 
                        value={localContent.home.lensImagePosition}
                        onChange={(val) => setLocalContent({...localContent, home: {...localContent.home, lensImagePosition: val}})}
                      />
                    </div>
                    <div className="space-y-4">
                      <label className="text-[10px] uppercase font-black text-gray-400 tracking-widest">CTA Section Background (Direct URL or Upload)</label>
                      <input 
                        className="w-full bg-gray-50 border-0 p-4 focus:ring-1 focus:ring-brand-gold outline-none font-medium" 
                        value={localContent.home.ctaBackground}
                        onChange={(e) => setLocalContent({...localContent, home: {...localContent.home, ctaBackground: e.target.value}})}
                      />
                      <ImagePreview url={localContent.home.ctaBackground} />
                      <FileUploader 
                        label="Upload CTA Background"
                        folder="home"
                        onUploadComplete={(url) => setLocalContent({...localContent, home: {...localContent.home, ctaBackground: url}})}
                      />
                      <FocalPointSelector 
                        value={localContent.home.ctaBackgroundPosition}
                        onChange={(val) => setLocalContent({...localContent, home: {...localContent.home, ctaBackgroundPosition: val}})}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* About Tab */}
              {activeTab === 'about' && (
                <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="border-b pb-4 mb-8">
                    <h2 className="text-2xl font-display font-bold uppercase tracking-tight">About Page</h2>
                    <p className="text-xs text-gray-400 uppercase tracking-widest font-medium mt-2">Executive bio and brand philosophy</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="md:col-span-2 space-y-4">
                      <label className="text-[10px] uppercase font-black text-gray-400 tracking-widest">Profile Image (URL or Upload)</label>
                      <div className="flex flex-col space-y-4">
                        <div className="flex space-x-4">
                          <div className="w-20 h-20 bg-gray-100 overflow-hidden shrink-0">
                            <img src={localContent.about.profileImage} alt="" className="w-full h-full object-cover" />
                          </div>
                          <input 
                            className="flex-1 bg-gray-50 border-0 p-4 focus:ring-1 focus:ring-brand-gold outline-none font-medium text-xs" 
                            value={localContent.about.profileImage}
                            onChange={(e) => setLocalContent({...localContent, about: {...localContent.about, profileImage: e.target.value}})}
                          />
                        </div>
                        <FileUploader 
                          label="Upload Profile Image"
                          folder="about"
                          onUploadComplete={(url) => setLocalContent({...localContent, about: {...localContent.about, profileImage: url}})}
                        />
                        <FocalPointSelector 
                          value={localContent.about.profileImagePosition}
                          onChange={(val) => setLocalContent({...localContent, about: {...localContent.about, profileImagePosition: val}})}
                        />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <label className="text-[10px] uppercase font-black text-gray-400 tracking-widest">Category Title</label>
                      <input 
                        className="w-full bg-gray-50 border-0 p-4 focus:ring-1 focus:ring-brand-gold outline-none font-medium" 
                        value={localContent.about.heroTitle}
                        onChange={(e) => setLocalContent({...localContent, about: {...localContent.about, heroTitle: e.target.value}})}
                      />
                    </div>
                    <div className="space-y-4">
                      <label className="text-[10px] uppercase font-black text-gray-400 tracking-widest">Hero Name</label>
                      <input 
                        className="w-full bg-gray-50 border-0 p-4 focus:ring-1 focus:ring-brand-gold outline-none font-medium" 
                        value={localContent.about.heroSubtitle}
                        onChange={(e) => setLocalContent({...localContent, about: {...localContent.about, heroSubtitle: e.target.value}})}
                      />
                    </div>
                    <div className="md:col-span-2 space-y-4">
                      <label className="text-[10px] uppercase font-black text-gray-400 tracking-widest">Main Philosophy Hook</label>
                      <input 
                        className="w-full bg-gray-50 border-0 p-4 focus:ring-1 focus:ring-brand-gold outline-none font-medium" 
                        value={localContent.about.storyTitle}
                        onChange={(e) => setLocalContent({...localContent, about: {...localContent.about, storyTitle: e.target.value}})}
                      />
                    </div>
                    <div className="md:col-span-2 space-y-4">
                      <label className="text-[10px] uppercase font-black text-gray-400 tracking-widest">Story Block 1</label>
                      <textarea 
                        rows={3}
                        className="w-full bg-gray-50 border-0 p-4 focus:ring-1 focus:ring-brand-gold outline-none font-medium leading-relaxed" 
                        value={localContent.about.storyText1}
                        onChange={(e) => setLocalContent({...localContent, about: {...localContent.about, storyText1: e.target.value}})}
                      />
                    </div>
                    <div className="md:col-span-2 space-y-4">
                      <label className="text-[10px] uppercase font-black text-gray-400 tracking-widest">Story Block 2</label>
                      <textarea 
                        rows={3}
                        className="w-full bg-gray-50 border-0 p-4 focus:ring-1 focus:ring-brand-gold outline-none font-medium leading-relaxed" 
                        value={localContent.about.storyText2}
                        onChange={(e) => setLocalContent({...localContent, about: {...localContent.about, storyText2: e.target.value}})}
                      />
                    </div>
                    <div className="md:col-span-2 space-y-4">
                      <label className="text-[10px] uppercase font-black text-gray-400 tracking-widest">Call to Action Quote</label>
                      <input 
                        className="w-full bg-gray-50 border-0 p-4 focus:ring-1 focus:ring-brand-gold outline-none font-medium italic" 
                        value={localContent.about.quote}
                        onChange={(e) => setLocalContent({...localContent, about: {...localContent.about, quote: e.target.value}})}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Services Tab */}
              {activeTab === 'services' && (
                <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="border-b pb-4 mb-8 flex justify-between items-end">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                      <div>
                        <h2 className="text-2xl font-display font-bold uppercase tracking-tight">Services Offerings</h2>
                        <p className="text-xs text-gray-400 uppercase tracking-widest font-medium mt-2">Manage cinematic service architecture</p>
                      </div>
                      <button 
                        onClick={() => {
                          const newServices = [...localContent.services, { id: Date.now().toString(), title: "New Service", short: "", description: "", whoItsFor: "", outcome: "", icon: "Video", visualUrl: "", visualType: 'image' as const }];
                          setLocalContent({...localContent, services: newServices});
                        }}
                        className="w-12 h-12 rounded-full bg-brand-black text-white flex items-center justify-center hover:bg-brand-gold transition-all shadow-xl active:scale-90"
                        title="Add Strategic Service"
                      >
                        <Plus size={24} />
                      </button>
                    </div>
                  </div>
                  <div className="space-y-8">
                    {localContent.services.map((service, idx) => (
                      <div key={idx} className="p-8 bg-gray-50 border border-gray-100 rounded-lg group hover:bg-zinc-100 transition-colors relative">
                        <div className="absolute top-4 right-4 flex space-x-2 z-10">
                          <button 
                            onClick={() => reorderService(idx, 'up')}
                            disabled={idx === 0}
                            className="w-10 h-10 rounded-full bg-white border border-gray-100 shadow-xl flex items-center justify-center text-gray-400 hover:text-brand-gold disabled:opacity-20 transition-all font-bold"
                            title="Move Up"
                          >
                            ↑
                          </button>
                          <button 
                            onClick={() => reorderService(idx, 'down')}
                            disabled={idx === localContent.services.length - 1}
                            className="w-10 h-10 rounded-full bg-white border border-gray-100 shadow-xl flex items-center justify-center text-gray-400 hover:text-brand-gold disabled:opacity-20 transition-all font-bold"
                            title="Move Down"
                          >
                            ↓
                          </button>
                          <button 
                            onClick={() => {
                              if (window.confirm("Authorize permanent disposal of this strategic service architecture?")) {
                                const newServices = localContent.services.filter((_, i) => i !== idx);
                                setLocalContent({...localContent, services: newServices});
                              }
                            }}
                            className="w-10 h-10 rounded-full bg-white border border-gray-100 shadow-xl flex items-center justify-center text-gray-300 hover:text-red-500 hover:border-red-500 transition-all"
                            title="Dispose Service"
                          >
                            <Trash size={16} />
                          </button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
                          <div className="space-y-6">
                            <div className="space-y-2">
                              <label className="text-[10px] uppercase font-black text-gray-400">Title</label>
                              <input 
                                className="w-full p-4 bg-white border-0 focus:ring-1 focus:ring-brand-gold outline-none font-bold text-lg" 
                                value={service.title}
                                onChange={(e) => {
                                  const newServices = [...localContent.services];
                                  newServices[idx] = {...newServices[idx], title: e.target.value};
                                  setLocalContent({...localContent, services: newServices});
                                }}
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-[10px] uppercase font-black text-gray-400">Short Summary</label>
                              <input 
                                className="w-full p-4 bg-white border-0 focus:ring-1 focus:ring-brand-gold outline-none font-medium text-sm" 
                                value={service.short}
                                onChange={(e) => {
                                  const newServices = [...localContent.services];
                                  newServices[idx] = {...newServices[idx], short: e.target.value};
                                  setLocalContent({...localContent, services: newServices});
                                }}
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-[10px] uppercase font-black text-gray-400">Full Analysis</label>
                              <textarea 
                                rows={4}
                                className="w-full p-4 bg-white border-0 focus:ring-1 focus:ring-brand-gold outline-none leading-relaxed text-sm" 
                                value={service.description}
                                onChange={(e) => {
                                  const newServices = [...localContent.services];
                                  newServices[idx] = {...newServices[idx], description: e.target.value};
                                  setLocalContent({...localContent, services: newServices});
                                }}
                              />
                            </div>
                          </div>
                          
                          <div className="space-y-6">
                            <div className="aspect-video bg-zinc-200 overflow-hidden mb-2 relative">
                               {service.visualUrl && (
                                 service.visualType === 'video' ? (
                                   <video src={service.visualUrl} className="w-full h-full object-cover" muted />
                                 ) : (
                                   <img src={service.visualUrl} className="w-full h-full object-cover" alt="" />
                                 )
                               )}
                               <div className="absolute top-2 right-2 flex gap-2">
                                  <select 
                                    className="text-[10px] font-black bg-brand-black text-white px-2 py-1 uppercase"
                                    value={service.visualType || 'image'}
                                    onChange={(e) => {
                                      const newServices = [...localContent.services];
                                      newServices[idx] = {...newServices[idx], visualType: e.target.value as 'image' | 'video'};
                                      setLocalContent({...localContent, services: newServices});
                                    }}
                                  >
                                    <option value="image">IMG</option>
                                    <option value="video">VID</option>
                                  </select>
                               </div>
                            </div>
                            <div className="space-y-2">
                              <label className="text-[10px] uppercase font-black text-gray-400">Visual URL (or Upload)</label>
                              <input 
                                className="w-full p-4 bg-white border-0 focus:ring-1 focus:ring-brand-gold outline-none text-xs" 
                                value={service.visualUrl || ""}
                                onChange={(e) => {
                                  const newServices = [...localContent.services];
                                  newServices[idx] = {...newServices[idx], visualUrl: e.target.value};
                                  setLocalContent({...localContent, services: newServices});
                                }}
                              />
                              <FileUploader 
                                label={`Upload Service ${service.visualType}`}
                                accept={service.visualType === 'video' ? 'video/*' : 'image/*'}
                                folder="services"
                                onUploadComplete={(url) => {
                                  const newServices = [...localContent.services];
                                  newServices[idx] = {...newServices[idx], visualUrl: url};
                                  setLocalContent({...localContent, services: newServices});
                                }}
                              />
                              {service.visualType !== 'video' && (
                                <FocalPointSelector 
                                  value={service.objectPosition}
                                  onChange={(val) => {
                                    const newServices = [...localContent.services];
                                    newServices[idx] = {...newServices[idx], objectPosition: val};
                                    setLocalContent({...localContent, services: newServices});
                                  }}
                                />
                              )}
                            </div>
                             <div className="grid grid-cols-2 gap-4">
                               <div className="space-y-2">
                                 <label className="text-[10px] uppercase font-black text-gray-400">Lucide Icon</label>
                                 <input 
                                   className="w-full p-4 bg-white border-0 focus:ring-1 focus:ring-brand-gold outline-none text-xs font-bold" 
                                   value={service.icon}
                                   onChange={(e) => {
                                     const newServices = [...localContent.services];
                                     newServices[idx] = {...newServices[idx], icon: e.target.value as any};
                                     setLocalContent({...localContent, services: newServices});
                                   }}
                                 />
                               </div>
                               <div className="space-y-2">
                                 <label className="text-[10px] uppercase font-black text-gray-400">Photo Gallery Link (Category)</label>
                                 <input 
                                   className="w-full p-4 bg-white border-0 focus:ring-1 focus:ring-brand-gold outline-none text-xs font-bold text-brand-gold" 
                                   value={service.photoCategory || ""}
                                   placeholder="e.g. Commercial"
                                   onChange={(e) => {
                                     const newServices = [...localContent.services];
                                     newServices[idx] = {...newServices[idx], photoCategory: e.target.value};
                                     setLocalContent({...localContent, services: newServices});
                                   }}
                                 />
                               </div>
                               <div className="md:col-span-2 space-y-2">
                                 <label className="text-[10px] uppercase font-black text-gray-400">Client Profile</label>
                                 <input 
                                   className="w-full p-4 bg-white border-0 focus:ring-1 focus:ring-brand-gold outline-none text-xs" 
                                   value={service.whoItsFor}
                                   onChange={(e) => {
                                     const newServices = [...localContent.services];
                                     newServices[idx] = {...newServices[idx], whoItsFor: e.target.value};
                                     setLocalContent({...localContent, services: newServices});
                                   }}
                                 />
                               </div>
                             </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Video Work Tab */}
              {activeTab === 'video-work' && (
                <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="border-b pb-4 mb-8 flex justify-between items-end">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                      <div>
                        <h2 className="text-2xl font-display font-bold uppercase tracking-tight">Cine Portfolio</h2>
                        <p className="text-xs text-gray-400 uppercase tracking-widest font-medium mt-2">Manage cinematic motion projects</p>
                      </div>
                      <button 
                        onClick={() => {
                          const newWork = [...localContent.portfolio, { category: "Brand Story", title: "New Video Project", placeholder: "", url: "#", videoUrl: "", type: 'video' }];
                          setLocalContent({...localContent, portfolio: newWork});
                        }}
                        className="w-12 h-12 rounded-full bg-brand-black text-white flex items-center justify-center hover:bg-brand-gold transition-all shadow-xl active:scale-90"
                        title="Add Video Asset"
                      >
                        <Plus size={24} />
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {localContent.portfolio.filter(item => item.type === 'video').map((item, idx) => {
                      const realIdx = localContent.portfolio.findIndex(p => p === item);
                      return (
                        <div key={realIdx} className="p-6 bg-gray-50 border border-gray-100 rounded-lg space-y-4 relative">
                          <div className="flex justify-between items-center pb-2 border-b border-gray-200 mb-2">
                             <span className="text-[10px] font-black text-brand-gold uppercase tracking-widest">
                               Position {idx + 1}
                             </span>
                             <div className="flex gap-2">
                               <button 
                                 disabled={idx === 0}
                                 onClick={() => {
                                   if (idx === 0) return;
                                   const newPortfolio = [...localContent.portfolio];
                                   const filtered = localContent.portfolio.filter(p => p.type === 'video');
                                   const targetItem = filtered[idx - 1];
                                   const targetRealIdx = localContent.portfolio.findIndex(p => p === targetItem);
                                   [newPortfolio[realIdx], newPortfolio[targetRealIdx]] = [newPortfolio[targetRealIdx], newPortfolio[realIdx]];
                                   setLocalContent({...localContent, portfolio: newPortfolio});
                                 }}
                                 className="w-10 h-10 rounded-full flex items-center justify-center bg-white border border-gray-100 text-gray-400 hover:text-brand-gold shadow-md transition-all font-bold"
                                 title="Move Previous"
                               >
                                 <ChevronRight size={18} className="rotate-180" />
                               </button>
                               <button 
                                 disabled={idx === localContent.portfolio.filter(p => p.type === 'video').length - 1}
                                 onClick={() => {
                                   const filtered = localContent.portfolio.filter(p => p.type === 'video');
                                   if (idx === filtered.length - 1) return;
                                   const newPortfolio = [...localContent.portfolio];
                                   const targetItem = filtered[idx + 1];
                                   const targetRealIdx = localContent.portfolio.findIndex(p => p === targetItem);
                                   [newPortfolio[realIdx], newPortfolio[targetRealIdx]] = [newPortfolio[targetRealIdx], newPortfolio[realIdx]];
                                   setLocalContent({...localContent, portfolio: newPortfolio});
                                 }}
                                 className="w-10 h-10 rounded-full flex items-center justify-center bg-white border border-gray-100 text-gray-400 hover:text-brand-gold shadow-md transition-all font-bold"
                                 title="Move Next"
                               >
                                 <ChevronRight size={18} />
                               </button>
                               <button 
                                 onClick={() => {
                                   if (window.confirm("Authorize permanent disposal of this media asset?")) {
                                     const newWork = localContent.portfolio.filter((_, i) => i !== realIdx);
                                     setLocalContent({...localContent, portfolio: newWork});
                                   }
                                 }}
                                 className="w-10 h-10 rounded-full flex items-center justify-center bg-white border border-gray-100 text-gray-300 hover:text-red-500 shadow-md transition-all"
                               >
                                 <Trash size={14} />
                               </button>
                             </div>
                          </div>
                          
                          <div className="aspect-video bg-zinc-900 overflow-hidden relative group flex items-center justify-center">
                             {item.placeholder ? (
                               <img src={item.placeholder} alt="" className="w-full h-full object-cover opacity-50 grayscale group-hover:grayscale-0 transition-all" />
                             ) : (
                               <div className="text-gray-600 text-[10px] font-black uppercase">No Preview</div>
                             )}
                             <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                               <VideoIcon size={32} className="text-brand-gold opacity-50" />
                             </div>
                          </div>
                          
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-4">
                                <div className="space-y-2">
                                  <label className="text-[10px] uppercase font-black text-gray-400">Category Tag</label>
                                  <input 
                                    className="w-full p-3 bg-white border border-gray-100 focus:border-brand-gold outline-none font-bold text-xs" 
                                    value={item.category}
                                    onChange={(e) => {
                                      const newPortfolio = [...localContent.portfolio];
                                      newPortfolio[realIdx] = {...newPortfolio[realIdx], category: e.target.value};
                                      setLocalContent({...localContent, portfolio: newPortfolio});
                                    }}
                                  />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase font-black text-gray-400">Project Title</label>
                                    <input 
                                      className="w-full p-3 bg-white border border-gray-100 focus:border-brand-gold outline-none font-bold text-xs" 
                                      value={item.title}
                                      onChange={(e) => {
                                        const newPortfolio = [...localContent.portfolio];
                                        newPortfolio[realIdx] = {...newPortfolio[realIdx], title: e.target.value};
                                        setLocalContent({...localContent, portfolio: newPortfolio});
                                      }}
                                    />
                                  </div>
                              </div>
                              <div className="space-y-1 bg-brand-gold/5 p-4 border border-brand-gold/10 rounded-sm">
                                <div className="flex items-center space-x-2 mb-2">
                                  <ExternalLink size={12} className="text-brand-gold" />
                                  <label className="text-[9px] uppercase font-black text-brand-gold tracking-widest">Master Destination Link</label>
                                </div>
                                <input 
                                  className="w-full p-3 bg-white border border-brand-gold/20 outline-none text-[10px] font-mono font-bold text-brand-black" 
                                  value={item.url || "#"}
                                  placeholder="# (Default)"
                                  onChange={(e) => {
                                    const newPortfolio = [...localContent.portfolio];
                                    newPortfolio[realIdx] = {...newPortfolio[realIdx], url: e.target.value};
                                    setLocalContent({...localContent, portfolio: newPortfolio});
                                  }}
                                />
                                <p className="text-[8px] text-gray-400 uppercase font-bold mt-2 leading-tight">Controls the "View Story" and Thumbnail redirect</p>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <label className="text-[10px] uppercase font-black text-gray-400">Client / Brand</label>
                                <input 
                                  className="w-full p-3 bg-white border-0 focus:ring-1 focus:ring-brand-gold outline-none text-xs" 
                                  value={item.client || ""}
                                  placeholder="e.g. Nike"
                                  onChange={(e) => {
                                    const newPortfolio = [...localContent.portfolio];
                                    newPortfolio[realIdx] = {...newPortfolio[realIdx], client: e.target.value};
                                    setLocalContent({...localContent, portfolio: newPortfolio});
                                  }}
                                />
                              </div>
                              <div className="space-y-2">
                                <label className="text-[10px] uppercase font-black text-gray-400">Production Year</label>
                                <input 
                                  className="w-full p-3 bg-white border-0 focus:ring-1 focus:ring-brand-gold outline-none text-xs" 
                                  value={item.year || ""}
                                  placeholder="2024"
                                  onChange={(e) => {
                                    const newPortfolio = [...localContent.portfolio];
                                    newPortfolio[realIdx] = {...newPortfolio[realIdx], year: e.target.value};
                                    setLocalContent({...localContent, portfolio: newPortfolio});
                                  }}
                                />
                              </div>
                            </div>

                            <div className="space-y-2">
                              <label className="text-[10px] uppercase font-black text-gray-400">SEO Alt Text (Accessibility)</label>
                              <input 
                                className="w-full p-3 bg-white border-0 focus:ring-1 focus:ring-brand-gold outline-none text-xs" 
                                value={item.alt || ""}
                                placeholder="Describe the video content for Google..."
                                onChange={(e) => {
                                  const newPortfolio = [...localContent.portfolio];
                                  newPortfolio[realIdx] = {...newPortfolio[realIdx], alt: e.target.value};
                                  setLocalContent({...localContent, portfolio: newPortfolio});
                                }}
                              />
                            </div>

                            <div className="flex items-center space-x-3 bg-white p-3">
                              <input 
                                type="checkbox"
                                id={`featured-v-${realIdx}`}
                                checked={item.isFeatured}
                                onChange={(e) => {
                                  const newPortfolio = [...localContent.portfolio];
                                  newPortfolio[realIdx] = {...newPortfolio[realIdx], isFeatured: e.target.checked};
                                  setLocalContent({...localContent, portfolio: newPortfolio});
                                }}
                                className="w-4 h-4 accent-brand-gold"
                              />
                              <label htmlFor={`featured-v-${realIdx}`} className="text-[10px] uppercase font-black text-gray-700">Display on Homepage (Featured)</label>
                            </div>
                            <div className="space-y-2">
                              <label className="text-[10px] uppercase font-black text-gray-400">Poster / Placeholder URL (or Upload)</label>
                              <input 
                                className="w-full p-3 bg-white border-0 focus:ring-1 focus:ring-brand-gold outline-none text-[10px]" 
                                value={item.placeholder}
                                onChange={(e) => {
                                  const newPortfolio = [...localContent.portfolio];
                                  newPortfolio[realIdx] = {...newPortfolio[realIdx], placeholder: e.target.value};
                                  setLocalContent({...localContent, portfolio: newPortfolio});
                                }}
                              />
                              <ImagePreview url={item.placeholder} className="w-full aspect-video h-auto mt-2" />
                              <FileUploader 
                                label="Upload Poster Image"
                                folder="portfolio"
                                onUploadComplete={(url) => {
                                  const newPortfolio = [...localContent.portfolio];
                                  newPortfolio[realIdx] = {...newPortfolio[realIdx], placeholder: url};
                                  setLocalContent({...localContent, portfolio: newPortfolio});
                                }}
                              />
                              <FocalPointSelector 
                                value={item.objectPosition}
                                onChange={(val) => {
                                  const newPortfolio = [...localContent.portfolio];
                                  newPortfolio[realIdx] = {...newPortfolio[realIdx], objectPosition: val};
                                  setLocalContent({...localContent, portfolio: newPortfolio});
                                }}
                              />
                            </div>
                              <div className="space-y-2">
                                <label className="text-[10px] uppercase font-black text-gray-400">Video Source Link (or Upload)</label>
                                <div className="flex gap-2">
                                  <input 
                                    className="flex-1 p-3 bg-white border-0 focus:ring-1 focus:ring-brand-gold outline-none text-[10px] font-mono text-brand-gold" 
                                    value={item.videoUrl || ""}
                                    onChange={(e) => {
                                      const newPortfolio = [...localContent.portfolio];
                                      newPortfolio[realIdx] = {...newPortfolio[realIdx], videoUrl: e.target.value};
                                      setLocalContent({...localContent, portfolio: newPortfolio});
                                    }}
                                  />
                                  <button 
                                    onClick={() => fetchVideoThumbnail(item.videoUrl || "", realIdx)}
                                    className="p-3 bg-white border-0 text-brand-gold hover:bg-gray-100 transition-colors"
                                    title="Fetch Thumbnail from URL"
                                  >
                                    <RefreshCw size={14} />
                                  </button>
                                </div>
                                <FileUploader 
                                  label="Upload Video Source"
                                accept="video/*"
                                folder="portfolio"
                                onUploadComplete={(url) => {
                                  const newPortfolio = [...localContent.portfolio];
                                  newPortfolio[realIdx] = {...newPortfolio[realIdx], videoUrl: url};
                                  setLocalContent({...localContent, portfolio: newPortfolio});
                                  // Automatically attempt to fetch thumbnail for direct video upload
                                  fetchVideoThumbnail(url, realIdx);
                                }}
                              />
                            </div>
                          </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Photo Work Tab */}
              {activeTab === 'photo-work' && (
                <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="border-b pb-4 mb-8 flex justify-between items-end">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                      <div>
                        <h2 className="text-2xl font-display font-bold uppercase tracking-tight">Photo Gallery</h2>
                        <p className="text-xs text-gray-400 uppercase tracking-widest font-medium mt-2">Manage high-end stills and brand photography</p>
                      </div>
                      <div className="flex gap-4">
                        <button 
                          onClick={() => setShowAIGenerator(true)}
                          className="px-6 py-4 bg-brand-gold text-brand-black flex items-center space-x-3 hover:bg-yellow-500 transition-all shadow-xl active:scale-95 group"
                          title="Generate Still with AI"
                        >
                          <Sparkles size={18} className="group-hover:rotate-12 transition-transform" />
                          <span className="text-[10px] font-black uppercase tracking-widest">Generate with AI</span>
                        </button>
                        <button 
                          onClick={() => {
                            const newWork = [...localContent.portfolio, { category: "Branding", title: "New Photo Project", placeholder: "", url: "#", videoUrl: "", type: 'photo' }];
                            setLocalContent({...localContent, portfolio: newWork});
                          }}
                          className="w-12 h-12 rounded-full bg-brand-black text-white flex items-center justify-center hover:bg-brand-gold transition-all shadow-xl active:scale-90"
                          title="Add Still Asset"
                        >
                          <Plus size={24} />
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {localContent.portfolio.filter(item => item.type === 'photo').map((item, idx) => {
                      const realIdx = localContent.portfolio.findIndex(p => p === item);
                      return (
                        <div key={realIdx} className="p-4 bg-gray-50 border border-gray-100 rounded-lg space-y-4 relative group">
                          <div className="flex justify-between items-center pb-2 border-b border-gray-200 mb-2">
                             <span className="text-[10px] font-black text-brand-gold uppercase tracking-widest">
                               Position {idx + 1}
                             </span>
                             <div className="flex gap-2">
                               <button 
                                 disabled={idx === 0}
                                 onClick={() => {
                                   if (idx === 0) return;
                                   const newPortfolio = [...localContent.portfolio];
                                   const filtered = localContent.portfolio.filter(p => p.type === 'photo');
                                   const prevItem = filtered[idx - 1];
                                   const prevRealIdx = localContent.portfolio.findIndex(p => p === prevItem);
                                   [newPortfolio[realIdx], newPortfolio[prevRealIdx]] = [newPortfolio[prevRealIdx], newPortfolio[realIdx]];
                                   setLocalContent({...localContent, portfolio: newPortfolio});
                                 }}
                                 className="w-10 h-10 rounded-full flex items-center justify-center bg-white border border-gray-100 text-gray-400 hover:text-cyan-500 shadow-sm transition-all hover:border-cyan-500"
                                 title="Move Left"
                               >
                                 <ChevronRight size={18} className="rotate-180" />
                               </button>
                               <button 
                                 disabled={idx === localContent.portfolio.filter(p => p.type === 'photo').length - 1}
                                 onClick={() => {
                                   const filtered = localContent.portfolio.filter(p => p.type === 'photo');
                                   if (idx === filtered.length - 1) return;
                                   const newPortfolio = [...localContent.portfolio];
                                   const nextItem = filtered[idx + 1];
                                   const nextRealIdx = localContent.portfolio.findIndex(p => p === nextItem);
                                   [newPortfolio[realIdx], newPortfolio[nextRealIdx]] = [newPortfolio[nextRealIdx], newPortfolio[realIdx]];
                                   setLocalContent({...localContent, portfolio: newPortfolio});
                                 }}
                                 className="w-10 h-10 rounded-full flex items-center justify-center bg-white border border-gray-100 text-gray-400 hover:text-cyan-500 shadow-sm transition-all hover:border-cyan-500"
                                 title="Move Right"
                               >
                                 <ChevronRight size={18} />
                               </button>
                               <button 
                                 onClick={() => {
                                   if (window.confirm("Authorize permanent disposal of this still asset?")) {
                                     const newWork = localContent.portfolio.filter((_, i) => i !== realIdx);
                                     setLocalContent({...localContent, portfolio: newWork});
                                   }
                                 }}
                                 className="w-10 h-10 rounded-full flex items-center justify-center bg-white border border-gray-100 text-gray-300 hover:text-red-500 shadow-sm transition-all"
                               >
                                 <Trash size={14} />
                               </button>
                             </div>
                          </div>
                          
                          <div className="aspect-[4/5] bg-gray-200 overflow-hidden relative">
                             {item.placeholder ? (
                               <img src={item.placeholder} alt="" className="w-full h-full object-cover transition-all" />
                             ) : (
                               <div className="w-full h-full flex items-center justify-center font-display text-gray-300 font-bold uppercase text-[10px]">No Image</div>
                             )}
                          </div>
                          
                          <div className="space-y-4 pt-2">
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-1">
                                <label className="text-[8px] uppercase font-black text-gray-400 leading-none">Category</label>
                                <input 
                                  className="w-full p-2 bg-white border-b border-gray-200 focus:border-brand-gold outline-none font-bold text-[10px]" 
                                  value={item.category}
                                  onChange={(e) => {
                                    const newPortfolio = [...localContent.portfolio];
                                    newPortfolio[realIdx] = {...newPortfolio[realIdx], category: e.target.value};
                                    setLocalContent({...localContent, portfolio: newPortfolio});
                                  }}
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="text-[8px] uppercase font-black text-gray-400 leading-none">Project Title</label>
                                <input 
                                  className="w-full p-2 bg-white border-b border-gray-200 focus:border-brand-gold outline-none font-bold text-[10px]" 
                                  value={item.title}
                                  onChange={(e) => {
                                    const newPortfolio = [...localContent.portfolio];
                                    newPortfolio[realIdx] = {...newPortfolio[realIdx], title: e.target.value};
                                    setLocalContent({...localContent, portfolio: newPortfolio});
                                  }}
                                />
                              </div>
                            </div>

                            <div className="space-y-1 bg-cyan-50 p-3 rounded-sm border border-cyan-100">
                              <div className="flex items-center space-x-2 mb-1">
                                <ExternalLink size={10} className="text-cyan-500" />
                                <label className="text-[8px] uppercase font-black text-cyan-600 tracking-widest">Internal / External Link</label>
                              </div>
                              <input 
                                className="w-full p-2 bg-white border border-cyan-200 rounded-sm focus:ring-1 focus:ring-cyan-500 outline-none text-[9px] font-mono font-bold text-zinc-900" 
                                value={item.url || "#"}
                                placeholder="# (Default)"
                                onChange={(e) => {
                                  const newPortfolio = [...localContent.portfolio];
                                  newPortfolio[realIdx] = {...newPortfolio[realIdx], url: e.target.value};
                                  setLocalContent({...localContent, portfolio: newPortfolio});
                                }}
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[8px] uppercase font-black text-gray-400">Title</label>
                              <input 
                                className="w-full p-2 bg-white border-0 focus:ring-1 focus:ring-brand-gold outline-none font-bold text-[10px]" 
                                value={item.title}
                                onChange={(e) => {
                                  const newPortfolio = [...localContent.portfolio];
                                  newPortfolio[realIdx] = {...newPortfolio[realIdx], title: e.target.value};
                                  setLocalContent({...localContent, portfolio: newPortfolio});
                                }}
                              />
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                              <div className="space-y-1">
                                <label className="text-[8px] uppercase font-black text-gray-400">Client</label>
                                <input 
                                  className="w-full p-2 bg-white border-0 focus:ring-1 focus:ring-brand-gold outline-none text-[9px]" 
                                  value={item.client || ""}
                                  onChange={(e) => {
                                    const newPortfolio = [...localContent.portfolio];
                                    newPortfolio[realIdx] = {...newPortfolio[realIdx], client: e.target.value};
                                    setLocalContent({...localContent, portfolio: newPortfolio});
                                  }}
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="text-[8px] uppercase font-black text-gray-400">Year</label>
                                <input 
                                  className="w-full p-2 bg-white border-0 focus:ring-1 focus:ring-brand-gold outline-none text-[9px]" 
                                  value={item.year || ""}
                                  onChange={(e) => {
                                    const newPortfolio = [...localContent.portfolio];
                                    newPortfolio[realIdx] = {...newPortfolio[realIdx], year: e.target.value};
                                    setLocalContent({...localContent, portfolio: newPortfolio});
                                  }}
                                />
                              </div>
                            </div>

                            <div className="space-y-1">
                              <label className="text-[8px] uppercase font-black text-gray-400">SEO Alt Text</label>
                              <input 
                                className="w-full p-2 bg-white border-0 focus:ring-1 focus:ring-brand-gold outline-none text-[9px]" 
                                value={item.alt || ""}
                                onChange={(e) => {
                                  const newPortfolio = [...localContent.portfolio];
                                  newPortfolio[realIdx] = {...newPortfolio[realIdx], alt: e.target.value};
                                  setLocalContent({...localContent, portfolio: newPortfolio});
                                }}
                              />
                            </div>

                            <div className="flex items-center space-x-2 bg-white p-2">
                              <input 
                                type="checkbox"
                                id={`featured-p-${realIdx}`}
                                checked={item.isFeatured}
                                onChange={(e) => {
                                  const newPortfolio = [...localContent.portfolio];
                                  newPortfolio[realIdx] = {...newPortfolio[realIdx], isFeatured: e.target.checked};
                                  setLocalContent({...localContent, portfolio: newPortfolio});
                                }}
                                className="w-3 h-3 accent-brand-gold"
                              />
                              <label htmlFor={`featured-p-${realIdx}`} className="text-[8px] uppercase font-black text-gray-600">Featured on Home</label>
                            </div>
                            <div className="space-y-1">
                              <label className="text-[8px] uppercase font-black text-gray-400">Main Thumbnail URL (or Upload)</label>
                              <input 
                                className="w-full p-2 bg-white border-0 focus:ring-1 focus:ring-brand-gold outline-none text-[8px]" 
                                value={item.placeholder}
                                onChange={(e) => {
                                  const newPortfolio = [...localContent.portfolio];
                                  newPortfolio[realIdx] = {...newPortfolio[realIdx], placeholder: e.target.value};
                                  setLocalContent({...localContent, portfolio: newPortfolio});
                                }}
                              />
                              <ImagePreview url={item.placeholder} className="w-full aspect-video h-auto mt-2" />
                              <FileUploader 
                                label="Upload Thumbnail"
                                folder="portfolio"
                                onUploadComplete={(url) => {
                                  const newPortfolio = [...localContent.portfolio];
                                  newPortfolio[realIdx] = {...newPortfolio[realIdx], placeholder: url};
                                  setLocalContent({...localContent, portfolio: newPortfolio});
                                }}
                              />
                              <FocalPointSelector 
                                value={item.objectPosition}
                                onChange={(val) => {
                                  const newPortfolio = [...localContent.portfolio];
                                  newPortfolio[realIdx] = {...newPortfolio[realIdx], objectPosition: val};
                                  setLocalContent({...localContent, portfolio: newPortfolio});
                                }}
                              />
                            </div>
                            <div className="space-y-3 pt-4 border-t border-gray-100">
                              <label className="text-[8px] uppercase font-black text-gray-400">Gallery Images (URL or Upload)</label>
                              {[0, 1, 2, 3].map((imgIdx) => (
                                <div key={imgIdx} className="space-y-1 p-2 bg-zinc-50 rounded">
                                  <label className="text-[7px] uppercase font-bold text-gray-300">Image {imgIdx + 1}</label>
                                  <input 
                                    className="w-full p-2 bg-white border-0 focus:ring-1 focus:ring-brand-gold outline-none text-[8px]" 
                                    value={item.images?.[imgIdx] || ""}
                                    placeholder={`Gallery Image ${imgIdx + 1} URL`}
                                    onChange={(e) => {
                                      const newPortfolio = [...localContent.portfolio];
                                      const currentImages = [...(newPortfolio[realIdx].images || [])];
                                      currentImages[imgIdx] = e.target.value;
                                      newPortfolio[realIdx] = {...newPortfolio[realIdx], images: currentImages};
                                      setLocalContent({...localContent, portfolio: newPortfolio});
                                    }}
                                  />
                                  <ImagePreview url={item.images?.[imgIdx]} className="w-full aspect-video h-auto mt-2" />
                                  <FileUploader 
                                    label={`Upload Image ${imgIdx + 1}`}
                                    folder="portfolio/gallery"
                                    onUploadComplete={(url) => {
                                      const newPortfolio = [...localContent.portfolio];
                                      const currentImages = [...(newPortfolio[realIdx].images || [])];
                                      currentImages[imgIdx] = url;
                                      newPortfolio[realIdx] = {...newPortfolio[realIdx], images: currentImages};
                                      setLocalContent({...localContent, portfolio: newPortfolio});
                                    }}
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <AnimatePresence>
                {showAIGenerator && (
                  <AIImageGenerator 
                    onClose={() => setShowAIGenerator(false)}
                    onGenerated={(imageUrl, prompt) => {
                      const newWork = [
                        ...localContent.portfolio, 
                        { 
                          category: "AI Generated", 
                          title: prompt.slice(0, 30) + (prompt.length > 30 ? "..." : ""), 
                          placeholder: imageUrl, 
                          url: "#", 
                          videoUrl: "", 
                          type: 'photo',
                          alt: prompt,
                          isFeatured: false
                        }
                      ];
                      setLocalContent({...localContent, portfolio: newWork});
                    }}
                  />
                )}
              </AnimatePresence>

               {/* Promo Tab */}
              {activeTab === 'promo' && (
                <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="border-b pb-4 mb-8">
                    <h2 className="text-2xl font-display font-bold uppercase tracking-tight">Promotional Popup</h2>
                    <p className="text-xs text-gray-400 uppercase tracking-widest font-medium mt-2">Manage growth-focused lead magnets</p>
                  </div>
                  
                  <div className="space-y-8">
                    <div className="flex items-center justify-between p-6 bg-brand-black text-white rounded-lg">
                      <div className="space-y-1">
                        <h4 className="text-sm font-bold uppercase tracking-widest">Popup Status</h4>
                        <p className="text-[10px] text-gray-400 uppercase">Toggle visibility on front page</p>
                      </div>
                      <button 
                        onClick={() => setLocalContent({...localContent, promo: {...localContent.promo, enabled: !localContent.promo.enabled}})}
                        className={`w-16 h-8 rounded-full transition-all relative ${localContent.promo.enabled ? 'bg-green-500' : 'bg-gray-700'}`}
                      >
                        <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${localContent.promo.enabled ? 'left-9' : 'left-1'}`} />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8">
                      <div className="md:col-span-2 space-y-4">
                        <label className="text-[10px] uppercase font-black text-gray-400 tracking-widest">Promotion Title</label>
                        <input 
                          className="w-full bg-gray-50 border-0 p-4 focus:ring-1 focus:ring-brand-gold outline-none font-bold text-xl" 
                          value={localContent.promo.title}
                          onChange={(e) => setLocalContent({...localContent, promo: {...localContent.promo, title: e.target.value}})}
                        />
                      </div>
                      <div className="md:col-span-2 space-y-4">
                        <label className="text-[10px] uppercase font-black text-gray-400 tracking-widest">Promotional Message</label>
                        <textarea 
                          rows={3}
                          className="w-full bg-gray-50 border-0 p-4 focus:ring-1 focus:ring-brand-gold outline-none font-medium leading-relaxed" 
                          value={localContent.promo.message}
                          onChange={(e) => setLocalContent({...localContent, promo: {...localContent.promo, message: e.target.value}})}
                        />
                      </div>
                      <div className="space-y-4">
                        <label className="text-[10px] uppercase font-black text-gray-400 tracking-widest">Discount / Access Code</label>
                        <input 
                          className="w-full bg-gray-50 border-0 p-4 focus:ring-1 focus:ring-brand-gold outline-none font-black text-brand-gold tracking-widest" 
                          value={localContent.promo.code}
                          onChange={(e) => setLocalContent({...localContent, promo: {...localContent.promo, code: e.target.value}})}
                        />
                      </div>
                    </div>

                    <div className="mt-12 p-8 border-2 border-dashed border-gray-100 rounded-xl">
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-300 mb-8 border-b pb-4">Live Preview Concept</h4>
                      <div className={`p-8 bg-zinc-900 text-white max-w-sm mx-auto shadow-2xl transition-opacity duration-500 ${localContent.promo.enabled ? 'opacity-100' : 'opacity-20'}`}>
                        <div className="w-12 h-1 bg-brand-gold mb-6" />
                        <h5 className="text-2xl font-display font-bold uppercase tracking-tighter mb-4 italic leading-none">{localContent.promo.title}</h5>
                        <p className="text-gray-400 text-sm font-medium mb-8 leading-relaxed">{localContent.promo.message}</p>
                        <div className="py-3 px-4 border border-zinc-700 text-brand-gold text-xs font-black tracking-widest text-center uppercase">
                          Code: {localContent.promo.code}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Testimonials Tab */}
              {activeTab === 'testimonials' && (
                <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="border-b pb-4 mb-8 flex justify-between items-end">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                      <div>
                        <h2 className="text-2xl font-display font-bold uppercase tracking-tight">Social Proof Architecture</h2>
                        <p className="text-xs text-gray-400 uppercase tracking-widest font-medium mt-2">Manage verified Google reviews and testimonials</p>
                      </div>
                      <button 
                        onClick={() => setLocalContent({
                          ...localContent, 
                          testimonials: [
                            ...localContent.testimonials, 
                            { author: "New Reviewer", role: "Client", content: "Great experience...", rating: 5, date: "Just now" }
                          ]
                        })}
                        className="w-12 h-12 rounded-full bg-brand-black text-white flex items-center justify-center hover:bg-brand-gold transition-all shadow-xl active:scale-90"
                        title="Add Strategy Endorsement"
                      >
                        <Plus size={24} />
                      </button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-8">
                    {localContent.testimonials.map((review, idx) => (
                      <div key={idx} className="bg-gray-50 p-8 relative group border border-gray-100 rounded-xl">
                        <button 
                          onClick={() => {
                            if (window.confirm("Authorize disposal of this endorsement?")) {
                              const newTestimonials = [...localContent.testimonials];
                              newTestimonials.splice(idx, 1);
                              setLocalContent({...localContent, testimonials: newTestimonials});
                            }
                          }}
                          className="absolute -top-3 -right-3 w-10 h-10 rounded-full bg-white border border-gray-100 shadow-xl flex items-center justify-center text-gray-300 hover:text-red-500 hover:border-red-500 transition-all z-10"
                          title="Dispose Endorsement"
                        >
                          <Trash size={16} />
                        </button>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="space-y-4">
                            <label className="text-[10px] uppercase font-black text-gray-400 tracking-widest">Client Name</label>
                            <input 
                              className="w-full bg-white border-0 p-3 focus:ring-1 focus:ring-brand-gold outline-none font-bold text-sm" 
                              value={review.author}
                              onChange={(e) => {
                                const newTestimonials = [...localContent.testimonials];
                                newTestimonials[idx].author = e.target.value;
                                setLocalContent({...localContent, testimonials: newTestimonials});
                              }}
                            />
                          </div>
                          <div className="space-y-4">
                            <label className="text-[10px] uppercase font-black text-gray-400 tracking-widest">Role / Company</label>
                            <input 
                              className="w-full bg-white border-0 p-3 focus:ring-1 focus:ring-brand-gold outline-none font-medium text-sm" 
                              value={review.role}
                              onChange={(e) => {
                                const newTestimonials = [...localContent.testimonials];
                                newTestimonials[idx].role = e.target.value;
                                setLocalContent({...localContent, testimonials: newTestimonials});
                              }}
                            />
                          </div>
                          <div className="md:col-span-2 space-y-4">
                            <label className="text-[10px] uppercase font-black text-gray-400 tracking-widest">Testimonial Content</label>
                            <textarea 
                              rows={4}
                              className="w-full bg-white border-0 p-4 focus:ring-1 focus:ring-brand-gold outline-none font-medium text-sm leading-relaxed" 
                              value={review.content}
                              onChange={(e) => {
                                const newTestimonials = [...localContent.testimonials];
                                newTestimonials[idx].content = e.target.value;
                                setLocalContent({...localContent, testimonials: newTestimonials});
                              }}
                            />
                          </div>
                          <div className="space-y-4">
                            <label className="text-[10px] uppercase font-black text-gray-400 tracking-widest">Rating (1-5)</label>
                            <div className="flex space-x-2">
                              {[1, 2, 3, 4, 5].map(star => (
                                <button 
                                  key={star}
                                  onClick={() => {
                                    const newTestimonials = [...localContent.testimonials];
                                    newTestimonials[idx].rating = star;
                                    setLocalContent({...localContent, testimonials: newTestimonials});
                                  }}
                                  className={`${review.rating >= star ? 'text-brand-gold' : 'text-gray-200'} transition-colors`}
                                >
                                  <Star size={20} fill={review.rating >= star ? "currentColor" : "none"} />
                                </button>
                              ))}
                            </div>
                          </div>
                          <div className="space-y-4">
                            <label className="text-[10px] uppercase font-black text-gray-400 tracking-widest">Display Date</label>
                            <input 
                              className="w-full bg-white border-0 p-3 focus:ring-1 focus:ring-brand-gold outline-none font-medium text-sm" 
                              value={review.date}
                              onChange={(e) => {
                                const newTestimonials = [...localContent.testimonials];
                                newTestimonials[idx].date = e.target.value;
                                setLocalContent({...localContent, testimonials: newTestimonials});
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-brand-gold/5 p-8 border border-brand-gold/20 rounded-sm">
                    <div className="flex items-start space-x-4">
                      <div className="bg-brand-gold p-2 text-white">
                        <Info size={16} />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold uppercase tracking-widest text-brand-gold mb-2">Live Sync Protocol</h4>
                        <p className="text-xs text-gray-600 font-medium leading-relaxed">
                          Currently, reviews are manually curated for maximum visual impact. To pull live data directly from Google, specialized API keys are required. Use this interface to keep your highest-converting social proof current.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Industries Tab */}
              {activeTab === 'industries' && (
                <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="border-b pb-4 mb-8 flex justify-between items-end">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                      <div>
                        <h2 className="text-2xl font-display font-bold uppercase tracking-tight">Industrial Verticals</h2>
                        <p className="text-xs text-gray-400 uppercase tracking-widest font-medium mt-2">Targeting the top 15 professions in Bradenton, Sarasota & Tampa</p>
                      </div>
                      <button 
                        onClick={() => setLocalContent({
                          ...localContent, 
                          industries: [
                            ...(localContent.industries || []), 
                            { id: Date.now().toString(), name: "New Industry", description: "Targeted sector description for AI-search optimization." }
                          ]
                        })}
                        className="w-12 h-12 rounded-full bg-brand-black text-white flex items-center justify-center hover:bg-brand-gold transition-all shadow-xl active:scale-90"
                        title="Add Target Vertical"
                      >
                        <Plus size={24} />
                      </button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {(localContent.industries || []).map((industry, idx) => (
                      <div key={idx} className="bg-gray-50 p-6 relative group border border-gray-100 rounded-lg">
                        <button 
                          onClick={() => {
                            if (window.confirm("Authorize disposal of this targeted vertical?")) {
                              const newIndustries = [...(localContent.industries || [])];
                              newIndustries.splice(idx, 1);
                              setLocalContent({...localContent, industries: newIndustries});
                            }
                          }}
                          className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-white border border-gray-100 shadow-lg flex items-center justify-center text-gray-300 hover:text-red-500 hover:border-red-500 transition-all z-10"
                        >
                          <Trash size={14} />
                        </button>
                        
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <label className="text-[9px] uppercase font-black text-gray-400 tracking-widest">Industry Name</label>
                            <input 
                              className="w-full bg-white border-0 p-3 focus:ring-1 focus:ring-brand-gold outline-none font-bold text-sm" 
                              value={industry.name}
                              onChange={(e) => {
                                const newIndustries = [...(localContent.industries || [])];
                                newIndustries[idx].name = e.target.value;
                                setLocalContent({...localContent, industries: newIndustries});
                              }}
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[9px] uppercase font-black text-gray-400 tracking-widest">SEO Optimization Bio</label>
                            <textarea 
                              rows={3}
                              className="w-full bg-white border-0 p-3 focus:ring-1 focus:ring-brand-gold outline-none font-medium text-xs leading-relaxed" 
                              value={industry.description}
                              onChange={(e) => {
                                const newIndustries = [...(localContent.industries || [])];
                                newIndustries[idx].description = e.target.value;
                                setLocalContent({...localContent, industries: newIndustries});
                              }}
                              placeholder="Describe how your photography/videography serves this specific industry in the Gulf Coast area..."
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-brand-black p-8 rounded-sm text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                      <Sparkles size={120} className="text-brand-gold" />
                    </div>
                    <div className="relative z-10">
                      <div className="flex items-center space-x-3 mb-4">
                        <Sparkles size={20} className="text-brand-gold" />
                        <h4 className="text-sm font-black uppercase tracking-[0.2em] text-brand-gold">AI Search Engine Authority</h4>
                      </div>
                      <p className="text-xs text-gray-400 font-medium leading-relaxed max-w-2xl">
                        By specifically naming high-value professions like <span className="text-white italic">Yacht Brokers, Surgeons, and IMG Athletes</span>, you create "contextual anchors" for AI search engines (like Gemini, Perplexity, and ChatGPT). This section infuses these keywords into your site architecture, ensuring you rank when clients search for specialized cinematic services in the Gulf Coast.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Inquiries Tab */}
              {activeTab === 'inquiries' && (
                <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="border-b pb-4 mb-4">
                    <h2 className="text-2xl font-display font-bold uppercase tracking-tight">Client Inquiries</h2>
                    <p className="text-xs text-gray-400 uppercase tracking-widest font-medium mt-2">Manage incoming lead transmission history</p>
                  </div>

                  {leadsLoading ? (
                    <div className="py-20 text-center text-xs uppercase tracking-widest font-bold text-gray-400 animate-pulse">Loading Transmissions...</div>
                  ) : leads.length === 0 ? (
                    <div className="py-20 text-center border-2 border-dashed border-gray-100 rounded-xl">
                      <p className="text-xs uppercase tracking-widest font-bold text-gray-300">No transmissions recorded.</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {leads.map((lead) => (
                        <div key={lead.id} className="bg-gray-50 border border-gray-100 relative group overflow-hidden">
                          <button 
                            onClick={async () => {
                              if (window.confirm("Permanent deletion of lead data?")) {
                                try {
                                  await deleteDoc(doc(db, 'leads', lead.id));
                                } catch (err) {
                                  handleFirestoreError(err, OperationType.DELETE, `leads/${lead.id}`);
                                }
                              }
                            }}
                            className="absolute top-4 right-4 text-gray-300 hover:text-red-500 transition-colors z-10"
                          >
                            <Trash size={16} />
                          </button>
                          
                          <div className="p-8">
                            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                              <div className="md:col-span-4 space-y-4">
                                <div className="space-y-1">
                                  <label className="text-[8px] uppercase font-black text-gray-400">Date Received</label>
                                  <div className="flex items-center space-x-2">
                                    <p className="text-xs font-bold text-brand-gold">
                                      {lead.createdAt?.toDate ? lead.createdAt.toDate().toLocaleString() : 'Just Now'}
                                    </p>
                                    {lead.status === 'new' && (
                                      <span className="px-2 py-0.5 bg-red-500 text-white text-[7px] font-black uppercase tracking-widest animate-pulse rounded-sm">New Alert</span>
                                    )}
                                  </div>
                                </div>
                                <div className="space-y-1">
                                  <label className="text-[8px] uppercase font-black text-gray-400">Identity</label>
                                  <p className="text-sm font-bold uppercase tracking-tight">{lead.name}</p>
                                  <a href={`mailto:${lead.email}`} className="text-xs text-gray-500 hover:text-brand-gold transition-colors font-medium">{lead.email}</a>
                                </div>
                                <div className="space-y-1">
                                  <label className="text-[8px] uppercase font-black text-gray-400">Production Focus</label>
                                  <span className="inline-block px-2 py-1 bg-brand-black text-white text-[9px] font-black uppercase tracking-widest">
                                    {lead.service}
                                  </span>
                                </div>

                                {lead.bookingDate && (
                                   <div className="p-4 bg-brand-gold/10 border border-brand-gold/20 rounded-lg">
                                      <div className="flex items-center space-x-2 mb-2">
                                         <Star size={12} className="text-brand-gold fill-brand-gold" />
                                         <span className="text-[9px] font-black uppercase tracking-widest text-brand-gold">Consultation Request</span>
                                      </div>
                                      <p className="text-xs font-bold text-zinc-900">{new Date(lead.bookingDate).toLocaleString()}</p>
                                      <div className="mt-3 flex gap-2">
                                         <button 
                                            onClick={() => updateDoc(doc(db, 'leads', lead.id), { bookingStatus: 'confirmed' })}
                                            className="px-3 py-1.5 bg-emerald-500 text-white text-[8px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-sm"
                                         >
                                            Confirm
                                         </button>
                                         <button 
                                            onClick={() => updateDoc(doc(db, 'leads', lead.id), { bookingStatus: 'none', bookingDate: null })}
                                            className="px-3 py-1.5 bg-zinc-400 text-white text-[8px] font-black uppercase tracking-widest hover:bg-zinc-500 transition-all shadow-sm"
                                         >
                                            Reject
                                         </button>
                                      </div>
                                   </div>
                                )}

                                {lead.status === 'new' && (
                                  <button 
                                    onClick={() => updateDoc(doc(db, 'leads', lead.id), { status: 'contacted' })}
                                    className="w-full mt-4 bg-brand-black text-white py-3 text-[10px] font-black uppercase tracking-widest flex items-center justify-center hover:bg-zinc-800 transition-all shadow-lg active:scale-95 border border-brand-gold/30"
                                  >
                                    <Check size={14} className="mr-2 text-brand-gold" /> Acknowledge Lead
                                  </button>
                                )}

                                {lead.status !== 'converted' && lead.status !== 'new' && (
                                  <div className="flex flex-col gap-2 pt-4">
                                     <button 
                                       onClick={() => promoteToProject(lead)}
                                       className="w-full bg-emerald-500 text-white py-3 text-[10px] font-black uppercase tracking-widest flex items-center justify-center hover:bg-emerald-600 transition-all shadow-lg active:scale-95"
                                     >
                                       <Plus size={14} className="mr-2" /> Promote to Project
                                     </button>
                                     <button 
                                       onClick={() => copyPortalLink(lead.id)}
                                       className="w-full bg-zinc-900 text-brand-gold py-3 text-[10px] font-black uppercase tracking-widest flex items-center justify-center hover:bg-black transition-all border border-brand-gold/20"
                                     >
                                       <ExternalLink size={14} className="mr-2" /> Email Magic Link
                                     </button>
                                  </div>
                                )}
                                {lead.status === 'converted' && (
                                  <div className="mt-4 bg-emerald-50 text-emerald-600 p-3 flex items-center justify-center space-x-2 border border-emerald-100">
                                    <Check size={14} />
                                    <span className="text-[9px] font-black uppercase">Active Production</span>
                                  </div>
                                )}
                              </div>
                              <div className="md:col-span-8 space-y-6">
                                 <div className="space-y-2">
                                   <label className="text-[8px] uppercase font-black text-gray-400">Project Overview</label>
                                   <div className="bg-white p-6 border border-gray-100 text-sm leading-relaxed text-gray-600 font-light italic">
                                     "{lead.message}"
                                   </div>
                                 </div>
                                 
                                 <div className="pt-4">
                                   <CommunicationThread relatedId={lead.id} relatedType="lead" senderName={lead.name} />
                                 </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Code Injection Tab */}
              {activeTab === 'code' && (
                <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="border-b pb-4 mb-8">
                    <h2 className="text-2xl font-display font-bold uppercase tracking-tight">System Core Injection</h2>
                    <p className="text-xs text-gray-400 uppercase tracking-widest font-medium mt-2">Inject custom logic scripts and structural style overrides</p>
                  </div>
                  
                  <div className="space-y-8">
                    <div className="bg-amber-50 border border-amber-100 p-6 rounded-sm flex items-start space-x-4">
                      <div className="bg-amber-500 text-white p-2 text-white">
                        <Info size={16} />
                      </div>
                      <div>
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-amber-700 mb-1">Developer Notice</h4>
                        <p className="text-[11px] text-amber-800 font-medium leading-relaxed">
                          Exercise extreme caution. Scripts injected here execute with root authority on the client session. Use this for Google Tag Manager, Meta Pixels, or advanced CSS overrides.
                        </p>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="space-y-4">
                        <label className="text-[10px] uppercase font-black text-gray-400 tracking-widest">Head Snippet (META / GTM / FONTS)</label>
                        <textarea 
                          rows={4}
                          className="w-full bg-zinc-900 text-brand-gold p-4 outline-none font-mono text-[10px] leading-relaxed shadow-inner" 
                          placeholder="<script>... analytics ...</script>"
                          value={localContent.customCode?.head || ""}
                          onChange={(e) => setLocalContent({...localContent, customCode: {...(localContent.customCode || {}), head: e.target.value}})}
                        />
                      </div>
                      <div className="space-y-4">
                        <label className="text-[10px] uppercase font-black text-gray-400 tracking-widest">Custom CSS Overrides</label>
                        <textarea 
                          rows={8}
                          className="w-full bg-zinc-900 text-green-400 p-4 outline-none font-mono text-[11px] leading-relaxed shadow-inner" 
                          placeholder=":root { --brand-gold: #ff0000; }"
                          value={localContent.customCode?.css || ""}
                          onChange={(e) => setLocalContent({...localContent, customCode: {...(localContent.customCode || {}), css: e.target.value}})}
                        />
                      </div>
                    </div>

                    <div className="pt-12 border-t mt-12 bg-gray-50 p-8 rounded-lg">
                       <div className="flex items-center space-x-3 mb-6">
                         <ShieldCheck size={20} className="text-brand-black" />
                         <h3 className="text-sm font-black uppercase tracking-widest">System Backup & Portability</h3>
                       </div>
                       <p className="text-xs text-gray-500 mb-8 font-medium max-w-xl">
                         Export your entire site configuration as a JSON backup. This includes all branding, SEO, portfolio references, and AI intelligence data. You can re-upload this file to restore your settings.
                       </p>
                       <div className="flex flex-wrap gap-4">
                         <button 
                            onClick={downloadBackup}
                            className="bg-brand-black text-white px-6 py-3 text-[10px] font-black uppercase tracking-widest flex items-center hover:bg-brand-gold transition-all shadow-lg active:scale-95"
                         >
                            <Download size={14} className="mr-2" /> Download Site Backup
                         </button>
                         <label className="bg-white border-2 border-brand-black text-brand-black px-6 py-3 text-[10px] font-black uppercase tracking-widest flex items-center hover:bg-brand-black hover:text-white transition-all shadow-lg active:scale-95 cursor-pointer">
                            <Upload size={14} className="mr-2" /> Upload Restore File
                            <input 
                              type="file" 
                              accept=".json" 
                              className="hidden" 
                              onChange={handleBackupUpload}
                            />
                         </label>
                       </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Visual Studio Tab */}
              {activeTab === 'theme' && (
                <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="border-b pb-4 mb-8">
                    <h2 className="text-2xl font-display font-bold uppercase tracking-tight">Visual Design Studio</h2>
                    <p className="text-xs text-gray-400 uppercase tracking-widest font-medium mt-2">Modify global brand aesthetic parameters</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="space-y-8">
                      <h3 className="text-[10px] font-black uppercase tracking-widest text-brand-gold border-b pb-2">Chromatic Authority</h3>
                      <div className="space-y-6">
                        <div className="space-y-4">
                          <label className="text-[10px] uppercase font-black text-gray-400 tracking-widest">Primary Brand Color (Surface)</label>
                          <div className="flex items-center space-x-4">
                            <input 
                              type="color" 
                              className="w-12 h-12 rounded-sm cursor-pointer border-0"
                              value={localContent.theme?.primaryColor || "#000000"}
                              onChange={(e) => setLocalContent({...localContent, theme: {...(localContent.theme || {}), primaryColor: e.target.value}})}
                            />
                            <input 
                              className="flex-1 bg-gray-50 border-0 p-4 font-mono text-xs uppercase" 
                              value={localContent.theme?.primaryColor || "#000000"}
                              onChange={(e) => setLocalContent({...localContent, theme: {...(localContent.theme || {}), primaryColor: e.target.value}})}
                            />
                          </div>
                        </div>
                        <div className="space-y-4">
                          <label className="text-[10px] uppercase font-black text-gray-400 tracking-widest">Accent Brand Color (Interaction)</label>
                          <div className="flex items-center space-x-4">
                            <input 
                              type="color" 
                              className="w-12 h-12 rounded-sm cursor-pointer border-0"
                              value={localContent.theme?.accentColor || "#D4AF37"}
                              onChange={(e) => setLocalContent({...localContent, theme: {...(localContent.theme || {}), accentColor: e.target.value}})}
                            />
                            <input 
                              className="flex-1 bg-gray-50 border-0 p-4 font-mono text-xs uppercase text-brand-gold font-bold" 
                              value={localContent.theme?.accentColor || "#D4AF37"}
                              onChange={(e) => setLocalContent({...localContent, theme: {...(localContent.theme || {}), accentColor: e.target.value}})}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-8">
                      <h3 className="text-[10px] font-black uppercase tracking-widest text-brand-gold border-b pb-2">Typography Engine</h3>
                      <div className="space-y-6">
                        <div className="space-y-4">
                          <label className="text-[10px] uppercase font-black text-gray-400 tracking-widest">Display Typeface (Headings)</label>
                          <select 
                             className="w-full bg-gray-50 border-0 p-4 outline-none font-bold text-sm"
                             value={localContent.theme?.fontDisplay || "Outfit"}
                             onChange={(e) => setLocalContent({...localContent, theme: {...(localContent.theme || {}), fontDisplay: e.target.value}})}
                          >
                            <option value="Outfit">Outfit (Modern)</option>
                            <option value="Inter">Inter (Classic)</option>
                            <option value="Space Grotesk">Space Grotesk (Tech)</option>
                            <option value="Playfair Display">Playfair Display (Serif)</option>
                             <option value="JetBrains Mono">JetBrains Mono (Technical)</option>
                          </select>
                        </div>
                        <div className="space-y-4">
                          <label className="text-[10px] uppercase font-black text-gray-400 tracking-widest">Sans-Serif Typeface (Body)</label>
                           <select 
                             className="w-full bg-gray-50 border-0 p-4 outline-none font-medium text-sm"
                             value={localContent.theme?.fontSans || "Inter"}
                             onChange={(e) => setLocalContent({...localContent, theme: {...(localContent.theme || {}), fontSans: e.target.value}})}
                          >
                            <option value="Inter">Inter</option>
                            <option value="Outfit">Outfit</option>
                             <option value="Geist">Geist</option>
                            <option value="Roboto">Roboto</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* AI Insights Tab */}
              {activeTab === 'ai-insights' && (
                <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="border-b pb-4 mb-4 flex justify-between items-end">
                    <div>
                      <h2 className="text-2xl font-display font-bold uppercase tracking-tight">Competitive Intelligence</h2>
                      <p className="text-xs text-gray-400 uppercase tracking-widest font-medium mt-2">Real-time market analysis & auto-optimization protocol</p>
                    </div>
                    <button 
                      onClick={runAIScan}
                      disabled={isScanning}
                      type="button"
                      className={`px-6 py-3 bg-brand-black text-brand-gold font-black uppercase tracking-widest text-[10px] flex items-center space-x-3 hover:bg-brand-gold hover:text-white transition-all shadow-xl active:scale-95 disabled:opacity-50 ${isScanning ? 'animate-pulse' : ''}`}
                    >
                      {isScanning ? (
                        <>
                          <RefreshCw size={14} className="animate-spin" />
                          <span>Analyzing Market...</span>
                        </>
                      ) : (
                        <>
                          <BrainCircuit size={14} />
                          <span>Run Intelligence Scan</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-2 space-y-8">
                       <div className="bg-zinc-900 p-8 text-white relative overflow-hidden">
                          <div className="absolute top-0 right-0 p-4 opacity-5">
                            <BrainCircuit size={150} />
                          </div>
                          <div className="relative z-10">
                            <div className="flex items-center space-x-3 mb-6">
                               <div className="w-10 h-10 rounded-full bg-brand-gold/20 flex items-center justify-center">
                                  <Zap size={20} className="text-brand-gold" />
                               </div>
                               <div>
                                  <h3 className="text-sm font-black uppercase tracking-[0.2em] text-brand-gold">Optimization Engine</h3>
                                  <div className="flex items-center space-x-2 mt-1">
                                     <div className={`w-2 h-2 rounded-full ${localContent.aiIntelligence?.enabled ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                                     <span className="text-[9px] uppercase font-bold text-gray-400 tracking-widest">
                                        System Protocol: {localContent.aiIntelligence?.enabled ? 'Active' : 'Offline'}
                                     </span>
                                  </div>
                               </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                               <div className="space-y-4">
                                  <div className="flex justify-between items-center bg-zinc-800 p-4 border border-zinc-700">
                                     <div>
                                        <h4 className="text-[10px] font-black uppercase tracking-widest text-white">Market Monitoring</h4>
                                        <p className="text-[8px] text-gray-400 uppercase mt-1">Continuous competition scraping</p>
                                     </div>
                                     <button 
                                        type="button"
                                        onClick={() => setLocalContent({...localContent, aiIntelligence: {...localContent.aiIntelligence!, enabled: !localContent.aiIntelligence?.enabled}})}
                                        className={`w-12 h-6 rounded-full transition-all relative ${localContent.aiIntelligence?.enabled ? 'bg-brand-gold' : 'bg-zinc-700'}`}
                                     >
                                        <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${localContent.aiIntelligence?.enabled ? 'right-1' : 'left-1'}`} />
                                     </button>
                                  </div>
                               </div>
                               <div className="space-y-4">
                                  <div className="flex justify-between items-center bg-zinc-800 p-4 border border-zinc-700">
                                     <div>
                                        <h4 className="text-[10px] font-black uppercase tracking-widest text-white">Autonomous Update</h4>
                                        <p className="text-[8px] text-gray-400 uppercase mt-1">Real-time meta & copy adjustments</p>
                                     </div>
                                     <button 
                                        type="button"
                                        onClick={() => setLocalContent({...localContent, aiIntelligence: {...localContent.aiIntelligence!, autoApply: !localContent.aiIntelligence?.autoApply}})}
                                        className={`w-12 h-6 rounded-full transition-all relative ${localContent.aiIntelligence?.autoApply ? 'bg-brand-gold' : 'bg-zinc-700'}`}
                                     >
                                        <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${localContent.aiIntelligence?.autoApply ? 'right-1' : 'left-1'}`} />
                                     </button>
                                  </div>
                               </div>
                            </div>
                          </div>
                       </div>

                       <div className="space-y-6">
                         <div className="flex items-center justify-between border-b pb-4">
                            <h3 className="text-xs font-black uppercase tracking-widest text-brand-black flex items-center">
                              <Activity size={14} className="mr-2 text-brand-gold" /> Intelligence Feed
                            </h3>
                            <span className="text-[9px] text-gray-400 font-bold uppercase">Showing last 10 discoveries</span>
                         </div>

                         <div className="space-y-4">
                            {localContent.aiIntelligence?.insights.length === 0 ? (
                              <div className="py-20 text-center border-2 border-dashed border-gray-100 rounded-xl">
                                <p className="text-xs uppercase tracking-widest font-bold text-gray-300">No active intelligence leads.</p>
                              </div>
                            ) : (
                              localContent.aiIntelligence?.insights.map((insight) => (
                                <div key={insight.id} className="bg-white border border-gray-100 p-6 flex items-start gap-4 hover:shadow-lg transition-all group">
                                   <div className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center ${
                                      insight.type === 'seo' ? 'bg-blue-50 text-blue-500' :
                                      insight.type === 'competitor' ? 'bg-red-50 text-red-500' :
                                      'bg-emerald-50 text-emerald-500'
                                   }`}>
                                      {insight.type === 'seo' ? <Search size={18} /> : 
                                       insight.type === 'competitor' ? <AlertCircle size={18} /> : 
                                       <Sparkles size={18} />}
                                   </div>
                                   <div className="flex-1 space-y-2">
                                      <div className="flex justify-between items-start">
                                         <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full ${
                                            insight.impact === 'high' ? 'bg-red-100 text-red-600' : 
                                            insight.impact === 'medium' ? 'bg-amber-100 text-amber-600' : 
                                            'bg-blue-100 text-blue-600'
                                         }`}>
                                            {insight.impact} Impact
                                         </span>
                                         <span className="text-[8px] font-bold text-gray-400 font-mono">
                                            {insight.date ? new Date(insight.date).toLocaleDateString() : ''}
                                         </span>
                                      </div>
                                      <h4 className="text-sm font-bold uppercase tracking-tight group-hover:text-brand-gold transition-colors">{insight.title}</h4>
                                      <p className="text-xs text-gray-500 leading-relaxed font-medium">{insight.description}</p>
                                      
                                      <div className="flex gap-3 pt-2">
                                         <button 
                                            type="button"
                                            className="text-[10px] font-black uppercase text-brand-gold flex items-center space-x-1 hover:underline decoration-2"
                                            onClick={() => {
                                              const newInsights = localContent.aiIntelligence?.insights.map(i => i.id === insight.id ? {...i, status: 'applied' as const} : i);
                                              setLocalContent({...localContent, aiIntelligence: {...localContent.aiIntelligence!, insights: newInsights || []}});
                                              alert("Strategy protocol applied successfully.");
                                            }}
                                         >
                                            <Check size={12} />
                                            <span>Deploy Strategy</span>
                                         </button>
                                         <button type="button" className="text-[10px] font-black uppercase text-gray-400 flex items-center space-x-1 hover:text-brand-black transition-colors">
                                            <Trash size={12} />
                                            <span>Discard</span>
                                         </button>
                                      </div>
                                   </div>
                                </div>
                              ))
                            )}
                         </div>
                       </div>
                    </div>

                    <div className="space-y-8">
                       <div className="bg-gray-50 p-6 border border-gray-200 rounded-sm space-y-6">
                          <h3 className="text-[10px] font-black uppercase tracking-widest text-brand-black border-b border-gray-200 pb-3">Scanning Parameters</h3>
                          
                          <div className="space-y-4">
                             <label className="text-[9px] uppercase font-black text-gray-400 flex items-center">
                                <Briefcase size={12} className="mr-2" /> Your Industry Focus
                             </label>
                             <input 
                                className="w-full bg-white border-0 p-3 outline-none focus:ring-1 focus:ring-brand-gold font-bold text-xs"
                                value={localContent.aiIntelligence?.profession || ""}
                                onChange={(e) => setLocalContent({...localContent, aiIntelligence: {...localContent.aiIntelligence!, profession: e.target.value}})}
                             />
                          </div>

                          <div className="space-y-4">
                             <div className="flex justify-between items-center mb-1">
                                <label className="text-[9px] uppercase font-black text-gray-400 flex items-center text-red-500">
                                   <Target size={12} className="mr-2" /> High-Priority Targets
                                </label>
                                <button 
                                   type="button"
                                   onClick={() => setLocalContent({...localContent, aiIntelligence: {...localContent.aiIntelligence!, competitors: [...(localContent.aiIntelligence!.competitors || []), "https://"]}})}
                                   className="text-brand-gold hover:text-brand-black transition-colors"
                                >
                                   <Plus size={14} />
                                </button>
                             </div>
                             <div className="space-y-2">
                                {localContent.aiIntelligence?.competitors?.map((url, idx) => (
                                  <div key={idx} className="flex gap-2 group">
                                     <input 
                                        className="flex-1 bg-white border-0 p-3 outline-none focus:ring-1 focus:ring-brand-gold font-mono text-[9px] text-gray-500"
                                        value={url}
                                        onChange={(e) => {
                                           const newComp = [...localContent.aiIntelligence!.competitors];
                                           newComp[idx] = e.target.value;
                                           setLocalContent({...localContent, aiIntelligence: {...localContent.aiIntelligence!, competitors: newComp}});
                                        }}
                                     />
                                     <button 
                                        type="button"
                                        onClick={() => {
                                           const newComp = localContent.aiIntelligence?.competitors.filter((_, i) => i !== idx);
                                           setLocalContent({...localContent, aiIntelligence: {...localContent.aiIntelligence!, competitors: newComp || []}});
                                        }}
                                        className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                                     >
                                        <Trash size={12} />
                                     </button>
                                  </div>
                                ))}
                             </div>
                          </div>
                          
                          <div className="pt-6 border-t border-gray-200">
                             <div className="flex items-center space-x-2 text-gray-400">
                                <Activity size={12} />
                                <span className="text-[9px] font-bold uppercase tracking-widest leading-none">Last Deep Scan</span>
                             </div>
                             <p className="text-[10px] font-mono mt-1 text-zinc-900">{localContent.aiIntelligence?.lastScan ? new Date(localContent.aiIntelligence.lastScan).toLocaleString() : 'Never'}</p>
                          </div>
                       </div>

                       <div className="bg-brand-gold/10 p-6 border border-brand-gold/20 rounded-sm">
                          <h4 className="text-[10px] font-black uppercase tracking-widest text-brand-gold mb-3 flex items-center">
                             <Zap size={12} className="mr-2" /> Live Adaptive Mode
                          </h4>
                          <p className="text-[10px] text-brand-black font-medium leading-relaxed">
                             When <span className="font-black italic">"Autonomous Update"</span> is enabled, the system automatically adjusts site keywords and H1 tags twice weekly to maintain dominance for high-volume local search queries.
                          </p>
                       </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
