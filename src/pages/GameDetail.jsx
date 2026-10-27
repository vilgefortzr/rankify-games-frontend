import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchJson } from "../api.js";
import { formatGenre } from "../utils.js";

const messages = {
  loading: "Завантаження...",
  error: "Не вдалося завантажити гру",
  notFound: "Гру не знайдено",
};

const formatPrice = ({ is_free, price }) => {
  if (is_free) return "Безкоштовно";
  return price ?? "Ціна недоступна";
};

export default function GameDetail() {
  const { steamId } = useParams();
  const [game, setGame] = useState(null);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    const load = async () => {
      setStatus("loading");
      try {
        setGame(await fetchJson(`/games/${steamId}/`));
        setStatus("ready");
      } catch (error) {
        setStatus(error.status === 404 ? "notFound" : "error");
      }
    };
    load();
  }, [steamId]);

  if (status !== "ready") {
    return (
      <section className="page">
        <p className="card-state">{messages[status]}</p>
      </section>
    );
  }

  const { steam, title, img_url, game_collections } = game;
  const image = steam?.header_image ?? img_url;

  return (
    <>
      <div className="game-hero">
        <div className="game-hero-bg" style={{ backgroundImage: `url(${image})` }} />
        <img className="game-hero-img" src={image} alt={title} />
      </div>
      <section className="page">
        <Link className="back-link" to="/games">← Усі ігри</Link>

        <h1 className="page-title">{steam?.name ?? title}</h1>
        {steam && (
          <div className="game-info">
            <p className="detail-desc game-desc">{steam.short_description}</p>
            <div className="game-buy">
              <span className="game-price">{formatPrice(steam)}</span>
              {steam.discount_percent > 0 && (
                <span className="genre-tag">-{steam.discount_percent}%</span>
              )}
              <a className="btn" href={steam.store_url} target="_blank" rel="noreferrer">
                Відкрити в Steam
              </a>
            </div>
          </div>
        )}

        <h2 className="section-title">Колекції з цією грою</h2>
        <ul className="game-collections">
          {game_collections.map(({ id, title, genre }) => (
            <li key={id}>
              <Link className="game-collection-link" to={`/collections/${id}`}>
                <span className="game-collection-title">{title}</span>
                <span className="genre-tag">{formatGenre(genre)}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}