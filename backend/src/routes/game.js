import express from 'express';
import { createGame, getGameById, updateGameById, deleteGameById } from '../controllers/game.js';

const router = express.Router();

// Route to create a new game
router.route('/')
  .post(createGame);

// Route to get a game by its ID
router.route('/:id')
  .get(getGameById)
  .put(updateGameById)
  .delete(deleteGameById);

export default router;
