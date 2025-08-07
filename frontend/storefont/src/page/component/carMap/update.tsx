import { useEffect } from "react";
import { useMap } from "react-leaflet";

interface MapUpdaterProps {
  position: [number, number];
}

const MapUpdater = ({ position }: MapUpdaterProps) => {
  const map = useMap();

  useEffect(() => {
    map.setView(position, map.getZoom(), {
      animate: true,
    });
  }, [position, map]);

  return null;
};

export default MapUpdater;
