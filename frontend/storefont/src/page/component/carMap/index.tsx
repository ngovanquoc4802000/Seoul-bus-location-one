/* eslint-disable @typescript-eslint/no-explicit-any */
import "leaflet/dist/leaflet.css";
import React, { useEffect, useMemo, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import MapUpdater from "./update";
import { Polyline } from "react-leaflet";
import imageCar from "../../../assets/bus-lane.png";

import useRealtimeBusData from "../../hooks/useRealtime";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

const carIcon = L.icon({
  iconUrl: imageCar,
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -35],
  shadowUrl: undefined,
});

const destinationIcon = L.icon({
  iconUrl:
    "https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
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

const text: string = "Đang tải...";
const CarMap = ({ carId }: CarMapProps) => {
  const [currentTime, _] = useState(Date.now());
  const [statusText, setStatusText] = useState<string>(text);
  /*   useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, []); */

  const { data, isLoading, error } = useRealtimeBusData(carId);

  const destinationPosition = useMemo(() => {
    const lat = data?.destination?.latitude ?? 10.78;

    const lon = data?.destination?.longitude ?? 106.7;
    return [lat, lon] as [number, number];
  }, [data]);

  const position = useMemo(() => {
    if (isLoading || !data) {
      return [0, 0] as [number, number];
    }
    const lat = data.latitude;
    const lon = data.longitude;
    return [lat, lon] as [number, number];
  }, [data, isLoading]);

  useEffect(() => {
    if (!data) return;

    // Lưu ý: Bạn cần đảm bảo trường `updatedAt` tồn tại trong dữ liệu Firebase
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
  console.log(position, "position");

  return (
    <div style={{ width: "100%", height: "800px", position: "relative" }}>
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
        <Polyline
          pathOptions={{ color: "blue", weight: 3, dashArray: "5, 5" }}
          positions={[position, destinationPosition]}
        />
        <Marker position={position} icon={carIcon}>
          <Popup>
            <div>
              <h2 className="font-bold">CarId: {data?.carId}</h2>
              <p>
                Address: {data?.latitude.toFixed(6)},
                {data?.longitude.toFixed(6)}
              </p>
              <p>Speed: {data?.lastSpeed ?? 0} km/h</p>
              <p>Status: {statusText}</p>
              {data?.stopDuration !== null && (
                <p>Stop Duration: {data?.stopDuration} phút</p>
              )}
            </div>
          </Popup>
        </Marker>
        <Marker position={destinationPosition} icon={destinationIcon}>
          <Popup>
            <div>
              <h2 className="font-bold">Điểm đến</h2>
              <p>
                {destinationPosition[0].toFixed(6)},{" "}
                {destinationPosition[1].toFixed(6)}
              </p>
            </div>
          </Popup>
        </Marker>
      </MapContainer>
      <div className="absolute top-4 left-4 bg-white p-4 rounded shadow-md z-[1000] text-sm md:text-base">
        <h2 className="text-lg font-bold">CarId: {data?.carId}</h2>
        <h2>CarName: K3 195호4070</h2>
        <span>latitude: {data?.latitude?.toFixed(6)}, longitude: </span>
        <br />
        <span>longitude: {data?.longitude?.toFixed(6)}</span>

        <p>Speed: {data?.lastSpeed ?? 60} km/h</p>
        <p>Status: {statusText}</p>
        {data?.stopDuration !== null && (
          <p>Stop Duration: {data?.stopDuration} minutes</p>
        )}
      </div>
    </div>
  );
};

export default CarMap;
