import React, { useRef, useEffect } from 'react';

const MapWithMarker = ({ latitude, longitude }:any) => {
  const mapRef = useRef<any>(null);

  useEffect(() => {
    // Create a new map instance
    const map = new window.google.maps.Map(mapRef.current, {
      center: { lat: latitude, lng: longitude },
      zoom: 15,
    });

    // Add a marker to the map
    new window.google.maps.Marker({
      position: { lat: latitude, lng: longitude },
      map: map,
      title: 'Marker Title',
    });
  }, [latitude, longitude]);

  return (
    <div ref={mapRef} style={{ width: '100%', height: '450px' }}>
      {/* Map will be rendered here */}
    </div>
  );
};

export default MapWithMarker;
