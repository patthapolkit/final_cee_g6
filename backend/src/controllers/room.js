import { log } from "console";
import Room from "../models/room.js";

//@desc    Create Room
//@route   POST /api/room
export const createRoom = async (req, res) => {
  try {
    const room = await Room.create(req.body);
    res.status(201).json({ message: "Created!", room });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

//@desc    Get All Rooms
//@route   GET /api/room
export const getAllRooms = async (req, res) => {
  try {
    const rooms = await Room.find();
    res.status(200).json({ success: true, count: rooms.length, data: rooms });
  } catch (error) {
    res.status(404).json({ success: false, message: "room not found" });
  }
};

//@desc    Get All Room number
//@route   GET /api/room/number
export const getAllRoomNumber = async (req, res) => {
  try {
    console.log("trying to get all number...");
    const rooms = await Room.find();
    const outData = rooms.map((room) => room.roomNumber);
    console.log(outData);
    res.status(200).json({ success: true, count: rooms.length, data: outData });
  } catch (error) {
    res.status(404).json({ success: false, message: "room not found" });
  }
};

//@desc    Get room by Id
//@route   GET /api/room/:id
export const getRoomById = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) {
      res.status(404).json({ success: false, message: "not found" });
    }
    res.status(200).json({ success: true, data: room });
  } catch (error) {
    res
      .status(400)
      .json({ success: false, message: "Failed to get room by Id" });
  }
};

//@desc    Delete room by Id
//@route   DELETE /api/room/:id
export const deleteRoomById = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) {
      res.status(404).json({ success: false, message: "room not found" });
    }

    await room.deleteOne();
    res.status(200).json({ success: true, data: room });
  } catch (error) {
    res.status(400).json({ success: false, message: "Error" });
  }
};

// --------------------------------------------------------------------------

//@desc    Create Instance by Id
//@route   POST /api/room/:id
export const createInstance = async (req, res) => {
  try {
    const { player, current_swings, total_swings, current_position } = req.body;
    console.log(player, current_swings, total_swings, current_position);
    if (
      player === undefined ||
      current_swings === undefined ||
      total_swings === undefined ||
      current_position === undefined
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Error: Missing required fields" });
    }
    const newInstance = {
      player: player,
      current_swings: current_swings,
      total_swings: total_swings,
      current_position: current_position,
    };

    const room = await Room.findById(req.params.id);

    const instances = room.Instance;
    if (instances.some((instance) => instance.player.equals(player))) {
      return res
        .status(400)
        .json({ success: false, message: "Player already in the Instance!" });
    }
    instances.push(newInstance);

    await room.save();

    return res.status(201).json({ success: true, data: newInstance });
  } catch (error) {
    res.status(400).json({ success: false, message: "Error 2" });
  }
};

//@desc    Delete Instance by Id
//@route   PUT /api/room/:id
export const DeleteInstance = async (req, res) => {
  try {
    console.log("trying to delete instance....");
    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ success: false, message: "Room not found" });
    }
    // Update the document in the collection to remove the player object from the Instance array
    await db.rooms.updateOne(
      { _id: ObjectId(req.params.id) }, // Filter criteria (replace with the room ID)
      { $pull: { Instance: { player: req.body } } } // Pull (remove) the player object with the specified player ID
    );

    return res.status(200).json({ success: true, data: room.Instance });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

//@desc    Update Instance by Id
//@route   PUT /api/room/:id
export const updateInstance = async (req, res) => {
  const { player, current_swings, total_swings, current_position } = req.body;

  try {
    if (
      player === undefined ||
      current_swings === undefined ||
      total_swings === undefined ||
      current_position === undefined
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Error: Missing required fields" });
    }

    const room = await Room.findById(req.params.id);
    if (!room) {
      return res
        .status(404)
        .json({ success: false, message: "Room not found" });
    }

    const playerInstance = room.Instance.find((instance) =>
      instance.player.equals(player)
    );
    if (!playerInstance) {
      return res
        .status(404)
        .json({ success: false, message: "Player instance not found" });
    }

    playerInstance.current_swings = current_swings;
    playerInstance.total_swings = total_swings;
    playerInstance.current_position = current_position;

    await room.save();

    return res.status(200).json({ success: true, data: room.Instance });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
