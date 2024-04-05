import React, { useRef, useEffect } from 'react';

const MapWithMarkers = ({ locations, setMap }:any) => {
  const mapRef = useRef<any>(null);

  useEffect(() => {
  if (!window.google) {
    console.error('Google Maps API is not loaded');
    return;
  }

  const map = new window.google.maps.Map(mapRef.current);

  setMap(map);
}, [locations, setMap]);


  return (
    <div ref={mapRef} className='w-full h-[400px] rounded-2xl border border-slate-200'>
      {/* Map will be rendered here */}
    </div>
  );
};

export default MapWithMarkers;
