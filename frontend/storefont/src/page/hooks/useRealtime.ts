// hooks/useRealtime.ts
import { initializeApp } from "firebase/app";
import { doc, getFirestore, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import type { BusStatus } from "../mockup/bus";

const firebaseConfig = {
  apiKey: "AIzaSyBcuZnrlDA5OotP_rcgRW6es8juW9UQO4w",
  authDomain: "location-car-513da.firebaseapp.com",
  projectId: "location-car-513da",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const useRealtimeBusData = (carId: string) => {
  
  const [data, setData] = useState<BusStatus | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!carId) {
      setIsLoading(false);
      return;
    }

    const unsubscribe = onSnapshot(
      doc(db, "car-pos", "01222580211"),
      (docSnapshot) => {
        if (docSnapshot.exists()) {
          const fetchedData = docSnapshot.data() as BusStatus;
          setData(fetchedData);
          setIsLoading(false);
          console.log("Realtime bus data:", fetchedData);
        } else {
          console.log("No data for this vehicle!");
          setData(null);
          setIsLoading(false);
        }
      },
      (err) => {
        console.error("Error while listening to data:", err);
        setError(err);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [carId]);

  return { data, isLoading, error };
};

export default useRealtimeBusData;
