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
  createPlayerControl,
} from "./api.js";

const joinRoomButton = document.getElementById("joinRoomButton");
const createRoomButton = document.getElementById("createRoomButton");
const nameInput = document.getElementById("nameInput");
const roomNumberInput = document.getElementById("roomNumberInput");
document
  .getElementById("closeErrorBtn")
  .addEventListener("click", closeErrorPopup);

function openErrorPopup(message) {
  const errorText = document.getElementById("errorText");
  errorText.innerText = message;
  errorPopup.style.display = "block";
  errorContainer.appendChild(errorPopup);
}

function closeErrorPopup() {
  const errorPopup = document.getElementById("errorPopup");
  errorPopup.style.display = "none";
}

joinRoomButton.addEventListener("click", async () => {
  const createdUser = await createUser({
    name: nameInput.value,
    roomNumber: roomNumberInput.value,
  });

  if (createdUser.success) {
    const userId = createdUser.data._id;
    const rooms = await getAllRoomNumber();
    const room = rooms.data.find(
      (room) => room.roomNumber === Number(roomNumberInput.value)
    );

    if (!room) {
      openErrorPopup("Room not found");
      return;
    }
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
    await createPlayerControl({
      player: userId,
      power: 0,
      angle: 0,
      currentMap : 1,
      Status : "not_swing"
    })

    nameInput.value = "";
    roomNumberInput.value = "";
    window.location.href = `/game.html?userId=${userId}&roomId=${roomId}`;
  } else {
    openErrorPopup(createdUser.message);
  }
});

createRoomButton.addEventListener("click", async () => {
  const createdUser = await createUser({
    name: nameInput.value,
    roomNumber: roomNumberInput.value,
  });

  if (createdUser.success) {
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
    await createPlayerControl({
      player: userId,
      power: 0,
      angle: 0,
      currentMap : 1,
      Status : "not_swing"
    })

    nameInput.value = "";
    roomNumberInput.value = "";
    window.location.href = `/game.html?userId=${userId}&roomId=${roomId}`;
  } else {
    console.log("errorrrrr");
    openErrorPopup(createdUser.message);
  }
});
