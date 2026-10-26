export const formatGenre = (genre) =>
  genre.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase());