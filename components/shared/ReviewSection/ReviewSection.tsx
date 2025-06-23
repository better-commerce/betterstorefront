// components/TrustpilotWidget.tsx
'use client';
import { useEffect, useRef } from 'react';

const TrustpilotRating = ({
  templateId,
  templateSize,
  widgetClass = 'trustpilot-widget',
}: {
  templateId: string;
  templateSize: string;
  widgetClass?: string;
}) => {
  const widgetRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const loadTrustpilot = () => {
      if ((window as any).Trustpilot) {
        (window as any).Trustpilot.loadFromElement(widgetRef.current, true);
      }
    };

    if (!(window as any).Trustpilot) {
      const script = document.createElement('script');
      script.src = 'https://widget.trustpilot.com/bootstrap/v5/tp.widget.bootstrap.min.js';
      script.async = true;
      script.onload = loadTrustpilot;
      document.body.appendChild(script);

      return () => {
        document.body.removeChild(script);
      };
    } else {
      // If already loaded, just re-initialize the widget
      loadTrustpilot();
    }
  }, []);

  return (
    <div
      ref={widgetRef}
      className={widgetClass}
      data-locale="en-GB"
      data-template-id={templateId}
      data-businessunit-id="477447a300006400050209bb"
      data-style-width="100%"
      data-style-size={templateSize}
      data-theme="light"
      data-headline="star"
      data-external-elements-color="dark"
    >
      <a
        href="https://uk.trustpilot.com/review/www.parkcameras.com"
        target="_blank"
        rel="noopener noreferrer"
      >
        Trustpilot
      </a>
    </div>
  );
};

export default TrustpilotRating;
