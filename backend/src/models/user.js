import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please add a name"],
  },
  roomNumber: {
    type: Number,
    required: [true, "Please apply room number"],
  },
});

const User = mongoose.model("User", UserSchema);
export default User;
