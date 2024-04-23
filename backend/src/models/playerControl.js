import mongoose from "mongoose";

const playerControlSchema = new mongoose.Schema({
  player: {
    type: mongoose.Schema.ObjectId,
  },
  signal: {
    type: String,
  },
  currentMap: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  power: {
    type: Number,
    required: true,
  },
  angle: {
    type: Number,
    required: true,
  },
  currentTime:{
    type:Number
  },
  lastTime:{
    type:Number
  }
});

const playerControl = mongoose.model("PlayerControl", playerControlSchema);

export default playerControl;
