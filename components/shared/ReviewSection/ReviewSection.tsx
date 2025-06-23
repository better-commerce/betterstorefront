// components/TrustpilotWidget.tsx
'use client';
import { useEffect } from 'react';

const TrustpilotRating = ({templateId, templateSize}:any) => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://widget.trustpilot.com/bootstrap/v5/tp.widget.bootstrap.min.js';
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div
      className="trustpilot-widget"
      data-locale="en-GB"
      data-template-id={templateId}
      data-businessunit-id="477447a300006400050209bb"
      data-style-width="100%"
      data-style-size={templateSize}
      data-headline="star"
      data-external-elements-color="dark"
    >
      <a
        href="https://uk.trustpilot.com/review/www.parkcameras.com"
        target="_blank"
        rel="noopener"
      >
        Trustpilot
      </a>
    </div>
  );
};

export default TrustpilotRating;
