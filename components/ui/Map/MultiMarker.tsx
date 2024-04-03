import React, { useRef, useEffect } from 'react';

const MapWithMarkers = ({ locations }:any) => {
  const mapRef = useRef<any>(null);

  useEffect(() => {
    if (!window.google) return;

    // Create a new map instance
    const map = new window.google.maps.Map(mapRef.current, {
      center: { lat: 0, lng: 0 }, // Default center
      zoom: 2, // Default zoom
    });

    // Create a LatLngBounds object to encompass all the markers
    const bounds = new window.google.maps.LatLngBounds();

    // Add markers for each location
    locations.forEach((location:any) => {
      const marker:any = new window.google.maps.Marker({
        position: { lat: parseFloat(location?.latitude), lng: parseFloat(location?.longitude) },
        map: map,
        title: location?.name,
      });

      // Extend the bounds to include the marker's position
      bounds.extend(marker.getPosition());
    });

    // Fit the map to the bounds
    map.fitBounds(bounds);
  }, [locations]);

  return (
    <div ref={mapRef} className='w-full h-[400px] rounded-2xl border border-slate-200'>
      {/* Map will be rendered here */}
    </div>
  );
};

export default MapWithMarkers;
