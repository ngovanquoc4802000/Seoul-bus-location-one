export interface BusStatus {
  carId: string;
  carIdName: string;
  stopDuration: null | number;
  lastLocation: LastLocation;
  lastSpeed: number;
   isMoving?: boolean; 
  updatedAt?: string;
}

export interface LastLocation {
  latitude: number;
  longitude: number;
}