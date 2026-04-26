import React, { useState } from 'react';
import { useContent } from '../lib/ContentContext';
import { auth, googleProvider, signInWithPopup, signOut, db, doc, setDoc, handleFirestoreError, OperationType, collection, deleteDoc, onSnapshot } from '../lib/firebase';
import { Save, LogIn, LogOut, ChevronRight, Info, Home, User, Briefcase, Image as ImageIcon, Trash, Plus, Megaphone, Video as VideoIcon, MessageSquare } from 'lucide-react';

type Tab = 'identity' | 'home' | 'about' | 'services' | 'video-work' | 'photo-work' | 'promo' | 'inquiries';

export default function Admin() {
  const { content, user, isAdmin, loading } = useContent();
  const [localContent, setLocalContent] = useState(content);
  const [isSaving, setIsSaving] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>('identity');
  const [leads, setLeads] = useState<any[]>([]);
  const [leadsLoading, setLeadsLoading] = useState(false);

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
    { id: 'identity', label: 'Identity', icon: Info },
    { id: 'home', label: 'Home', icon: Home },
    { id: 'about', label: 'About', icon: User },
    { id: 'services', label: 'Services', icon: Briefcase },
    { id: 'video-work', label: 'Video Work', icon: VideoIcon },
    { id: 'photo-work', label: 'Photo Work', icon: ImageIcon },
    { id: 'promo', label: 'Promotions', icon: Megaphone },
    { id: 'inquiries', label: 'Inquiries', icon: MessageSquare },
  ];

  return (
    <div className="pt-32 pb-40 bg-zinc-50 min-h-screen">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div>
            <span className="text-brand-gold font-bold uppercase tracking-[0.2em] text-xs mb-4 block">Visual Command Center</span>
            <h1 className="text-5xl font-display font-bold tracking-tighter uppercase">Studio <span className="italic font-light text-gray-400">Admin.</span></h1>
          </div>
          <div className="flex gap-4 w-full md:w-auto">
            <button 
              onClick={() => setIsPreviewOpen(!isPreviewOpen)}
              className="flex-grow md:flex-grow-0 bg-white border border-gray-200 px-6 py-3 font-bold uppercase tracking-widest text-[9px] flex items-center justify-center hover:bg-zinc-50 transition-all rounded-sm"
            >
              {isPreviewOpen ? "Hide Preview" : "Live Preview"}
            </button>
            <button 
              onClick={handleSave}
              disabled={isSaving}
              className="flex-grow md:flex-grow-0 bg-brand-gold text-white px-8 py-3 font-bold uppercase tracking-widest text-xs flex items-center justify-center hover:scale-105 transition-all shadow-lg"
            >
              <Save size={16} className="mr-2" /> {isSaving ? "Syncing..." : "Save Changes"}
            </button>
            <button 
              onClick={() => signOut(auth)}
              className="flex-grow md:flex-grow-0 bg-white border border-gray-200 px-8 py-3 font-bold uppercase tracking-widest text-xs flex items-center justify-center hover:bg-red-50 hover:text-red-600 transition-all"
            >
              <LogOut size={16} className="mr-2" /> Exit
            </button>
          </div>
        </div>

        <div className={`grid grid-cols-1 ${isPreviewOpen ? 'lg:grid-cols-12' : 'lg:grid-cols-12'} gap-12`}>
          {/* Navigation Sidebar */}
          <div className={`${isPreviewOpen ? 'lg:col-span-2' : 'lg:col-span-3'} space-y-2`}>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as Tab)}
                className={`w-full flex items-center space-x-4 px-6 py-4 font-bold uppercase tracking-widest text-[10px] transition-all rounded-sm ${
                  activeTab === tab.id 
                    ? 'bg-brand-black text-white shadow-xl translate-x-1' 
                    : 'bg-white text-gray-400 hover:bg-gray-100'
                }`}
              >
                <tab.icon size={14} />
                <span>{tab.label}</span>
              </button>
            ))}
            
            <div className={`mt-12 bg-white border border-gray-100 p-6 rounded-sm ${isPreviewOpen ? 'hidden md:block' : ''}`}>
              <h3 className="text-brand-gold font-bold uppercase tracking-widest text-[9px] mb-4">System Data</h3>
              <ul className="space-y-3 text-[9px] font-bold text-gray-400 uppercase tracking-wider">
                 <li className="flex justify-between"><span>Status</span> <span className="text-green-500">Live</span></li>
                 <li className="flex justify-between"><span>Auth</span> <span className="text-zinc-900 italic">Owner</span></li>
              </ul>
            </div>
          </div>

          {/* Editor Area */}
          <div className={`${isPreviewOpen ? 'lg:col-span-6' : 'lg:col-span-9'}`}>
            <div className="bg-white p-8 shadow-sm border border-gray-100 min-h-[600px] rounded-sm">
              
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
                        className="text-[10px] bg-brand-black text-white px-4 py-2 font-bold uppercase tracking-widest hover:bg-brand-gold transition-colors"
                      >
                        + Add Visual
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {localContent.home.heroVisuals.map((visual, idx) => (
                        <div key={idx} className="bg-gray-50 p-6 border border-gray-100 space-y-4 relative group">
                          <button 
                            onClick={() => {
                              const newHero = localContent.home.heroVisuals.filter((_, i) => i !== idx);
                              setLocalContent({...localContent, home: {...localContent.home, heroVisuals: newHero}});
                            }}
                            className="absolute top-2 right-2 text-gray-300 hover:text-red-500 transition-colors"
                          >
                            <Trash size={14} />
                          </button>
                          
                          <div className="aspect-video bg-black overflow-hidden mb-4">
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
                            <label className="text-[10px] uppercase font-black text-gray-400">Source URL</label>
                            <input 
                              className="w-full text-[10px] p-2 bg-white border-0 outline-none focus:ring-1 focus:ring-brand-gold" 
                              value={visual.url}
                              onChange={(e) => {
                                const newHero = [...localContent.home.heroVisuals];
                                newHero[idx] = {...newHero[idx], url: e.target.value};
                                setLocalContent({...localContent, home: {...localContent.home, heroVisuals: newHero}});
                              }}
                            />
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
                      <label className="text-[10px] uppercase font-black text-gray-400 tracking-widest">Authority Secondary Visual (Direct URL)</label>
                      <input 
                        className="w-full bg-gray-50 border-0 p-4 focus:ring-1 focus:ring-brand-gold outline-none font-medium" 
                        value={localContent.home.lensImage}
                        onChange={(e) => setLocalContent({...localContent, home: {...localContent.home, lensImage: e.target.value}})}
                      />
                    </div>
                    <div className="space-y-4">
                      <label className="text-[10px] uppercase font-black text-gray-400 tracking-widest">CTA Section Background (Direct URL)</label>
                      <input 
                        className="w-full bg-gray-50 border-0 p-4 focus:ring-1 focus:ring-brand-gold outline-none font-medium" 
                        value={localContent.home.ctaBackground}
                        onChange={(e) => setLocalContent({...localContent, home: {...localContent.home, ctaBackground: e.target.value}})}
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
                      <label className="text-[10px] uppercase font-black text-gray-400 tracking-widest">Profile Image (Direct URL)</label>
                      <div className="flex space-x-4">
                        <div className="w-20 h-20 bg-gray-100 overflow-hidden">
                          <img src={localContent.about.profileImage} alt="" className="w-full h-full object-cover" />
                        </div>
                        <input 
                          className="flex-1 bg-gray-50 border-0 p-4 focus:ring-1 focus:ring-brand-gold outline-none font-medium" 
                          value={localContent.about.profileImage}
                          onChange={(e) => setLocalContent({...localContent, about: {...localContent.about, profileImage: e.target.value}})}
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
                    <div>
                      <h2 className="text-2xl font-display font-bold uppercase tracking-tight">Services Offerings</h2>
                      <p className="text-xs text-gray-400 uppercase tracking-widest font-medium mt-2">Manage cinematic service architecture</p>
                    </div>
                    <button 
                      onClick={() => {
                        const newServices = [...localContent.services, { id: Date.now().toString(), title: "New Service", short: "", description: "", whoItsFor: "", outcome: "", icon: "Video", visualUrl: "", visualType: 'image' as const }];
                        setLocalContent({...localContent, services: newServices});
                      }}
                      className="text-[10px] bg-brand-black text-white px-4 py-2 font-bold uppercase tracking-widest hover:bg-brand-gold transition-colors"
                    >
                      + Add Service
                    </button>
                  </div>
                  <div className="space-y-8">
                    {localContent.services.map((service, idx) => (
                      <div key={idx} className="p-8 bg-gray-50 border border-gray-100 rounded-lg group hover:bg-zinc-100 transition-colors relative">
                        <button 
                          onClick={() => {
                            const newServices = localContent.services.filter((_, i) => i !== idx);
                            setLocalContent({...localContent, services: newServices});
                          }}
                          className="absolute top-4 right-4 text-gray-300 hover:text-red-500 transition-colors"
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
                              <label className="text-[10px] uppercase font-black text-gray-400">Visual URL</label>
                              <input 
                                className="w-full p-4 bg-white border-0 focus:ring-1 focus:ring-brand-gold outline-none text-xs" 
                                value={service.visualUrl || ""}
                                onChange={(e) => {
                                  const newServices = [...localContent.services];
                                  newServices[idx] = {...newServices[idx], visualUrl: e.target.value};
                                  setLocalContent({...localContent, services: newServices});
                                }}
                              />
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
                    <div>
                      <h2 className="text-2xl font-display font-bold uppercase tracking-tight">Video Portfolio</h2>
                      <p className="text-xs text-gray-400 uppercase tracking-widest font-medium mt-2">Manage cinematic motion projects</p>
                    </div>
                    <button 
                      onClick={() => {
                        const newWork = [...localContent.portfolio, { category: "Brand Story", title: "New Video Project", placeholder: "", url: "#", videoUrl: "", type: 'video' }];
                        setLocalContent({...localContent, portfolio: newWork});
                      }}
                      className="text-[10px] bg-brand-black text-white px-4 py-2 font-bold uppercase tracking-widest hover:bg-brand-gold transition-colors"
                    >
                      + Add Video Project
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {localContent.portfolio.filter(item => item.type === 'video').map((item, idx) => {
                      const realIdx = localContent.portfolio.findIndex(p => p === item);
                      return (
                        <div key={realIdx} className="p-6 bg-gray-50 border border-gray-100 rounded-lg space-y-4 relative">
                          <button 
                            onClick={() => {
                              const newWork = localContent.portfolio.filter((_, i) => i !== realIdx);
                              setLocalContent({...localContent, portfolio: newWork});
                            }}
                            className="absolute top-4 right-4 text-gray-300 hover:text-red-500 transition-colors"
                          >
                            <Trash size={16} />
                          </button>
                          
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
                              <label className="text-[10px] uppercase font-black text-gray-400">Poster / Placeholder Image URL</label>
                              <input 
                                className="w-full p-3 bg-white border-0 focus:ring-1 focus:ring-brand-gold outline-none text-[10px]" 
                                value={item.placeholder}
                                onChange={(e) => {
                                  const newPortfolio = [...localContent.portfolio];
                                  newPortfolio[realIdx] = {...newPortfolio[realIdx], placeholder: e.target.value};
                                  setLocalContent({...localContent, portfolio: newPortfolio});
                                }}
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-[10px] uppercase font-black text-gray-400">Video Source Link (Vimeo/Direct)</label>
                              <input 
                                className="w-full p-3 bg-white border-0 focus:ring-1 focus:ring-brand-gold outline-none text-[10px] font-mono text-brand-gold" 
                                value={item.videoUrl || ""}
                                onChange={(e) => {
                                  const newPortfolio = [...localContent.portfolio];
                                  newPortfolio[realIdx] = {...newPortfolio[realIdx], videoUrl: e.target.value};
                                  setLocalContent({...localContent, portfolio: newPortfolio});
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
                    <div>
                      <h2 className="text-2xl font-display font-bold uppercase tracking-tight">Photo Gallery</h2>
                      <p className="text-xs text-gray-400 uppercase tracking-widest font-medium mt-2">Manage high-end stills and brand photography</p>
                    </div>
                    <button 
                      onClick={() => {
                        const newWork = [...localContent.portfolio, { category: "Branding", title: "New Photo Project", placeholder: "", url: "#", videoUrl: "", type: 'photo' }];
                        setLocalContent({...localContent, portfolio: newWork});
                      }}
                      className="text-[10px] bg-brand-black text-white px-4 py-2 font-bold uppercase tracking-widest hover:bg-brand-gold transition-colors"
                    >
                      + Add Photo Project
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {localContent.portfolio.filter(item => item.type === 'photo').map((item, idx) => {
                      const realIdx = localContent.portfolio.findIndex(p => p === item);
                      return (
                        <div key={realIdx} className="p-4 bg-gray-50 border border-gray-100 rounded-lg space-y-4 relative group">
                          <button 
                            onClick={() => {
                              const newWork = localContent.portfolio.filter((_, i) => i !== realIdx);
                              setLocalContent({...localContent, portfolio: newWork});
                            }}
                            className="absolute top-2 right-2 text-gray-300 hover:text-red-500 transition-colors z-10"
                          >
                            <Trash size={14} />
                          </button>
                          
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
                            <div className="space-y-3 pt-4 border-t border-gray-100">
                              <label className="text-[8px] uppercase font-black text-gray-400">Gallery Images (Up to 4)</label>
                              {[0, 1, 2, 3].map((imgIdx) => (
                                <div key={imgIdx} className="space-y-1">
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
                                </div>
                              ))}
                            </div>
                            <div className="space-y-1">
                              <label className="text-[8px] uppercase font-black text-gray-400">Main Thumbnail URL</label>
                              <input 
                                className="w-full p-2 bg-white border-0 focus:ring-1 focus:ring-brand-gold outline-none text-[8px]" 
                                value={item.placeholder}
                                onChange={(e) => {
                                  const newPortfolio = [...localContent.portfolio];
                                  newPortfolio[realIdx] = {...newPortfolio[realIdx], placeholder: e.target.value};
                                  setLocalContent({...localContent, portfolio: newPortfolio});
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
            </div>
          </div>

          {/* Preview Panel */}
          {isPreviewOpen && (
            <div className="lg:col-span-4 sticky top-32 h-[calc(100vh-160px)]">
              <div className="bg-brand-black w-full h-full rounded-sm shadow-2xl overflow-hidden border border-zinc-800 flex flex-col relative">
                <div className="flex items-center justify-between px-4 py-3 bg-zinc-900 border-b border-zinc-800">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 rounded-full bg-red-500" />
                    <div className="w-2 h-2 rounded-full bg-yellow-500" />
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                  </div>
                  <span className="text-[8px] font-black tracking-[0.3em] text-white/40 uppercase">Viewport Preview</span>
                  <div className="w-6" />
                </div>
                
                <div className="flex-1 overflow-y-auto overflow-x-hidden p-8 scale-90 origin-top transform-gpu">
                  <span className="text-brand-gold font-black uppercase tracking-[0.5em] text-[8px] mb-8 block">Project Analysis</span>
                  <h2 className="text-4xl font-display font-bold text-white mb-8 leading-tight">
                    {localContent.brand.tagline.split('.')[0]}.<br/>
                    <span className="text-white/20 italic">{localContent.brand.tagline.split('.')[1] || ""}</span>
                  </h2>
                  <p className="text-sm font-light text-gray-400 leading-relaxed mb-12">
                    {localContent.brand.taglineExtended}
                  </p>
                  
                  <div className="space-y-4">
                    <div className="aspect-video bg-zinc-800 rounded-sm animate-pulse" />
                    <div className="h-4 w-3/4 bg-zinc-800 rounded-full" />
                    <div className="h-4 w-1/2 bg-zinc-800 rounded-full" />
                  </div>
                </div>
                
                <div className="absolute bottom-4 left-0 right-0 px-4">
                   <div className="bg-brand-gold/10 border border-brand-gold/20 p-3 rounded-sm text-center">
                     <span className="text-brand-gold text-[8px] font-black uppercase tracking-widest">Unsaved Changes detected</span>
                   </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
