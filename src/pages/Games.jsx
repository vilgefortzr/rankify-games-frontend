import { gamesApi } from "../api/endpoints.js";
import CardGrid from "../components/CardGrid.jsx";
import GameCard from "../components/GameCard.jsx";
import SearchInput from "../components/SearchInput.jsx";
import StateMessage from "../components/StateMessage.jsx";
import { useSearchList } from "../hooks/useSearchList.js";

export default function Games() {
  const { query, setQuery, term, status, data, error, stale } = useSearchList(gamesApi.list);

  return (
    <section className="page">
      <title>Games · RankifyGames</title>
      <header className="page-head">
        <div>
          <h1 className="page-title">Games</h1>
        </div>
        <SearchInput value={query} onChange={setQuery} placeholder="Find a game" />
      </header>

      {!stale && (
        <StateMessage
          status={status}
          error={error}
          messages={{
            error: "Failed to load games",
            empty: term ? "Nothing found" : "No games yet. Add some to a collection",
          }}
        />
      )}
      {(status === "ready" || stale) && (
        <div className={`results ${stale ? "is-stale" : ""}`}>
          <CardGrid items={data} render={(g) => <GameCard game={g} />} />
        </div>
      )}
    </section>
  );
}
