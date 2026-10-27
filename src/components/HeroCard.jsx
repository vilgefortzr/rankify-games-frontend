import { useEffect, useState } from "react";
import { fetchJson } from "../api.js";
import { formatGenre } from "../utils.js";
import { Link } from "react-router-dom";

const TOP_GAMES = 3;

function GameRow({ item, rank, maxVotes }) {
  const { game, votes_count } = item;

return (
  <li>
    <Link className="rank-item" to={`/games/${game.steam_id}`}>
      <span className="rank-pos">{rank}</span>
      {game.img_url ? (
        <img className="rank-img" src={game.img_url} alt="" />
      ) : (
        <div className="rank-img" />
      )}
      <div className="rank-info">
        <div className="rank-row">
          <span className="rank-title">{game.title}</span>
          <span>{votes_count.toLocaleString("uk-UA")}</span>
        </div>
        <div className="bar">
          <div className="bar-fill" style={{ width: `${(votes_count / maxVotes) * 100}%` }} />
        </div>
      </div>
    </Link>
  </li>
);
}

export default function HeroCard() {
  const [collection, setCollection] = useState(null);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    const load = async () => {
      try {
        const [top] = await fetchJson("/collections/");
        if (!top) return setStatus("empty");
        setCollection(await fetchJson(`/collections/${top.id}/`));
        setStatus("ready");
      } catch {
        setStatus("error");
      }
    };
    load();
  }, []);

  if (status !== "ready") {
    const messages = {
      loading: "Завантаження...",
      empty: "Колекцій поки немає",
      error: "Не вдалося завантажити дані",
    };
    return (
      <div className="hero-card">
        <p className="card-state">{messages[status]}</p>
      </div>
    );
  }

  const games = collection.games.slice(0, TOP_GAMES);
  const maxVotes = Math.max(...games.map((item) => item.votes_count), 1);

  return (
    <div className="hero-card">
      <div className="card-head">
        <h2>{collection.title}</h2>
        <span className="genre-tag">{formatGenre(collection.genre)}</span>
      </div>
      <ul className="rank-list">
        {games.map((item, index) => (
          <GameRow key={item.game.id} item={item} rank={index + 1} maxVotes={maxVotes} />
        ))}
      </ul>
      <button className="btn vote-btn" type="button">Проголосувати</button>
    </div>
  );
}