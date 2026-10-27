import { useEffect, useState } from "react";
import { fetchJson, postJson } from "../api.js";

const SEARCH_DELAY = 400;

export default function GameSearch({ collectionId, addedIds, onAdded }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const [addingId, setAddingId] = useState(null);

  useEffect(() => {
    const search = query.trim();
    if (!search) {
      setResults([]);
      setStatus("idle");
      return;
    }

    let cancelled = false;
    setStatus("loading");
    const timer = setTimeout(async () => {
      try {
        const data = await fetchJson(`/steam/games/?search=${encodeURIComponent(search)}`);
        if (cancelled) return;
        setResults(data);
        setStatus("ready");
      } catch {
        if (!cancelled) setStatus("error");
      }
    }, SEARCH_DELAY);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [query]);

  const handleAdd = async (steamId) => {
    setAddingId(steamId);
    setError("");
    try {
      await postJson(`/collections/${collectionId}/games/`, { steam_id: steamId });
      await onAdded();
      setQuery("");
    } catch (e) {
      setError(e.message);
    }
    setAddingId(null);
  };

  return (
    <div className="game-search">
      <input
        type="search"
        placeholder="Додати гру зі Steam: введіть назву"
        aria-label="Пошук гри в Steam"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      {error && <p className="field-error">{error}</p>}
      {status === "loading" && <p className="card-state">Пошук...</p>}
      {status === "error" && <p className="card-state">Не вдалося виконати пошук</p>}
      {status === "ready" && results.length === 0 && <p className="card-state">Нічого не знайдено</p>}
      {status === "ready" && results.length > 0 && (
        <ul className="search-results">
          {results.map((game) => {
            const added = addedIds.includes(game.steam_id);
            return (
              <li className="search-result" key={game.steam_id}>
                <img className="search-result-img" src={game.img_url} alt="" />
                <span className="search-result-title">{game.title}</span>
                <button
                  className="btn"
                  type="button"
                  disabled={added || addingId === game.steam_id}
                  onClick={() => handleAdd(game.steam_id)}
                >
                  {added ? "Вже додано" : addingId === game.steam_id ? "Додавання..." : "Додати"}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}