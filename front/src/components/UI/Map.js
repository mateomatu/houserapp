import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import styles from './Map.module.css';
import geocodingServices from "../../services/Geocoding/Geocoding-service";

// eslint-disable-next-line import/no-webpack-loader-syntax, import/no-unresolved
mapboxgl.workerClass = require("worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker").default;

mapboxgl.accessToken =
  'pk.eyJ1Ijoic2hhcnBmb3giLCJhIjoiY2tycTFxZ3g0MmpqdjJwbWxtZjZ1Nnd4dSJ9.1IUpbhGDM54sNTroL1CC6w';

const Map = props => {
  const mapContainerRef = useRef(null);

  const [lng, setLng] = useState(5);
  const [lat, setLat] = useState(34);
  const [zoom, setZoom] = useState(8);
  const [address, setAddress] = useState()

  // Initialize map when component mounts
  useEffect(() => {
    (async () => {
      const add = await geocodingServices.getLocation(`${props.address}`, props.idHouser);

      if (add) {
        setAddress(add);
        const map = new mapboxgl.Map({
          container: mapContainerRef.current,
          style: 'mapbox://styles/mapbox/streets-v11',
          center: [add.lon, add.lat],
          zoom: 16
        });
    
        // Add navigation control (the +/- zoom buttons)
        /* map.addControl(new mapboxgl.NavigationControl(), 'top-right'); */
    
        map.on('move', () => {
          setLng(map.getCenter().lng.toFixed(4));
          setLat(map.getCenter().lat.toFixed(4));
          setZoom(map.getZoom().toFixed(2));
        });
  
        var marker = new mapboxgl.Marker({
          color: "orange"
        })
          .setLngLat([add.lon, add.lat])
          .addTo(map);
      }
      
    })().catch("error al traer la locacion")
    

    // Clean up on unmount
/*     return () => map.remove(); */
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div>
      <div className={styles['map-container']} ref={mapContainerRef} />
    </div>
  );
};

export default Map;