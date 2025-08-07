import React, { useEffect, useMemo, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useQuery } from "@tanstack/react-query";
import queriesBusStatus from "../../queries/busQueries";
import MapUpdater from "./update"; 
import "leaflet/dist/leaflet.css";

const carIcon = L.icon({
  iconUrl:
    "https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

interface CarMapProps {
  carId: string;
}

const CarMap = ({ carId }: CarMapProps) => {
  const [currentTime, setCurrentTime] = useState(Date.now());
  const [statusText, setStatusText] = useState("Đang tải...");

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000); // cập nhật mỗi giây
    return () => clearInterval(interval);
  }, []);

  const { data, isLoading, error } = useQuery({
    ...queriesBusStatus.detail(carId),
    refetchInterval: 3000,
    staleTime: 0,
  });

  const position = useMemo(() => {
    const lat = data?.lastLocation?.latitude ?? 10.762622;
    const lon = data?.lastLocation?.longitude ?? 106.660172;
    return [lat, lon] as [number, number];
  }, [data]);

  useEffect(() => {
    if (!data) return;

    const updatedAtTime = new Date(data.updatedAt ?? Date.now()).getTime();
    const timeDiff = (currentTime - updatedAtTime) / 1000; 

    if (timeDiff > 10) {
      setStatusText("Không hoạt động");
    } else if (data.isMoving || Number(data.lastSpeed) > 0) {
      setStatusText("Đang di chuyển");
    } else if (data.stopDuration !== null && Number(data.stopDuration) >= 30) {
      setStatusText("Đã kết thúc hoạt động");
    } else {
      setStatusText("Đã dừng");
    }
  }, [data, currentTime]);

  if (isLoading) {
    return <div className="text-center p-4">Đang tải dữ liệu xe...</div>;
  }

  if (!data || error) {
    return (
      <div className="text-center p-4 text-red-500">
        Không có dữ liệu cho xe này hoặc đã xảy ra lỗi.
      </div>
    );
  }

  return (
    <div className="relative w-full h-[800px]">
      <MapContainer
        center={position}
        zoom={15}
        scrollWheelZoom
        style={{ width: "100%", height: "100%" }}
      >
        <TileLayer
    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
  />
  <MapUpdater position={position} />
  <Marker position={position} icon={carIcon}>
    <Popup>
      <div>
        <h2 className="font-bold">CarId: {data?.carId}</h2>
        <p>
          Address: {data?.lastLocation?.latitude?.toFixed(6)},{" "}
                {data?.lastLocation?.longitude?.toFixed(6)}
              </p>
              <p>Speed: {data?.lastSpeed ?? 0} km/h</p>
              <p>Status: {statusText}</p>
              {data?.stopDuration !== null && (
                <p>Stop Duration: {data?.stopDuration} phút</p>
              )}
            </div>
          </Popup>
        </Marker>
      </MapContainer>
      <div className="absolute top-4 left-4 bg-white p-4 rounded shadow-md z-[1000] text-sm md:text-base">
        <h2 className="text-lg font-bold">CarId: {data?.carId}</h2>
        <p>
          Address: {data?.lastLocation?.latitude?.toFixed(6)},{" "}
          {data?.lastLocation?.longitude?.toFixed(6)}
        </p>
        <p>Speed: {data?.lastSpeed ?? 0} km/h</p>
        <p>Status: {statusText}</p>
        {data?.stopDuration !== null && (
          <p>Stop Duration: {data?.stopDuration} phút</p>
        )}
      </div>
    </div>
  );
};

export default CarMap;
