// backend/parse/firebaseService.js

import { firebaseStoreDB } from '../firebaseAdmin.js'; 

const carCollection = firebaseStoreDB.collection('car-pos'); 

export const saveCarData = async (carData) => {
    try {
        const carRef = carCollection.doc(carData.carId);
        await carRef.set(carData, { merge: true });
        console.log(`Dữ liệu của xe ${carData.carId} đã được lưu thành công.`);
    } catch (error) {
        console.error("Lỗi khi lưu dữ liệu xe:", error);
    }
};

export const getCarStatus = async (carId) => {
    try {
        const doc = await carCollection.doc(carId).get();
        if (doc.exists) {
            return doc.data(); 
        } else {
            return null; 
        }
    } catch (error) {
        console.error("Lỗi khi lấy dữ liệu xe:", error);
        return null;
    }
};
