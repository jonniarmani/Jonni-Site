import React, { useEffect } from 'react';
import { useContent } from '../lib/ContentContext';

export default function CodeInjection() {
  const { content } = useContent();
  const { customCode, theme } = content;

  useEffect(() => {
    if (!customCode) return;

    // Handle Head Injection
    if (customCode.head) {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = customCode.head;
      Array.from(tempDiv.childNodes).forEach(node => {
        if (node.nodeType === 1) { // Element node
          const el = node as HTMLElement;
          if (el.tagName === 'SCRIPT') {
            const script = document.createElement('script');
            Array.from(el.attributes).forEach(attr => script.setAttribute(attr.name, attr.value));
            script.textContent = el.textContent;
            document.head.appendChild(script);
          } else {
            document.head.appendChild(el.cloneNode(true));
          }
        }
      });
    }

    // Handle Custom CSS
    if (customCode.css) {
      const style = document.createElement('style');
      style.id = 'custom-injected-css';
      style.textContent = customCode.css;
      document.head.appendChild(style);
    }

    // Handle Theme Variables
    if (theme) {
      const root = document.documentElement;
      if (theme.primaryColor) root.style.setProperty('--brand-black', theme.primaryColor);
      if (theme.accentColor) root.style.setProperty('--brand-cyan', theme.accentColor);
      if (theme.fontDisplay) root.style.setProperty('--font-display-override', theme.fontDisplay);
      if (theme.fontSans) root.style.setProperty('--font-sans-override', theme.fontSans);
    }

    return () => {
      // Cleanup injected CSS if needed (though usually we want it to persist during session)
      const existingStyle = document.getElementById('custom-injected-css');
      if (existingStyle) existingStyle.remove();
    };
  }, [customCode, theme]);

  return null;
}
