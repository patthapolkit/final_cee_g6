import { getRoomById } from "./api.js";

const userId = localStorage.getItem("userId");
const roomId = localStorage.getItem("roomId");
let numberOfPlayers = 0;

function redirectToGame() {
  window.location.href = `/game.html?userId=${userId}&roomId=${roomId}`;
}


function connectWithShortPoll() {
  var lastFetch = new Date(1970, 1, 1);

  setInterval(() => {

    getRoomById(roomId).then((room) => {
      numberOfPlayers = room.data.numberOfPlayers;

      document.getElementById(
        "playerInRoom"
      ).innerText = `Current Players - ${numberOfPlayers}/4`;


      if (numberOfPlayers === 4) {

        setTimeout(() => {
          redirectToGame();
        }, 3000);
      }
    });
    lastFetch = new Date();
  }, 1000);
}

connectWithShortPoll();
