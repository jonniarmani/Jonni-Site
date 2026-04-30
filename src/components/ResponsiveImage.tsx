import React from 'react';

interface ResponsiveImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  fetchPriority?: "high" | "low" | "auto";
}

/**
 * A highly optimized image component that automatically generates srcset for Unsplash URLs.
 * Falls back to standard img for non-Unsplash sources.
 */
export const ResponsiveImage: React.FC<ResponsiveImageProps> = ({ 
  src, 
  alt, 
  className, 
  sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 75vw, 50vw",
  fetchPriority = "auto",
  loading = "lazy",
  ...props 
}) => {
  // Check if it's an Unsplash URL to apply optimization
  const isUnsplash = src.includes('images.unsplash.com');

  const defaultProps = {
    alt,
    className,
    loading,
    decoding: props.decoding || (loading === "eager" ? "sync" : "async"),
    fetchPriority,
    ...props
  };

  if (!isUnsplash) {
    return (
      <img 
        src={src} 
        {...defaultProps} 
      />
    );
  }

  // Handle Unsplash URL optimization
  // Base URL without existing width/quality params
  const baseUrl = src.split('?')[0];
  
  // Custom params we want to preserve or add
  const params = new URLSearchParams(src.split('?')[1] || '');
  params.set('auto', 'format,compress');
  params.set('q', '80');

  const generateSrc = (width: number) => {
    const newParams = new URLSearchParams(params);
    newParams.set('w', width.toString());
    return `${baseUrl}?${newParams.toString()}`;
  };

  // Common breakpoints for srcset
  const widths = [640, 750, 828, 1080, 1200, 1920, 2048, 3840];
  const srcSet = widths
    .map(w => `${generateSrc(w)} ${w}w`)
    .join(', ');

  return (
    <img
      src={generateSrc(1200)} // Default fallback width
      srcSet={srcSet}
      sizes={sizes}
      {...defaultProps}
    />
  );
};

export default ResponsiveImage;
