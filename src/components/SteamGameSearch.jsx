import { useCallback, useState } from "react";
import { collectionsApi, steamApi } from "../api/endpoints.js";
import { useAsync } from "../hooks/useAsync.js";
import { useDebouncedValue } from "../hooks/useDebouncedValue.js";
import Cover from "./Cover.jsx";
import SearchInput from "./SearchInput.jsx";
import StateMessage from "./StateMessage.jsx";

export default function SteamGameSearch({ collectionId, addedSteamIds, onAdded }) {
  const [query, setQuery] = useState("");
  const term = useDebouncedValue(query.trim());
  const [addingId, setAddingId] = useState(null);
  const [error, setError] = useState("");

  const loader = useCallback((signal) => (term ? steamApi.search(term, signal) : undefined), [term]);
  const { status, data, error: searchError } = useAsync(loader);
  const typing = query.trim() !== term;

  const handleAdd = async (steamId) => {
    setAddingId(steamId);
    setError("");
    try {
      await collectionsApi.addGame(collectionId, steamId);
      setQuery("");
      onAdded?.();
    } catch (e) {
      setError(e.message);
    } finally {
      setAddingId(null);
    }
  };

  return (
    <section className="sheet steam-search">
      <h2 className="section-title">Add a game</h2>
      <SearchInput
        value={query}
        onChange={setQuery}
        placeholder="Game title on Steam"
      />
      {error && <p className="form-error">{error}</p>}

      {query.trim() && (
        <StateMessage
          status={typing ? "loading" : status}
          error={searchError}
          messages={{ loading: "Searching Steam…", error: "Search failed" }}
        />
      )}

      {!typing && status === "ready" && (
        <ul className="steam-results">
          {data.map((game) => {
            const added = addedSteamIds.includes(game.steam_id);
            const adding = addingId === game.steam_id;
            return (
              <li className="steam-result" key={game.steam_id}>
                <Cover className="steam-result-cover" src={game.img_url} alt="" />
                <span className="steam-result-title">{game.title}</span>
                <button
                  className="btn"
                  type="button"
                  disabled={added || addingId != null}
                  onClick={() => handleAdd(game.steam_id)}
                >
                  {added ? "Already added" : adding ? "Adding…" : "Add"}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
