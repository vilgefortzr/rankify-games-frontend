const LOCALE = "en-US";

export const formatNumber = (value) => (value ?? 0).toLocaleString(LOCALE);

export const formatDate = (iso) =>
  new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

const countLabel = (one, many) => (n) => `${formatNumber(n)} ${n === 1 ? one : many}`;

export const gamesCount = countLabel("game", "games");
export const votesCount = countLabel("vote", "votes");
