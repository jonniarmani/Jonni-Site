import React, { useEffect } from 'react';
import { useContent } from '../lib/ContentContext';

export default function SEO() {
  const { content } = useContent();
  const { seo } = content;

  useEffect(() => {
    if (!seo) return;

    if (seo.title) document.title = seo.title;

    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', seo.description || '');
    } else if (seo.description) {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = seo.description;
      document.head.appendChild(meta);
    }

    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords) {
      metaKeywords.setAttribute('content', seo.keywords || '');
    } else if (seo.keywords) {
      const meta = document.createElement('meta');
      meta.name = 'keywords';
      meta.content = seo.keywords;
      document.head.appendChild(meta);
    }

    // OG Tags
    const setOgTag = (property: string, content: string) => {
      let tag = document.querySelector(`meta[property="${property}"]`);
      if (!tag && content) {
        tag = document.createElement('meta');
        tag.setAttribute('property', property);
        document.head.appendChild(tag);
      }
      if (tag) tag.setAttribute('content', content);
    };

    setOgTag('og:title', seo.title || '');
    setOgTag('og:description', seo.description || '');
    setOgTag('og:image', seo.ogImage || '');
    setOgTag('og:url', seo.canonicalUrl || window.location.href);
    setOgTag('og:type', 'website');
    setOgTag('og:site_name', 'Jonni Armani Media');

    // Twitter Tags
    const setTwitterTag = (name: string, content: string) => {
      let tag = document.querySelector(`meta[name="${name}"]`);
      if (!tag && content) {
        tag = document.createElement('meta');
        tag.setAttribute('name', name);
        document.head.appendChild(tag);
      }
      if (tag) tag.setAttribute('content', content);
    };

    setTwitterTag('twitter:card', seo.twitterCard || 'summary_large_image');
    setTwitterTag('twitter:site', seo.twitterHandle || '');
    setTwitterTag('twitter:creator', seo.twitterHandle || '');
    setTwitterTag('twitter:title', seo.title || '');
    setTwitterTag('twitter:description', seo.description || '');
    setTwitterTag('twitter:image', seo.ogImage || '');

    // Robots
    const robots = document.querySelector('meta[name="robots"]');
    if (robots) robots.setAttribute('content', seo.robots || 'index, follow');

    // Canonical
    let canonical = document.querySelector('link[rel="canonical"]');
    if (seo.canonicalUrl) {
      if (!canonical) {
        canonical = document.createElement('link');
        canonical.setAttribute('rel', 'canonical');
        document.head.appendChild(canonical);
      }
      canonical.setAttribute('href', seo.canonicalUrl);
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

  }, [seo]);

  return null;
}
