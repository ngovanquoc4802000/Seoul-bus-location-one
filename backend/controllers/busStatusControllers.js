/* 
 Db: 
 carId : "" (string)
carName : "" (string)
defaultLat : 1 (number)
defaultLon : 1 (number)
expiredt : August 5, 2025 at 12:00:00 AM UTC+7 (timestamp)
latitude : 1 (number)
longitude : 1 (number)
mqttIp : "" (string)
mqttPassword : "" (string)
mqttTopic : "" (string)
mqttUsername : "" (string)
naverApiKey : "" (string)
senddt : August 5, 2025 at 12:00:00 AM UTC+7 (timestamp)
*/

import { getCarStatus } from "../parse/firebaseService.js";
import moment from "moment";
const getCarStatusId = async (req, res) => {
  try {
    const { carId } = req.params;

    const data = await getCarStatus(carId);

    if (!data) {
      return res.status(404).json({ message: "Car not found" });
    }

    let stopDuration = null;
    if (!data.isMoving && data.stopStartTime) {
      stopDuration = moment().diff(data.stopStartTime, "minutes");
    }

    return res.status(200).json({ ...data, stopDuration });
  } catch (error) {
    console.error("Error getting car status:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const getAllCarStatus = async (req, res) => {
  try {
    const carIds = Object.keys(getCarStatus);
    if (carIds.length === 0) {
      return res.status(404).json({ message: "No cars found" });
    }
    const allCarStatus = carIds.map((carId) => {
      const status = carStatus[carId];
      let carStop = null;
      if (!status.isMoving && status.stopStartTime) {
        const stopDuration = moment().diff(status.stopStartTime, "minutes");
        carStop = {
          isStopped: true,
          duration: stopDuration,
        };
      } else {
        carStop = {
          isStopped: false,
          duration: 0,
        };
      }
      return {
        carId: carId,
        isMoving: status.isMoving,
        stopDuration: stopDuration,
        lastLocation: {
          latitude: status.lastLat,
          longitude: status.lastLon,
        },
        lastSpeed: status.lastSpeed,
      };
    });
    return res.status(200).json(allCarStatus);
  } catch (error) {
    console.error("Error getting all car statuses:", error);
    throw error;
  }
};

export default {
  getCarStatusId,
  getAllCarStatus,
};
