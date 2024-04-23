import { getRoomById, getInstance, getUserById } from "./api.js";
// Get the userId and roomId from the localStorage
const userId = localStorage.getItem("userId");
const roomId = localStorage.getItem("roomId");

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