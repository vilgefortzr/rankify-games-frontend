export const formatGenre = (genre) => {
  if (genre === "rpg") return 'RPG';
  return genre.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase());
};

export const GENRES = [
  ["action", "Action"],
  ["adventure", "Adventure"],
  ["rpg", "RPG"],
  ["shooter", "Shooter"],
  ["strategy", "Strategy"],
  ["simulation", "Simulation"],
  ["sports", "Sports"],
  ["racing", "Racing"],
  ["fighting", "Fighting"],
  ["platformer", "Platformer"],
  ["puzzle", "Puzzle"],
  ["horror", "Horror"],
  ["survival", "Survival"],
  ["open_world", "Open World"],
  ["roguelike", "Roguelike"],
  ["indie", "Indie"],
  ["other", "Other"],
];