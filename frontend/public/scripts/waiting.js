// import getRoomId from api.js
import { getRoomById } from "./api.js";
// Get the userId and roomId from the localStorage
const userId = localStorage.getItem("userId");
const roomId = localStorage.getItem("roomId");
let numberOfPlayers = 0;

function redirectToGame() {
  window.location.href = `/game.html?userId=${userId}&roomId=${roomId}`;
}

// fetch the number of players in the room
function connectWithShortPoll() {
  var lastFetch = new Date(1970, 1, 1);

  setInterval(() => {
    // fetch the number of players in the room
    getRoomById(roomId).then((room) => {
      numberOfPlayers = room.data.numberOfPlayers;
      // set text to the number of players
      document.getElementById(
        "playerInRoom"
      ).innerText = `Current Players - ${numberOfPlayers}/4`;

      // if the number of players is 4, redirect to game page
      if (numberOfPlayers === 4) {
        redirectToGame();
      }
    });
    lastFetch = new Date();
  }, 1000);
}

connectWithShortPoll();
