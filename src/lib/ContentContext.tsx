import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, db, onSnapshot, doc, handleFirestoreError, OperationType } from './firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { BRAND, SERVICES, PORTFOLIO, ABOUT_CONTENT, HOME_CONTENT, TESTIMONIALS, INDUSTRIES, SCHEMA_JSON_LD, SEO } from '../config';

interface SiteContent {
  brand: typeof BRAND;
  services: (typeof SERVICES[0] & { 
    visualUrl?: string; 
    visualType?: 'image' | 'video';
    photoCategory?: string;
    objectPosition?: string;
  })[];
  portfolio: (typeof PORTFOLIO[0] & { 
    videoUrl?: string; 
    type: 'video' | 'photo';
    alt?: string;
    client?: string;
    year?: string;
    isFeatured?: boolean;
    images?: string[];
    objectPosition?: string;
  })[];
  about: typeof ABOUT_CONTENT;
  home: typeof HOME_CONTENT;
  promo: {
    enabled: boolean;
    title: string;
    message: string;
    code: string;
  };
  testimonials: typeof TESTIMONIALS;
  industries?: typeof INDUSTRIES;
  contact: {
    title: string;
    subtitle: string;
    description: string;
    image: string;
    email: string;
    phone: string;
    address: string;
    availability: string;
    formTitle: string;
    formSubtitle: string;
  };
  customCode?: {
    head?: string;
    bodyStart?: string;
    bodyEnd?: string;
    css?: string;
  };
  theme?: {
    primaryColor?: string;
    accentColor?: string;
    fontDisplay?: string;
    fontSans?: string;
  };
  seo?: {
    title?: string;
    description?: string;
    keywords?: string;
    ogImage?: string;
    h1Override?: string;
    schemaMarkup?: string;
    altTags?: { [key: string]: string };
    canonicalUrl?: string;
    author?: string;
    robots?: string;
    twitterHandle?: string;
    twitterCard?: 'summary' | 'summary_large_image' | 'app' | 'player';
    facebookAppId?: string;
    language?: string;
    sitemapUrl?: string;
  };
  aiIntelligence?: {
    enabled: boolean;
    autoApply: boolean;
    competitors: string[];
    profession: string;
    lastScan?: string;
    insights: {
      id: string;
      type: 'seo' | 'content' | 'competitor';
      title: string;
      description: string;
      impact: 'high' | 'medium' | 'low';
      status: 'pending' | 'applied';
      date: string;
    }[];
  };
}

