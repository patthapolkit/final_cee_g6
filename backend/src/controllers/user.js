import User from "../models/user.js";

//@desc    Create User
//@route   POST /api/users
export const createUser = async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json({ success: true, data: user });
  } catch (error) {
    res
      .status(400)
      .json({ success: false, message: "Username/Room Number required" });
  }
};

//@desc    Get All Users
//@route   GET /api/users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({ success: true, count: users.length, data: users });
  } catch (error) {
    res.status(400).json({ success: false, message: "error occored" });
  }
};

//@desc    Get One Users
//@route   GET /api/users/id
export const getUserbyId = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404).json({ success: false, message: "cannot find user" });
    }

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res
      .status(400)
      .json({ success: false, message: "Username/Room Number required" });
  }
};
