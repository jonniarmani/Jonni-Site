import React, { useState } from 'react';
import { useContent } from '../lib/ContentContext';
import { auth, googleProvider, signInWithPopup, signOut, db, doc, setDoc, handleFirestoreError, OperationType, collection, deleteDoc, onSnapshot } from '../lib/firebase';
import { Save, LogIn, LogOut, ChevronRight, Info, Home, User, Briefcase, Image as ImageIcon, Trash, Plus, Megaphone, Video as VideoIcon, MessageSquare, Star, Code, Palette, Upload, RefreshCw, Globe, Twitter, ShieldCheck, Check, Sparkles, Filter, Settings, Activity } from 'lucide-react';
import FileUploader from '../components/FileUploader';

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

type Tab = 'identity' | 'home' | 'about' | 'services' | 'video-work' | 'photo-work' | 'promo' | 'testimonials' | 'inquiries' | 'code' | 'theme';

export default function Admin() {
  const { content, user, isAdmin, loading } = useContent();
  const [localContent, setLocalContent] = useState(content);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('identity');
  // Leads state
  const [leads, setLeads] = useState<any[]>([]);
  const [leadsLoading, setLeadsLoading] = useState(false);

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
    { id: 'inquiries', label: 'Leads', icon: MessageSquare, color: 'text-indigo-500' },
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
                  </div>
                  {activeTab === tab.id && <ChevronRight size={14} className="text-brand-gold animate-bounce-x" />}
                  {activeTab === tab.id && <div className="absolute left-0 w-1 h-8 bg-brand-gold rounded-full" />}
                </button>
              ))}
            </div>
            
            <div className="grid grid-cols-2 gap-2 mt-8">
               <StatCircle label="Status" value="Live" icon={Activity} />
               <StatCircle label="Leads" value={leads.length} icon={Filter} />
            </div>
          </div>

          {/* Enhanced Editor Area */}
          <div className="lg:col-span-9">
            <div className="bg-white p-8 md:p-12 shadow-2xl border border-gray-100 min-h-[700px] rounded-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-brand-gold/5 rounded-full -mr-32 -mt-32 blur-3xl pointer-events-none" />
              
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
                        <button 
                          onClick={() => {
                            if (window.confirm("Authorize permanent disposal of this strategic service architecture?")) {
                              const newServices = localContent.services.filter((_, i) => i !== idx);
                              setLocalContent({...localContent, services: newServices});
                            }
                          }}
                          className="absolute -top-3 -right-3 w-10 h-10 rounded-full bg-white border border-gray-100 shadow-xl flex items-center justify-center text-gray-300 hover:text-red-500 hover:border-red-500 transition-all z-10"
                          title="Dispose Service"
                        >
                          <Trash size={16} />
                        </button>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
                                   const prevItem = filtered[idx - 1];
                                   const prevRealIdx = localContent.portfolio.findIndex(p => p === prevItem);
                                   [newPortfolio[realIdx], newPortfolio[prevRealIdx]] = [newPortfolio[prevRealIdx], newPortfolio[realIdx]];
                                   setLocalContent({...localContent, portfolio: newPortfolio});
                                 }}
                                 className="w-8 h-8 rounded-full flex items-center justify-center bg-white border border-gray-100 text-gray-400 hover:text-brand-gold hover:border-brand-gold disabled:opacity-20 transition-all font-bold text-xs shadow-sm"
                                 title="Move Up"
                               >
                                 ↑
                               </button>
                               <button 
                                 disabled={idx === localContent.portfolio.filter(p => p.type === 'video').length - 1}
                                 onClick={() => {
                                   const filtered = localContent.portfolio.filter(p => p.type === 'video');
                                   if (idx === filtered.length - 1) return;
                                   const newPortfolio = [...localContent.portfolio];
                                   const nextItem = filtered[idx + 1];
                                   const nextRealIdx = localContent.portfolio.findIndex(p => p === nextItem);
                                   [newPortfolio[realIdx], newPortfolio[nextRealIdx]] = [newPortfolio[nextRealIdx], newPortfolio[realIdx]];
                                   setLocalContent({...localContent, portfolio: newPortfolio});
                                 }}
                                 className="w-8 h-8 rounded-full flex items-center justify-center bg-white border border-gray-100 text-gray-400 hover:text-brand-gold hover:border-brand-gold disabled:opacity-20 transition-all font-bold text-xs shadow-sm"
                                 title="Move Down"
                               >
                                 ↓
                               </button>
                               <button 
                                 onClick={() => {
                                   if (window.confirm("Authorize permanent disposal of this media asset?")) {
                                     const newWork = localContent.portfolio.filter((_, i) => i !== realIdx);
                                     setLocalContent({...localContent, portfolio: newWork});
                                   }
                                 }}
                                 className="w-8 h-8 rounded-full flex items-center justify-center bg-white border border-gray-100 text-gray-300 hover:text-red-500 hover:border-red-500 transition-all shadow-sm"
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
                          
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <label className="text-[10px] uppercase font-black text-gray-400">Category Tag</label>
                                <input 
                                  className="w-full p-3 bg-white border-0 focus:ring-1 focus:ring-brand-gold outline-none font-bold text-xs" 
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
                                  className="w-full p-3 bg-white border-0 focus:ring-1 focus:ring-brand-gold outline-none font-bold text-xs" 
                                  value={item.title}
                                  onChange={(e) => {
                                    const newPortfolio = [...localContent.portfolio];
                                    newPortfolio[realIdx] = {...newPortfolio[realIdx], title: e.target.value};
                                    setLocalContent({...localContent, portfolio: newPortfolio});
                                  }}
                                />
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
                                 className="w-8 h-8 rounded-full flex items-center justify-center bg-white border border-gray-100 text-gray-400 hover:text-brand-gold shadow-sm transition-all shadow-sm"
                                 title="Move Up"
                               >
                                 ↑
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
                                 className="w-8 h-8 rounded-full flex items-center justify-center bg-white border border-gray-100 text-gray-400 hover:text-brand-gold shadow-sm transition-all shadow-sm"
                                 title="Move Down"
                               >
                                 ↓
                               </button>
                               <button 
                                 onClick={() => {
                                   if (window.confirm("Authorize permanent disposal of this still asset?")) {
                                     const newWork = localContent.portfolio.filter((_, i) => i !== realIdx);
                                     setLocalContent({...localContent, portfolio: newWork});
                                   }
                                 }}
                                 className="w-8 h-8 rounded-full flex items-center justify-center bg-white border border-gray-100 text-gray-300 hover:text-red-500 shadow-sm transition-all shadow-sm"
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
                          
                          <div className="space-y-3">
                            <div className="space-y-1">
                              <label className="text-[8px] uppercase font-black text-gray-400">Category</label>
                              <input 
                                className="w-full p-2 bg-white border-0 focus:ring-1 focus:ring-brand-gold outline-none font-bold text-[10px]" 
                                value={item.category}
                                onChange={(e) => {
                                  const newPortfolio = [...localContent.portfolio];
                                  newPortfolio[realIdx] = {...newPortfolio[realIdx], category: e.target.value};
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
                        <div key={lead.id} className="bg-gray-50 p-8 border border-gray-100 relative group">
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
                            className="absolute top-4 right-4 text-gray-300 hover:text-red-500 transition-colors"
                          >
                            <Trash size={16} />
                          </button>
                          
                          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                            <div className="md:col-span-4 space-y-4">
                              <div className="space-y-1">
                                <label className="text-[8px] uppercase font-black text-gray-400">Date Received</label>
                                <p className="text-xs font-bold text-brand-gold">
                                  {lead.createdAt?.toDate ? lead.createdAt.toDate().toLocaleString() : 'Just Now'}
                                </p>
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
                            </div>
                            <div className="md:col-span-8 space-y-2">
                               <label className="text-[8px] uppercase font-black text-gray-400">Project Overview</label>
                               <div className="bg-white p-6 border border-gray-100 text-sm leading-relaxed text-gray-600 font-light italic">
                                 "{lead.message}"
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
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
