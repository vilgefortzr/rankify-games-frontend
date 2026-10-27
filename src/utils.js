export const formatGenre = (genre) => {
  if (genre === "rpg") return 'RPG';
  return genre.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase());
};