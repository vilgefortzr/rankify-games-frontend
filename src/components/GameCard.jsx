import { Link } from "react-router-dom";

export default function GameCard({ game }) {
  const { steam_id, title, img_url } = game;

  return (
    <li className="collection-card">
      <Link to={`/games/${steam_id}`}>
        {img_url ? (
          <img className="collection-img" src={img_url} alt={title} />
        ) : (
          <div className="collection-img" />
        )}
        <div className="collection-body">
          <h3 className="game-title">{title}</h3>
        </div>
      </Link>
    </li>
  );
}