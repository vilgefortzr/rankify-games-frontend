import { Link } from "react-router-dom";
import Cover from "./Cover.jsx";

export default function GameCard({ game }) {
  const { steam_id, title, img_url } = game;

  return (
    <article className="tcard tcard-plain">
      <Link className="tcard-link" to={`/games/${steam_id}`}>
        <Cover className="tcard-art" src={img_url} alt={title} />
        <div className="tcard-plate">
          <h2 className="tcard-name">{title}</h2>
        </div>
      </Link>
    </article>
  );
}