interface ContentContextType {
  content: SiteContent;
  loading: boolean;
  user: User | null;
  isAdmin: boolean;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export const ContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [content, setContent] = useState<SiteContent>({
    brand: BRAND,
    services: SERVICES.map(s => {
      let visualUrl = "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?auto=format&fit=crop&q=80&w=1000";
      let visualType: 'image' | 'video' = 'image';

      if (s.id === 'healthcare') {
        visualUrl = "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=1200";
        visualType = 'image';
      } else if (s.id === 'corporate') {
        visualUrl = "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=1200";
        visualType = 'image';
      } else if (s.id === 'family') {
        visualUrl = "https://images.unsplash.com/photo-1542037104857-ffbb0b9155fb?auto=format&fit=crop&q=80&w=1200";
        visualType = 'image';
      } else if (s.id === 'sports') {
        visualUrl = "https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&q=80&w=1200";
        visualType = 'image';
      } else if (s.id === 'commercial') {
        visualUrl = "https://images.unsplash.com/photo-1520116467321-f1463a863260?auto=format&fit=crop&q=80&w=1200";
        visualType = 'image';
      } else if (s.id === 'hospitality') {
        visualUrl = "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=1200";
        visualType = 'image';
      }

      return {
        ...s,
        visualUrl,
        visualType,
        photoCategory: s.photoCategory
      };
    }),
    portfolio: PORTFOLIO.map((p, index) => ({
      ...p,
      videoUrl: "",
      type: (index % 2 === 0) ? 'video' : 'photo',
      alt: p.title,
      client: "Private Client",
      year: "2026",
      isFeatured: true,
      images: [p.placeholder, p.placeholder, p.placeholder, p.placeholder] 
    })),
    about: ABOUT_CONTENT,
    home: HOME_CONTENT,
    promo: {
      enabled: false,
      title: "EXCLUSIVE OFFER",
      message: "Book your brand story session today and receive 20% off your first production.",
      code: "STORY20"
    },
    testimonials: TESTIMONIALS,
    industries: INDUSTRIES,
    contact: {
      title: "Start Your Brand Genesis.",
      subtitle: "Inquire for Production Space.",
      description: "Every legacy begins with a single frame. Whether you're planning a multi-million dollar resort campaign or a focused executive identity series, our technical team is ready to deploy. Serving Bradenton, Sarasota, and the Florida Gulf Coast.",
      image: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&q=80&w=2000",
      email: "jonniarmani@gmail.com",
      phone: "208.549.9544",
      address: "Bradenton/Sarasota, Florida",
      availability: "Available for global commissions.",
      formTitle: "Project Inquiry",
      formSubtitle: "Tell us about your visual objectives."
    },
    customCode: {
      head: "",
      bodyStart: "",
      bodyEnd: "",
      css: ""
    },
    theme: {
      primaryColor: "#000000",
      accentColor: "#D4AF37",
      fontDisplay: "Outfit",
      fontSans: "Inter"
    },
    seo: {
      title: SEO.home.title,
      description: SEO.home.description,
      keywords: "video production Bradenton, Sarasota commercial photographer, Tampa brand storytelling, luxury real estate video Florida, healthcare marketing media, sports performance reels, architectural photography, yacht cinematography Gulf Coast",
      ogImage: "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?auto=format&fit=crop&q=80&w=2000",
      h1Override: "Cinematic Video <br /> <span class='text-brand-gold'>Commercial Photography</span>",
      altTags: {
        "home-lens": "Jonni Armani Professional Video Production Bradenton Florida Gulf Coast Luxury Real Estate & Commercial",
        "about-profile": "Jonni Armani Cinematic Photographer Sarasota Bradenton Tampa Surgeon & Athlete Brand Stories",
        "service-healthcare": "Healthcare Video Production Sarasota - Medical Marketing & Patient Stories",
        "service-corporate": "Corporate Video Tampa - Headquarters Mission Profiles & Brand Strategy",
        "service-sports": "Professional Athlete Media IMG Academy Bradenton - Elite Performance Reels"
      },
      author: "Jonni Armani",
      robots: "index, follow",
      twitterHandle: "@jonniarmani",
      twitterCard: "summary_large_image",
      language: "en-US",
      sitemapUrl: "https://jonniarmani.com/sitemap.xml",
      schemaMarkup: JSON.stringify(SCHEMA_JSON_LD, null, 2)
    },
    aiIntelligence: {
      enabled: true,
      autoApply: false,
      profession: "Cinematographer & Photographer",
      competitors: ["https://competitor1.com", "https://competitor2.com"],
      lastScan: new Date().toISOString(),
      insights: [
        {
          id: "1",
          type: "seo",
          title: "Keyword Shift Detected",
          description: "Top regional competitors are increasing focus on 'Aerial Yacht Cinematography'. Suggest adding this to your service keywords.",
          impact: "high",
          status: "pending",
          date: new Date().toISOString()
        },
        {
          id: "2",
          type: "competitor",
          title: "Pricing Strategy Update",
          description: "Major competitor updated 'Day Rate' transparency. Recommendation: Highlight your 'Production Transparency' in the About section.",
          impact: "medium",
          status: "pending",
          date: new Date().toISOString()
        }
      ]
    }
  });
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });

    const unsubContent = onSnapshot(doc(db, 'settings', 'content'), (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data() as any;
        
        // Final Purge: Ensure no AI Generated assets leak into the UI
        if (data.portfolio) {
          data.portfolio = data.portfolio.filter((p: any) => 
            p.category !== "AI Generated" && 
            !(p.title && p.title.toLowerCase().includes("ai generated"))
          );
        }

        setContent(prev => ({
          ...prev,
          ...data,
          brand: {
            ...prev.brand,
            ...(data.brand || {}),
            socials: {
              ...prev.brand.socials,
              ...(data.brand?.socials || {})
            },
            contact: {
              ...prev.brand.contact,
              ...(data.brand?.contact || {})
            }
          }
        }) as SiteContent);
      }
      setLoading(false);
    }, (error) => {
      setLoading(false);
      // Use handleFirestoreError to provide context
      handleFirestoreError(error, OperationType.GET, 'settings/content');
    });

    return () => {
      unsubAuth();
      unsubContent();
    };
  }, []);

  const isAdmin = user?.email === 'jonniarmani@gmail.com';

  return (
    <ContentContext.Provider value={{ content, loading, user, isAdmin }}>
      {children}
    </ContentContext.Provider>
  );
};

export const useContent = () => {
  const context = useContext(ContentContext);
  if (!context) throw new Error('useContent must be used within ContentProvider');
  return context;
};
