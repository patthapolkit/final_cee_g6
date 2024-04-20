import express from "express";
import {
  createRoom,
  getAllRooms,
  getAllRoomNumber,
  getRoomById,
  getInstance,
  createInstance,
  updateInstance,
  deleteRoomById,
  deleteInstance,
} from "../controllers/room.js";

const router = express.Router();

router.route("/").get(getAllRooms).post(createRoom);

router.route("/number").get(getAllRoomNumber);

router.route("/:id").get(getRoomById).delete(deleteRoomById);

router.route("/instanceGet/:id").get(getInstance);
router.route("/instanceCreate/:id").put(createInstance);
router.route("/instanceUpdate/:id").put(updateInstance);
router.route("/instanceDelete/:id").put(deleteInstance);

export default router;
