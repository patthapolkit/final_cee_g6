import express from "express";
import { loginOrRegister } from "../controllers/auth.js";

const router = express.Router();

router.route('/logreg').post(loginOrRegister);

export default router;