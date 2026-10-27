import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { deleteRequest, fetchJson } from "../api.js";
import { formatGenre } from "../utils.js";

const messages = {
  loading: "Завантаження...",
  error: "Не вдалося завантажити колекцію",
  notFound: "Колекцію не знайдено",
};

export default function CollectionDetail() {
  const { id } = useParams();
  const [collection, setCollection] = useState(null);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    const load = async () => {
      setStatus("loading");
      try {
        setCollection(await fetchJson(`/collections/${id}/`));
        setStatus("ready");
      } catch (error) {
        setStatus(error.message === "404" ? "notFound" : "error");
      }
    };
    load();
  }, [id]);

  const navigate = useNavigate();
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const handleDelete = async () => {
    setDeleting(true);
    setDeleteError("");
    try {
      await deleteRequest(`/collections/${id}/`);
      navigate("/collections");
    } catch (error) {
      setDeleteError(error.error ?? "Не вдалося видалити колекцію");
      setDeleting(false);
    }
  };

  if (status !== "ready") {
    return (
      <section className="page">
        <p className="card-state">{messages[status]}</p>
      </section>
    );
  }

  const { title, genre, description, created_at, games } = collection;
  const maxVotes = Math.max(...games.map((item) => item.votes_count), 1);
  const createdDate = new Date(created_at).toLocaleDateString("uk-UA");

  return (
    <section className="page">
      <Link className="back-link" to="/collections">← Усі колекції</Link>

      <div className="detail-head">
        <h1 className="page-title">{title}</h1>
        <div className="detail-meta">
          <span className="genre-tag">{formatGenre(genre)}</span>
          <span className="detail-date">{createdDate}</span>
        </div>
        <p className="detail-desc">{description || "Без опису"}</p>
      </div>

      {games.length === 0 ? (
        <p className="card-state">У цій колекції ще немає ігор</p>
      ) : (
        <ol className="game-grid">
          {games.map(({ game, votes_count }, index) => (
            <li className="game-card" key={game.id}>
              {game.img_url ? (
                <img className="game-card-img" src={game.img_url} alt={game.title} />
              ) : (
                <div className="game-card-img" />
              )}
              <div className="game-card-body">
                <div className="rank-row">
                  <span className="rank-pos">#{index + 1}</span>
                  <span>{votes_count.toLocaleString("uk-UA")} голосів</span>
                </div>
                <h3 className="game-card-title">{game.title}</h3>
                <div className="bar">
                  <div className="bar-fill" style={{ width: `${(votes_count / maxVotes) * 100}%` }} />
                </div>
                <button className="btn vote-btn" type="button">Проголосувати</button>
              </div>
            </li>
          ))}
        </ol>
      )}
    <div className="danger-zone">
    {confirming ? (
      <>
        <span>Ви впевнені?</span>
        <button className="btn btn-danger" type="button" onClick={handleDelete} disabled={deleting}>
          {deleting ? "Видалення..." : "Так, видалити"}
        </button>
        <button className="btn btn-ghost" type="button" onClick={() => setConfirming(false)} disabled={deleting}>
          Скасувати
        </button>
      </>
      ) : (
      <button className="btn btn-danger" type="button" onClick={() => setConfirming(true)}>
        Видалити колекцію
      </button>
      )}
      {deleteError && <p className="field-error">{deleteError}</p>}
    </div>
    </section>
  );
}