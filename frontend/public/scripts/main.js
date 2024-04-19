import { createRoom, createUser } from "./api.js";

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

 const createRoomButton = document.getElementById("createRoomButton");
 createRoomButton.addEventListener("click", async () => {
/*    await createUser({
     name: nameInput.value,
     roomNumber: roomNumberInput.value,
   });
   nameInput.value = ""; */

   const createdUser = await createUser({
      name: nameInput.value,
      roomNumber: roomNumberInput.value,
    });
    console.log(createdUser.name);
    nameInput.value = "";

   await createRoom({
      roomNumber: roomNumberInput.value,
      status: "waiting",
      numberOfPlayers: 1,
      
      Instance: [{
        player: createdUser._id,
        current_swings: 0,
        total_swings: 0,
        current_position: {
          posX: 18,
          posY: 18
        }
      }]
   })
   roomNumberInput.value = "";

 });
