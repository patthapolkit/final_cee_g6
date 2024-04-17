import express from "express";
import { createRoom, getAllRooms, getAllRoomNumber, getRoomById, createInstance, updateInstance, deleteRoomById } from "../controllers/room.js";

const router = express.Router();

router.route('/')
    .get(getAllRooms)
    .post(createRoom);

router.route('/number')
    .get(getAllRoomNumber);

router.route('/:id')
    .get(getRoomById)
    .post(createInstance)

router.route('/instanceUpdate/:id').put(updateInstance);
router.route('/instanceDelete/:id').put(deleteRoomById);


export default router;