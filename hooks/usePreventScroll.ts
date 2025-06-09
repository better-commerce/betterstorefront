import { useEffect, useRef } from "react";

// Custom hook for managing body scroll
const usePreventScroll = () => {
  const originalStyleRef = useRef<string>('');

  useEffect(() => {
    // Store original style only once when component mounts
    originalStyleRef.current = window.getComputedStyle(document.body).overflow;
    
    // Disable scroll
    document.body.style.overflow = 'hidden';

    // Cleanup function
    return () => {
      // Restore original style when component unmounts
      document.body.style.overflow = originalStyleRef.current;
    };
  }, []); // Empty dependency array means this runs once on mount
};

export default usePreventScroll;
