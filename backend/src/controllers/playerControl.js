import PlayerControl from "../models/playerControl.js";

//@desc    Create playerControl
//@route   POST /api/playerControl
export const createPlayerControl = async (req, res) => {
  try {
    const player = await PlayerControl.create(req.body);
    res.status(201).json({ success: true, data: player });
  } catch (error) {
    res.status(400).json({ success: false, message: "Username required" });
  }
};

//@desc    Get One playerControl
//@route   GET /api/playerControl/:id
export const getPlayerControlbyId = async (req, res) => {
  try {
    const playerId = req.query.playerId;

    if (!playerId) {
      return res
        .status(400)
        .json({ success: false, message: "Player ID is required" });
    }

    const playerControl = await PlayerControl.findOne({
      player: playerId,
    }).populate("player");

    if (!playerControl) {
      return res.status(404).json({
        success: false,
        message: "Cannot find player control for the provided player ID",
      });
    }

    res.status(200).json({ success: true, data: playerControl });
  } catch (error) {
    console.log(error.stack);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

//@desc    Get All Control
//@route   GET /api/playerControl
export const getAllPlayerControl = async (req, res) => {
  try {
    const player = await PlayerControl.find();
    res.status(200).json({ success: true, count: player.length, data: player });
  } catch (error) {
    console.log(error.stack);
    res.status(404).json({ success: false, message: "playerId not found" });
  }
};

//@desc    Update player control by Id
//@route   PUT /api/playerControl/upDatePlayerById
export const updatePlayerControlbyId = async (req, res) => {
  try {
    const playerId = req.query.playerId;

    if (!playerId) {
      return res
        .status(400)
        .json({ success: false, message: "Player ID is required" });
    }

    let playerControl = await PlayerControl.findOne({ player: playerId });

    if (!playerControl) {
      return res.status(404).json({
        success: false,
        message: "Cannot find player control for the provided player ID",
      });
    }

    const { power, angle } = req.body;
    if (!power || !angle) {
      return res.status(404).json({
        success: false,
        message: "Cannot find player control for the provided player ID",
      });
    }
    playerControl.power = power;
    playerControl.angle = angle;

    playerControl = await playerControl.save();

    res.status(200).json({ success: true, data: playerControl });
  } catch (error) {
    console.log(error.stack);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
