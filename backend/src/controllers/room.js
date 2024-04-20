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
    const outData = rooms.map((room) => {
      return { roomNumber: room.roomNumber, roomId: room._id };
    });
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
//@route   PUT /api/room/instanceCreate/:id
export const createInstance = async (req, res) => {
  try {
    const roomId = req.params.id;
    const newInstanceData = req.body;

    const updatedRoom = await Room.findByIdAndUpdate(
      roomId,
      { $push: { Instance: newInstanceData } },
      { new: true }
    );

    if (!updatedRoom) {
      return res
        .status(404)
        .json({ success: false, message: "Room not found" });
    }

    // increase number of players in the room
    updatedRoom.current_players += 1;
    await updatedRoom.save();

    if (updatedRoom.current_players === 4) {
      updatedRoom.status = "playing";
      await updatedRoom.save();
    }

    res.status(200).json({
      success: true,
      message: "Instance added successfully",
      room: updatedRoom,
    });
  } catch (error) {
    console.error("Error adding instance:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

//@desc    Delete Instance by Id
//@route   PUT /api/room/instanceDelete/:id
export const deleteInstance = async (req, res) => {
  try {
    console.log("trying to delete intstance");
    const roomId = req.params.id;
    const { player } = req.body; // Extracting the player ID from the request body
    const updatedRoom = await Room.findByIdAndUpdate(
      roomId,
      { $pull: { Instance: { player } } },
      { new: true }
    );

    if (!updatedRoom) {
      return res
        .status(404)
        .json({ success: false, message: "Room not found" });
    }

    // reduce number of players in the room
    updatedRoom.current_players -= 1;
    await updatedRoom.save();

    if (updatedRoom.current_players <= 4) {
      updatedRoom.status = "waiting";
      await updatedRoom.save();
    }

    res.status(200).json({
      success: true,
      message: "Instance deleted successfully",
      room: updatedRoom,
    });
  } catch (error) {
    console.error("Error deleting instance:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

//@desc    Update Instance by Id
//@route   PUT /api/room/instanceUpdate/:id
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
