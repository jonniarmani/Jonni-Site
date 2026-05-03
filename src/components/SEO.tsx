import React, { useEffect } from 'react';
import { useContent } from '../lib/ContentContext';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  canonicalUrl?: string;
}

export default function SEO({ title, description, keywords, ogImage, canonicalUrl }: SEOProps) {
  const { content } = useContent();
  const seo = content.seo;

  useEffect(() => {
    // Priority: Props > Context Content > Default Empty
    const finalTitle = title || seo?.title || '';
    const finalDescription = description || seo?.description || '';
    const finalKeywords = keywords || seo?.keywords || '';
    const finalOgImage = ogImage || seo?.ogImage || '';
    const finalCanonical = canonicalUrl || seo?.canonicalUrl || '';

    if (finalTitle) document.title = finalTitle;

    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', finalDescription);
    } else if (finalDescription) {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = finalDescription;
      document.head.appendChild(meta);
    }

    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords) {
      metaKeywords.setAttribute('content', finalKeywords);
    } else if (finalKeywords) {
      const meta = document.createElement('meta');
      meta.name = 'keywords';
      meta.content = finalKeywords;
      document.head.appendChild(meta);
    }

    // OG Tags
    const setOgTag = (property: string, contentStr: string) => {
      let tag = document.querySelector(`meta[property="${property}"]`);
      if (!tag && contentStr) {
        tag = document.createElement('meta');
        tag.setAttribute('property', property);
        document.head.appendChild(tag);
      }
      if (tag && tag.getAttribute('content') !== contentStr) {
        tag.setAttribute('content', contentStr);
      }
    };

    setOgTag('og:title', finalTitle);
    setOgTag('og:description', finalDescription);
    setOgTag('og:image', finalOgImage);
    setOgTag('og:url', finalCanonical || window.location.href);
    setOgTag('og:type', 'website');
    setOgTag('og:site_name', 'Jonni Armani Media');

    // Twitter Tags
    const setTwitterTag = (name: string, contentStr: string) => {
      let tag = document.querySelector(`meta[name="${name}"]`);
      if (!tag && contentStr) {
        tag = document.createElement('meta');
        tag.setAttribute('name', name);
        document.head.appendChild(tag);
      }
      if (tag && tag.getAttribute('content') !== contentStr) {
        tag.setAttribute('content', contentStr);
      }
    };

    setTwitterTag('twitter:card', seo?.twitterCard || 'summary_large_image');
    setTwitterTag('twitter:site', seo?.twitterHandle || '');
    setTwitterTag('twitter:creator', seo?.twitterHandle || '');
    setTwitterTag('twitter:title', finalTitle);
    setTwitterTag('twitter:description', finalDescription);
    setTwitterTag('twitter:image', finalOgImage);

    // Robots
    const robots = document.querySelector('meta[name="robots"]');
    if (robots) robots.setAttribute('content', seo?.robots || 'index, follow');

    // Canonical
    let canonical = document.querySelector('link[rel="canonical"]');
    if (finalCanonical || window.location.origin.includes('jonniarmani.com')) {
      if (!canonical) {
        canonical = document.createElement('link');
        canonical.setAttribute('rel', 'canonical');
        document.head.appendChild(canonical);
      }
      
      let href = finalCanonical || window.location.href.split('?')[0];
      
      // Enforce non-www and specific domain if desired
      if (href.includes('jonniarmani.com')) {
        href = href.replace('www.', '');
      }
      
      canonical.setAttribute('href', href);
    } else {
      if (canonical) canonical.remove();
    }

    // Language
    if (seo.language) {
      document.documentElement.lang = seo.language;
    }

    // Schema Markup
    const existingSchema = document.getElementById('seo-schema');
    if (existingSchema) existingSchema.remove();
    
    if (seo.schemaMarkup) {
      const script = document.createElement('script');
      script.id = 'seo-schema';
      script.type = 'application/ld+json';
      script.text = seo.schemaMarkup;
      document.head.appendChild(script);
    }

    // Image Preloading (LCP Optimization)
    const existingPreload = document.getElementById('lcp-preload');
    if (existingPreload) existingPreload.remove();

    if (window.location.pathname === '/' && content.home.heroVisuals?.[0]?.url) {
      const link = document.createElement('link');
      link.id = 'lcp-preload';
      link.rel = 'preload';
      link.as = 'image';
      link.href = content.home.heroVisuals[0].url;
      link.setAttribute('fetchpriority', 'high');
      document.head.appendChild(link);
    }

  }, [seo, content.home.heroVisuals]);

  return null;
}
