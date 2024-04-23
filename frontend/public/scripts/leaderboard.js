import { getRoomById, getUserById, getPlayerControlbyId } from "./api.js";

const roomId = localStorage.getItem("roomId");

setInterval(async () => {
  const dataList = (await getRoomById(roomId)).data.Instance;

  var swingsData = [];
  for (const info of dataList) {
    const playerdata = await getUserById(info.player);
    const playerName = playerdata.data.name;
    const current_map = (await getPlayerControlbyId(playerdata.data._id)).data
      .currentMap;
    swingsData.push({ playerName, swings: info.total_swings, current_map });
  }

  function createLeaderboard(data) {
    const leaderboardContainer = document.getElementById(
      "leaderboard-container"
    );
    leaderboardContainer.innerHTML = `<h1 class="leaderboard-title">Leaderboard</h1>`;

    data.sort((a, b) => {
      if (a.current_map < b.current_map) return 1;
      if (a.current_map > b.current_map) return -1;

      if (a.swings < b.swings) return -1;
      if (a.swings > b.swings) return 1;

      return 0;
    });

    data.forEach((player, index) => {
      const listItem = document.createElement("div");
      listItem.innerHTML = `<p>${index + 1}. ${player.playerName}</p><p>${
        player.swings
      } Swings - Map ${player.current_map}</p>`;
      leaderboardContainer.appendChild(listItem);
    });
  }

  createLeaderboard(swingsData);
}, 1000);
