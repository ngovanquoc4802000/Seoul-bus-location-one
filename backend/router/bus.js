import express from 'express';
import { getCarStatusId,getAllCarStatus } from '../controllers/busStatusControllers.js';
const router = express.Router({
    mergeParams: true
});

router.get("/status", getCarStatusId);
router.get("/status/all", getAllCarStatus);

export default router;

