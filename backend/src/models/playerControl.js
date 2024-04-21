import mongoose from "mongoose";

const playerControlSchema = new mongoose.Schema({
  player: {
    type: mongoose.Schema.ObjectId,
  },
  power: {
    type: Number,
    required: true,
  },
  angle: {
    type: Number,
    required: true,
  },
});

const playerControl = mongoose.model("PlayerControl", playerControlSchema);

export default playerControl;
