import {
  createRoom,
  getAllRooms,
  getAllRoomNumber,
  getRoomById,
  deleteRoomById,
  createInstance,
  updateInstance,
  deleteInstance,
  getUsers,
  createUser,
  getUserById,
} from "./api.js";

const joinRoomButton = document.getElementById("joinRoomButton");
const createRoomButton = document.getElementById("createRoomButton");
const nameInput = document.getElementById("nameInput");
const roomNumberInput = document.getElementById("roomNumberInput");

joinRoomButton.addEventListener("click", async () => {
  const createdUser = await createUser({
    name: nameInput.value,
    roomNumber: roomNumberInput.value,
  });
  const userId = createdUser.data._id;
  const rooms = await getAllRoomNumber();
  const room = rooms.data.find(
    (room) => room.roomNumber === Number(roomNumberInput.value)
  );
  const roomId = room.roomId;

  await createInstance(roomId, {
    player: userId,
    current_swings: 0,
    total_swings: 0,
    current_position: {
      posX: 100,
      posY: 100,
    },
  });

  nameInput.value = "";
  roomNumberInput.value = "";
  window.location.href = `/game.html?userId=${userId}&roomId=${roomId}`;
});

createRoomButton.addEventListener("click", async () => {
  const createdUser = await createUser({
    name: nameInput.value,
    roomNumber: roomNumberInput.value,
  });

  if (createUser.success) {
    const userId = createdUser.data._id;

    const createdRoom = await createRoom({
      roomNumber: roomNumberInput.value,
      status: "waiting",
      numberOfPlayers: 1,
      playerTurn: userId,
      Instance: [
        {
          player: userId,
          current_swings: 0,
          total_swings: 0,
          current_position: {
            posX: 100,
            posY: 100,
          },
        },
      ],
    });
    const roomId = createdRoom.room._id;

    nameInput.value = "";
    roomNumberInput.value = "";
    window.location.href = `/game.html?userId=${userId}&roomId=${roomId}`;
  } else {
    alert(createdUser.message);
  }
});
