import { getRoomById, getInstance, getUserById } from "./api.js";
// Get the userId and roomId from the localStorage
const userId = localStorage.getItem("userId");
const roomId = localStorage.getItem("roomId");

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
