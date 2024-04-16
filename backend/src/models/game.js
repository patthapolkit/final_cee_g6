// models/game.js
import mongoose from 'mongoose';

const GameInstanceSchema = new mongoose.Schema({
  player: {
    type: mongoose.Schema.Types.ObjectId,
    required: false  // Make the player field optional
  },
  current_swings: {
    type: Number,
    required: true
  },
  total_swings: {
    type: Number,
    required: true
  },
  current_position: {
    posX: {
      type: Number,
      required: true
    },
    posY: {
      type: Number,
      required: true
    }
  }
});

const GameSchema = new mongoose.Schema({
  id: {
    type: mongoose.Schema.Types.ObjectId
  },
  roomNumber: {
    type: Number,
    required: true
  },
  numberOfPlayers: {
    type: Number,
    required: true
  },
  playerTurns: [{
    type: mongoose.Schema.Types.ObjectId
  }],
  Instance: {
    type: GameInstanceSchema
  }
});

const Game = mongoose.model('Game', GameSchema);

export default Game;
