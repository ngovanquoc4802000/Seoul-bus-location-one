import express from 'express';
import busControllers from '../controllers/busStatusControllers.js';
const router = express.Router({
    mergeParams: true
});

router.get("/status/:carId", busControllers.getCarStatusId);
router.get("/status/all", busControllers.getAllCarStatus);

export default router;

