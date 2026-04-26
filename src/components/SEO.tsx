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

  }, [seo]);

  return null;
}
