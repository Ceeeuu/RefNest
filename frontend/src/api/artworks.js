import client from "./client";

// One function per API action. Components call these instead of axios directly.
export const listArtworks = () =>
  client.get("/artworks/").then((r) => r.data);

export const getArtwork = (id) =>
  client.get(`/artworks/${id}/`).then((r) => r.data);

export const createArtwork = (formData) =>
  client.post("/artworks/", formData).then((r) => r.data);

export const deleteArtwork = (id) =>
  client.delete(`/artworks/${id}/`);
