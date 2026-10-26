import { formatGenre } from "../utils.js";

export default function CollectionCard({ collection }) {
  const { title, genre, description, games_count, total_votes, top_game } = collection;

  return (
    <li className="collection-card">
      {top_game?.img_url ? (
        <img className="collection-img" src={top_game.img_url} alt={top_game.title} />
      ) : (
        <div className="collection-img" />
      )}
      <div className="collection-body">
        <div className="result-head">
          <h3>{title}</h3>
          <span className="genre-tag">{formatGenre(genre)}</span>
        </div>
        <p className="collection-desc">{description || "Без опису"}</p>
        <p className="result-meta">
          {games_count} ігор · {total_votes} голосів
        </p>
      </div>
    </li>
  );
}