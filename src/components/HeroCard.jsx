import { useEffect, useState } from "react";

const API = "http://127.0.0.1:8000/api/v1";

const formatGenre = (genre) =>
  genre.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase());

export default function HeroCard() {
  const [collection, setCollection] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const listRes = await fetch(`${API}/collections/`);
        if (!listRes.ok) throw new Error();
        const list = await listRes.json();
        if (list.length === 0) return;

        const detailRes = await fetch(`${API}/collections/${list[0].id}/`);
        if (!detailRes.ok) throw new Error();
        setCollection(await detailRes.json());
      } catch {
        setError(true);
      }
    }
    load();
  }, []);

  if (error) {
    return <div className="hero-card"><p className="card-state">Не вдалося завантажити дані</p></div>;
  }
  if (!collection) {
    return <div className="hero-card"><p className="card-state">Завантаження...</p></div>;
  }

  const games = collection.games.slice(0, 3);
  const maxVotes = Math.max(...games.map((g) => g.votes_count), 1);

  return (
    <div className="hero-card">
      <div className="card-head">
        <h2>{collection.title}</h2>
        <span className="genre-tag">{formatGenre(collection.genre)}</span>
      </div>

      <ul className="rank-list">
        {games.map((item, index) => (
          <li className="rank-item" key={item.game.id}>
            <span className={index === 0 ? "rank-pos first" : "rank-pos"}>{index + 1}</span>
            {item.game.img_url ? (
              <img className="rank-img" src={item.game.img_url} alt="" />
            ) : (
              <div className="rank-img" />
            )}
            <div className="rank-info">
              <div className="rank-row">
                <span className="rank-title">{item.game.title}</span>
                <span className="rank-votes">{item.votes_count.toLocaleString("uk-UA")}</span>
              </div>
              <div className="bar">
                <div
                  className={index === 0 ? "bar-fill first" : "bar-fill"}
                  style={{ width: `${(item.votes_count / maxVotes) * 100}%` }}
                />
              </div>
            </div>
          </li>
        ))}
      </ul>

      <button className="btn vote-btn" type="button">Проголосувати</button>
    </div>
  );
}