import express from "express";
import { getGolfBalls, getGolfBall, createGolfBall, updateGolfBallPosition, clearGolfBalls } from "../controllers/golfball.js";

const router = express.Router();

router.route('/').get(getGolfBalls).post(createGolfBall);
router.route('/:id').get(getGolfBall).put(updateGolfBallPosition);
router.route('/clear').delete(clearGolfBalls);

export default router;