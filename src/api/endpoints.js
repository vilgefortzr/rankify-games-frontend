import { http } from "./client.js";

const query = (search) => (search ? `?search=${encodeURIComponent(search)}` : "");

export const collectionsApi = {
  list: (search, signal) => http.get(`/collections/${query(search)}`, signal),
  get: (id, signal) => http.get(`/collections/${id}/`, signal),
  create: (data) => http.post("/collections/", data),
  update: (id, data) => http.patch(`/collections/${id}/`, data),
  remove: (id) => http.delete(`/collections/${id}/`),
  addGame: (id, steamId) => http.post(`/collections/${id}/games/`, { steam_id: steamId }),
  removeGame: (id, steamId) => http.delete(`/collections/${id}/games/${steamId}/`),
  vote: (id, collectionGameId) => http.post(`/collections/${id}/votes/${collectionGameId}/`),
  unvote: (id, collectionGameId) => http.delete(`/collections/${id}/votes/${collectionGameId}/`),
};

export const gamesApi = {
  list: (search, signal) => http.get(`/games/${query(search)}`, signal),
  get: (steamId, signal) => http.get(`/games/${steamId}/`, signal),
};

export const steamApi = {
  search: (search, signal) => http.get(`/steam/games/${query(search)}`, signal),
};
