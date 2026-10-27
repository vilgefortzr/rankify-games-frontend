import { useEffect, useState } from "react";
import { fetchJson } from "../api.js";
import GameCard from "../components/GameCard.jsx";

const SEARCH_DELAY = 400;

const messages = {
  loading: "Завантаження...",
  error: "Не вдалося завантажити ігри",
  empty: "Нічого не знайдено",
};

export default function Games() {
  const [query, setQuery] = useState("");
  const [games, setGames] = useState([]);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    const delay = query ? SEARCH_DELAY : 0;
    const timer = setTimeout(async () => {
      try {
        const search = encodeURIComponent(query.trim());
        const data = await fetchJson(`/games/?search=${search}`);
        setGames(data);
        setStatus(data.length ? "ready" : "empty");
      } catch {
        setStatus("error");
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <section className="page">
      <div className="page-head">
        <h1 className="page-title">Ігри</h1>
        <input
          className="page-search"
          type="search"
          placeholder="Знайти гру"
          aria-label="Пошук гри"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      {status === "ready" ? (
        <ul className="collection-grid">
          {games.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </ul>
      ) : (
        <p className="card-state">{messages[status]}</p>
      )}
    </section>
  );
}