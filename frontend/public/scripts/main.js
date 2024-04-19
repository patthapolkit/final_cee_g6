import { createUser } from "./api.js";

const joinRoomButton = document.getElementById("joinRoomButton");
const nameInput = document.getElementById("nameInput");
const roomNumberInput = document.getElementById("roomNumberInput");
joinRoomButton.addEventListener("click", async () => {
  await createUser({
    name: nameInput.value,
    roomNumber: roomNumberInput.value,
  });
  nameInput.value = "";
  roomNumberInput.value = "";
});

// const createRoomButton = document.getElementById("createRoomButton");
// createRoomButton.addEventListener("click", async () => {
//   await createUser({
//     name: nameInput.value,
//     roomNumber: roomNumberInput.value,
//   });
//   nameInput.value = "";
// });
