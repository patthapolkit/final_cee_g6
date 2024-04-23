import { getRoomById, getInstance, getUserById } from "./api.js";
// Get the userId and roomId from the localStorage
const userId = localStorage.getItem("userId");
const roomId = localStorage.getItem("roomId");

<<<<<<< HEAD
// ******** TODO: NEED TO REPLACE REAL ID WITH USER ID ********
const dataList = (await getRoomById('6627d256ac4e80317400153b')).data.Instance;
// ******** TODO: NEED TO REPLACE REAL ID WITH USER ID ********


var swingsData = [];
for (const info of dataList) {
    const playerName = (await getUserById(info.player)).data.name;
    swingsData.push({ playerName, swings: info.total_swings });
}

// Function to create leaderboard HTML
function createLeaderboard(data) {
    data.sort((a, b) => b.swings - a.swings);

    var leaderboardContainer = document.getElementById("leaderboard-container");

    data.forEach(function(player, index) {
        var listItem = document.createElement("div");
        listItem.textContent = `${index + 1}. ${player.playerName} - ${player.swings} swings`;
        leaderboardContainer.appendChild(listItem);
    });
}

createLeaderboard(swingsData);
=======
setInterval(async () => {
  const dataList = (await getRoomById(roomId)).data.Instance;

  var swingsData = [];
  for (const info of dataList) {
    const playerName = (await getUserById(info.player)).data.name;
    swingsData.push({ playerName, swings: info.total_swings });
  }

  // Function to create leaderboard HTML
  function createLeaderboard(data) {
    // clear the leaderboard container
    document.getElementById(
      "leaderboard-container"
    ).innerHTML = `<h1 class="leaderboard-title">Leaderboard</h1>`;
    data.sort((a, b) => a.swings - b.swings);

    var leaderboardContainer = document.getElementById("leaderboard-container");

    data.forEach(function (player, index) {
      var listItem = document.createElement("div");
      listItem.textContent = `${index + 1}. ${player.playerName} - ${
        player.swings
      } swings`;
      listItem.style.color = "#141716";
      listItem.style.fontSize = "clamp(1rem, 3vw, 1.5rem)";
      listItem.style.fontWeight = "500";
      leaderboardContainer.appendChild(listItem);
    });
  }

  createLeaderboard(swingsData);
}, 1000);
>>>>>>> 4c4218c712ba897ceff2cc9fc0e5948bdcd1d247
