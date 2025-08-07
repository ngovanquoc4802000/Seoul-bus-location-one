import type { DocumentData } from 'firebase/firestore';

export interface BusStatus extends DocumentData {
  carId: string;
  carName: string;
  defaultLat?: number;
  defaultLon?: number;
  destination: Destination;
  expiredt?: string;
  isMoving: boolean;
  latitude: number; 
  longitude: number;
  rkey?: string;
  senddt?: number;
  speed: number;
}
export interface Destination {
  latitude: number;
  longitude: number;
}