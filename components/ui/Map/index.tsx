import { GOOGLE_MAP_API_KEY } from '@framework/utils/constants';
import React from 'react';

const MapIframeWithMarker = ({ latitude, longitude }: any) => {
  // Construct the URL for embedding Google Maps with a marker
  //const mapUrl = `https://www.google.com/maps/embed/v1/view?key=${GOOGLE_MAP_API_KEY}&center=${latitude},${longitude}`;
  const mapUrl = `https://www.google.com/maps/embed/v1/view?key=${GOOGLE_MAP_API_KEY}&center=${latitude},${longitude}&zoom=15`;
  return (
    <div>
      <iframe
        width="100%"
        height="450"
        loading="lazy"
        allowFullScreen
        src={mapUrl}
      ></iframe>
    </div>
  );
};

export default MapIframeWithMarker;
