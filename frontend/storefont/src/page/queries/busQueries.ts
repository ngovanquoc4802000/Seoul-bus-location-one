import { queryOptions } from "@tanstack/react-query";
import { getAllBusStatuses, getBusStatusId } from "../services/busService";

const queriesBusStatus = {
  list: queryOptions({
    queryKey: ["bus"],
    queryFn: async () => {
      const busStatuses = await getAllBusStatuses();
      if (!busStatuses || busStatuses.length === 0) {
        console.warn("No bus statuses found.");
        return [];
      }
      return busStatuses;
    },
    staleTime: 1000 * 60 * 5,
    refetchInterval: 3000, 
  }),
  detail: (carId: string) => queryOptions({
    queryKey: ["bus", carId],
    queryFn: async () => {
      const busStatusId = await getBusStatusId(carId);
      if(!busStatusId) {
        console.warn(`No bus status found for car ID: ${carId}`);
        return null;
      }
      return busStatusId;
    },
    staleTime: 1000 * 60 * 5,
    refetchInterval: 3000,
    enabled: !!carId,
  }),
};

export default queriesBusStatus;
