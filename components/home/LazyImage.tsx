// LazyImage.tsx

import React, { useEffect, useRef, useState } from 'react';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  id?: any;
  style?: any;
  width?: any;
  height?: any;
  
}

const LazyImage: React.FC<LazyImageProps> = ({ src, alt, className, id, style, width, height }) => {
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = imgRef.current;
            if (img) {
              img.src = src;
              img.onload = () => setIsLoaded(true);
            }
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    const img = imgRef.current;
    if (img) observer.observe(img);

    return () => {
      if (img) observer.unobserve(img);
    };
  }, [src]);

  return (
    <img
      ref={imgRef}
      src={isLoaded ? src : ''}
      alt={alt}
      className={`${className} ${!isLoaded ? 'lazyload' : ''}`}
      id={id}
      
      style={{
        ...style,
        transition: 'opacity 0.5s ease-in-out',
        opacity: isLoaded ? 1 : 0,
      }}
      width={width}
      height={height}
     />
  );
};

export default LazyImage;
