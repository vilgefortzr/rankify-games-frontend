import { Link, useSearchParams } from "react-router-dom";
import { collectionsApi } from "../api/endpoints.js";
import CardGrid from "../components/CardGrid.jsx";
import CollectionCard from "../components/CollectionCard.jsx";
import SearchInput from "../components/SearchInput.jsx";
import StateMessage from "../components/StateMessage.jsx";
import { useSearchList } from "../hooks/useSearchList.js";

export default function Collections() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { query, setQuery, term, status, data, error, stale } = useSearchList(collectionsApi.list, {
    initialQuery: searchParams.get("search") ?? "",
  });

  const handleChange = (value) => {
    setQuery(value);
    setSearchParams(value.trim() ? { search: value.trim() } : {}, { replace: true });
  };

  return (
    <section className="page">
      <header className="page-head">
        <h1 className="page-title">Collections</h1>
        <SearchInput value={query} onChange={handleChange} placeholder="Find a collection" />
      </header>

      {!stale && (
        <StateMessage
          status={status}
          error={error}
          messages={{
            error: "Failed to load collections",
            empty: term ? "Nothing found" : "No collections yet",
          }}
        />
      )}
      {status === "empty" && !term && (
        <Link className="btn btn-gold" to="/collections/new">
          Create the first collection
        </Link>
      )}
      {(status === "ready" || stale) && (
        <div className={`results ${stale ? "is-stale" : ""}`}>
          <CardGrid items={data} render={(c) => <CollectionCard collection={c} />} />
        </div>
      )}
    </section>
  );
}
