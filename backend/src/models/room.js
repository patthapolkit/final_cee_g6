import mongoose from 'mongoose';

const RoomSchema = new mongoose.Schema({
  roomNumber: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    required: true
  },
  numberOfPlayers: {
    type: Number,
    required: true
  },
  playerTurn: {
    type: mongoose.Schema.ObjectId,
    required: true
  },
  Instance: [{
    player: {
        type: mongoose.Schema.ObjectId,
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
    },
    target_position: {
      posX: {
          type: Number,
          required: true
      },
      posY: {
          type: Number,
          required: true
      }
  }
  }]

});

const Room = mongoose.model('Room', RoomSchema);

export default Room;
