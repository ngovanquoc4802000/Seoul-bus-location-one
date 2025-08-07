import type { BusStatus } from "../mockup/bus";
import { Request } from "../utils/https";

export const getBusStatusId = async (carId: string): Promise<BusStatus> => {
  try {
    const response = await Request.get<BusStatus>(`/bus/status/01222580211`);
    console.log(`Fetched bus status for car ${carId}:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch bus status for car ${carId}:`, error);
    throw error;
  }
}


export const getAllBusStatuses = async (): Promise<BusStatus[] | null> => {
  try {
    const response = await Request.get<BusStatus[]>("/bus/status/all");
    return response.data;
  } catch (error) {
    console.error("Failed to fetch all bus statuses:", error);
    throw error;
  }
}
