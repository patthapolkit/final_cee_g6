import express from "express";
import { createRoom, getAllRooms, getAllRoomNumber, getRoomById, createInstance } from "../controllers/room.js";

const router = express.Router();

router.route('/').get(getAllRooms).post(createRoom);
router.route('/number').get(getAllRoomNumber);
router.route('/:id').get(getRoomById).post(createInstance);


export default router;