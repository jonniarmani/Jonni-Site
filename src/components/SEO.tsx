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
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', seo.title || '');
    
    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) ogDescription.setAttribute('content', seo.description || '');

    const ogImage = document.querySelector('meta[property="og:image"]');
    if (ogImage) ogImage.setAttribute('content', seo.ogImage || '');

    // Twitter Tags
    const twitterCard = document.querySelector('meta[name="twitter:card"]');
    if (twitterCard) twitterCard.setAttribute('content', seo.twitterCard || 'summary_large_image');

    const twitterSite = document.querySelector('meta[name="twitter:site"]');
    if (twitterSite) twitterSite.setAttribute('content', seo.twitterHandle || '');

    const twitterCreator = document.querySelector('meta[name="twitter:creator"]');
    if (twitterCreator) twitterCreator.setAttribute('content', seo.twitterHandle || '');

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
