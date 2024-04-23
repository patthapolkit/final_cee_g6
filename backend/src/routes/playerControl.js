import express from "express";
import {
  createPlayerControl,
  getPlayerControlbyId,
  getAllPlayerControl,
  updatePlayerControlbyId,
  deletePlayerControlbyId,
} from "../controllers/playerControl.js";

const router = express.Router();

router.route("/").get(getAllPlayerControl).post(createPlayerControl);

router.route("/getPlayerById").get(getPlayerControlbyId);
router.route("/upDatePlayerById").put(updatePlayerControlbyId);
router.route("/deletePlayerById").delete(deletePlayerControlbyId);

export default router;
