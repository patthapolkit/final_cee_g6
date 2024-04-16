import express from "express";
import { createUser, getAllUsers, getUserbyId } from "../controllers/user.js";

const router = express.Router();

router.route('/').get(getAllUsers).post(createUser);
router.route('/:id').get(getUserbyId);

export default router;