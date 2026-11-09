import { Link } from "react-router-dom";
import { gamesCount, votesCount } from "../lib/format.js";
import Cover from "./Cover.jsx";
import GenreTag from "./GenreTag.jsx";

export default function CollectionCard({ collection }) {
  const { id, title, genre, description, games_count, total_votes, top_game } = collection;

  return (
    <article className={`pack g-${genre}`}>
      <Link className="pack-link" to={`/collections/${id}`}>
        <div className="pack-band">
          <GenreTag genre={genre} className="genre-tag-on-band" />
          <span className="pack-count">{gamesCount(games_count)}</span>
        </div>
        <Cover className="pack-art" src={top_game?.img_url} alt={top_game ? `Leader: ${top_game.title}` : ""} />
        <div className="pack-body">
          <h2 className="pack-title">{title}</h2>
          <p className="pack-text">{description || "No description"}</p>
          <p className="pack-meta">
            <span className="num">{votesCount(total_votes)}</span>
          </p>
        </div>
      </Link>
    </article>
  );
}
