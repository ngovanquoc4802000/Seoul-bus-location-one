// chứa các hàm để tương tác với Firebase.

import { firebaseStoreDB } from '../firebaseAdmin.js'; 


const saveCarData = async (carData) => {
    try {
        const carRef = firebaseStoreDB.collection('car-pos').doc(carData.carId);
        await carRef.set(carData, { merge: true });
        console.log(`Car data for ${carData.carId} saved successfully.`);
    } catch (error) {
        console.error("Error saving car data:", error);
    }
}
export { saveCarData };