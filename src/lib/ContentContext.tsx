import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, db, onSnapshot, doc, handleFirestoreError, OperationType } from './firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { BRAND, SERVICES, PORTFOLIO } from '../config';

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
  about: {
    heroTitle: string;
    heroSubtitle: string;
    storyTitle: string;
    storyText1: string;
    storyText2: string;
    storyText3: string;
    quote: string;
    profileImage: string;
    profileImagePosition?: string;
  };
  home: {
    lensTitle: string;
    lensText: string;
    lensImage: string;
    lensImagePosition?: string;
    ctaBackground: string;
    ctaBackgroundPosition?: string;
    heroVisuals: { url: string; type: 'image' | 'video'; category: string; objectPosition?: string }[];
  };
  promo: {
    enabled: boolean;
    title: string;
    message: string;
    code: string;
  };
  testimonials: {
    author: string;
    role: string;
    content: string;
    rating: number;
    date: string;
    avatar?: string;
  }[];
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
    brand: {
      ...BRAND,
      name: "Jonni Armani Media",
      tagline: "Cinematic Video. Commercial Photography. Strategic Results.",
      taglineExtended: "High-end video production and photography for brands, athletes, and industry leaders across the Florida Gulf Coast.",
      location: "Bradenton, Sarasota, Palmetto, Tampa, Siesta Key",
      contact: {
        ...BRAND.contact,
        phone: "208.549.9544",
        email: "jonniarmani@gmail.com"
      }
    },
    services: SERVICES.filter(s => !s.title.toLowerCase().includes('wedding')).map(s => {
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
    about: {
      heroTitle: "The Vision Behind The Craft",
      heroSubtitle: "Jonni Armani Media",
      storyTitle: "Pragmatic Strategy. High-Impact Results.",
      storyText1: "I am a multidisciplinary visual storyteller based in Bradenton, Florida. With over 14 years of professional reportage, my work is built on the belief that every frame should carry the weight of a narrative.",
      storyText2: "Whether documenting high-stakes commercial productions, breakthroughs in the healthcare field, or elite athletic performances, my approach remains constant: remain unobtrusive, observe with intent, and deliver with technical precision.",
      storyText3: "I value integrity and authenticity above all else. My goal is not just to capture how a moment looks, but to preserve exactly how it felt. I find beauty in the raw, the unscripted, and the honest – translating complex missions into cinematic authority.",
      quote: "My goal is not just to capture how a moment looks, but to preserve exactly how it felt.",
      profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=1000"
    },
    home: {
      lensTitle: "Precision Visuals. Strategic Growth.",
      lensText: "In a competitive landscape, cinematic quality is a business requirement. I specialize in high-impact narratives that drive brand authority and professional results.",
      lensImage: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=1200",
      ctaBackground: "https://images.unsplash.com/photo-1520116467321-f1463a863260?auto=format&fit=crop&q=80&w=2000",
      heroVisuals: [
        { url: "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?auto=format&fit=crop&q=80&w=2000", type: 'image', category: 'Sports' },
        { url: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=2000", type: 'image', category: 'Healthcare' },
        { url: "https://images.unsplash.com/photo-1544698310-74ae2696c1e3?auto=format&fit=crop&q=80&w=2000", type: 'image', category: 'Performance' },
        { url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=2000", type: 'image', category: 'Brand Stories' },
        { url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=2000", type: 'image', category: 'Coastal' }
      ]
    },
    promo: {
      enabled: false,
      title: "EXCLUSIVE OFFER",
      message: "Book your brand story session today and receive 20% off your first production.",
      code: "STORY20"
    },
    testimonials: [
      {
        author: "Jordan Thompson",
        role: "Healthcare Director",
        content: "Jonni is an absolute professional. The cinematic quality of the video he produced for our regional practice was beyond our expectations. He understands the nuances of professional brand storytelling.",
        rating: 5,
        date: "3 months ago"
      },
      {
        author: "Sarah Mitchell",
        role: "Commercial Marketing Lead",
        content: "High-impact visuals and a strategic eye. He captured our brand story perfectly. The ROI on the media assets we received has already proven itself across our social platforms.",
        rating: 5,
        date: "1 month ago"
      },
      {
        author: "Marcus Rivera",
        role: "Professional Athletics Coach",
        content: "The sports media Jonni produces is next level. Fast turnaround and broadcast quality gear used with actual intent. If you need to stand out from the noise, this is who you call.",
        rating: 5,
        date: "2 weeks ago"
      }
    ],
    customCode: {
      head: "",
      bodyStart: "",
      bodyEnd: "",
      css: ""
    },
    theme: {
      primaryColor: "#000000",
      accentColor: "#06B6D4",
      fontDisplay: "Outfit",
      fontSans: "Inter"
    },
    seo: {
      title: "Jonni Armani Media | Cinematic Video Production & Commercial Photography Bradenton Sarasota Tampa",
      description: "Professional high-end cinematic video production and commercial photography in Bradenton (34221), Sarasota, and Tampa. Specialized brand storytelling for healthcare, athletics, and corporate leaders across the Florida Gulf Coast.",
      keywords: "video production Bradenton FL, Sarasota photographer, commercial videography 34221, Palmetto video services, Gulf Coast media production, brand storyteller Sarasota, professional headshots Bradenton, commercial photography Tampa, Jonni Armani",
      ogImage: "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?auto=format&fit=crop&q=80&w=2000",
      h1Override: "CINEMATIC VIDEO PRODUCTION & COMMERCIAL PHOTOGRAPHY <br /> <span class='text-brand-gold'>BRADENTON | SARASOTA | TAMPA</span>",
      altTags: {
        "home-lens": "Jonni Armani Professional Video Production Bradenton Florida Gulf Coast",
        "about-profile": "Jonni Armani Cinematic Photographer Sarasota Bradenton Tampa"
      },
      canonicalUrl: "https://jonniarmani.com",
      author: "Jonni Armani",
      robots: "index, follow",
      twitterHandle: "@jonniarmani",
      twitterCard: "summary_large_image",
      language: "en-US",
      sitemapUrl: "https://jonniarmani.com/sitemap.xml",
      schemaMarkup: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "ProfessionalService",
        "name": "Jonni Armani Media",
        "image": "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?auto=format&fit=crop&q=80&w=2000",
        "@id": "https://jonniarmani.com",
        "url": "https://jonniarmani.com",
        "telephone": "208.549.9544",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "",
          "addressLocality": "Bradenton",
          "addressRegion": "FL",
          "postalCode": "34221",
          "addressCountry": "US"
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": 27.4989,
          "longitude": -82.5748
        },
        "hasMap": "https://maps.app.goo.gl/Nd7TRimptM7MAJjF8",
        "sameAs": [
          "https://www.instagram.com/jonniarmani/",
          "https://vimeo.com/jonniarmani",
          "https://maps.app.goo.gl/Nd7TRimptM7MAJjF8"
        ],
        "openingHoursSpecification": {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday"
          ],
          "opens": "09:00",
          "closes": "18:00"
        }
      }, null, 2)
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
