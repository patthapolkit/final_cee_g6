import express from "express";
import { createRoom, getAllRooms, getRoomById, createInstance } from "../controllers/room.js";

const router = express.Router();

router.route('/').get(getAllRooms).post(createRoom);
router.route('/:id').get(getRoomById).post(createInstance);

export default router;