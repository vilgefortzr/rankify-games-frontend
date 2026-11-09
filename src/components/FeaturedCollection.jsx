import { Link } from "react-router-dom";
import { collectionsApi } from "../api/endpoints.js";
import { useAsync } from "../hooks/useAsync.js";
import RankedGameList from "./RankedGameList.jsx";
import StateMessage from "./StateMessage.jsx";

const TOP_GAMES = 3;

const loadTopCollection = async (signal) => {
  const [top] = await collectionsApi.list("", signal);
  return top ? collectionsApi.get(top.id, signal) : [];
};

export default function FeaturedCollection() {
  const { status, data: collection, error, reload } = useAsync(loadTopCollection);

  if (status !== "ready") {
    return (
      <aside className="binder featured">
        <StateMessage
          status={status}
          error={error}
          messages={{ empty: "No collections yet. Create the first one!" }}
        />
      </aside>
    );
  }

  return (
    <aside className={`binder featured g-${collection.genre}`}>
      <h2 className="binder-title">
        <Link to={`/collections/${collection.id}`}>{collection.title}</Link>
      </h2>
      {collection.games.length ? (
        <RankedGameList collection={collection} limit={TOP_GAMES} onChanged={reload} compact />
      ) : (
        <p className="state-text">This collection has no games yet</p>
      )}
    </aside>
  );
}
