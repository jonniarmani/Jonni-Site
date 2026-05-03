import React from 'react';
import { Share2, Facebook, Twitter, Linkedin, Link as LinkIcon } from 'lucide-react';
import { motion } from 'motion/react';

export default function ShareButtons() {
  const [copied, setCopied] = React.useState(false);
  const pageUrl = typeof window !== 'undefined' ? window.location.href : '';
  const pageTitle = typeof document !== 'undefined' ? document.title : 'Jonni Armani Media';

  const shareLinks = [
    {
      name: 'Facebook',
      icon: Facebook,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`,
      color: 'hover:text-[#1877F2]'
    },
    {
      name: 'Twitter',
      icon: Twitter,
      url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(pageUrl)}&text=${encodeURIComponent(pageTitle)}`,
      color: 'hover:text-[#1DA1F2]'
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(pageUrl)}`,
      color: 'hover:text-[#0A66C2]'
    }
  ];

  const copyToClipboard = () => {
    navigator.clipboard.writeText(pageUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col items-center space-y-4 py-8">
      <div className="flex items-center space-x-2 text-xs uppercase tracking-widest font-bold text-gray-400">
        <Share2 size={14} />
        <span>Share This Page</span>
      </div>
      <div className="flex space-x-4">
        {shareLinks.map((link) => (
          <motion.a
            key={link.name}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.95 }}
            className={`p-2 rounded-full border border-white/10 text-gray-400 ${link.color} transition-colors`}
            aria-label={`Share on ${link.name}`}
          >
            <link.icon size={18} />
          </motion.a>
        ))}
        <motion.button
          onClick={copyToClipboard}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.95 }}
          className={`p-2 rounded-full border border-white/10 text-gray-400 hover:text-brand-cyan transition-colors relative`}
          aria-label="Copy link to clipboard"
        >
          <LinkIcon size={18} />
          {copied && (
            <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-brand-cyan text-black px-2 py-1 rounded text-[10px] font-bold">
              COPIED
            </span>
          )}
        </motion.button>
      </div>
    </div>
  );
}
