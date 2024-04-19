import { BACKEND_URL } from "./config.js";

export async function createRoom(room) {
  await fetch(`${BACKEND_URL}/api/room`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(room),
  });
}

export async function getRooms() {
  const rooms = await fetch(`${BACKEND_URL}/api/room`).then((r) => r.json());
  return rooms;
}

export async function getRoomNumber() {
  const roomNumbers = await fetch(`${BACKEND_URL}/api/room/number`).then((r) =>
    r.json()
  );
  return roomNumbers;
}

export async function getRoomById(id) {
  const room = await fetch(`${BACKEND_URL}/api/room/${id}`).then((r) =>
    r.json()
  );
  return room;
}

export async function deleteRoomById(id) {
  await fetch(`${BACKEND_URL}/api/room/${id}`, {
    method: "DELETE",
  });
}

export async function createInstance(id, instance) {
  await fetch(`${BACKEND_URL}/api/room/instanceCreate/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(instance),
  });
}

export async function updateInstance(id, instance) {
  await fetch(`${BACKEND_URL}/api/room/instanceUpdate/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(instance),
  });
}

export async function deleteInstance(id, instance) {
  await fetch(`${BACKEND_URL}/api/room/instanceDelete/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(instance),
  });
}

export async function getUsers() {
  const users = await fetch(`${BACKEND_URL}/api/user`).then((r) => r.json());
  return users;
}

export async function createUser(user) {
  const response = await fetch(`${BACKEND_URL}/api/user`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  });

  const data = await response.json()
  return data;
}

export async function getUserById(id) {
  const user = await fetch(`${BACKEND_URL}/api/user/${id}`).then((r) =>
    r.json()
  );
  return user;
}
