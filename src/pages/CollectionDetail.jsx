import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { deleteRequest, fetchJson, patchJson, postJson } from "../api.js";
import { formatGenre, GENRES } from "../utils.js";
import GameSearch from "../components/GameSearch.jsx";

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

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ title: "", genre: "other", description: "" });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const startEditing = () => {
    setForm({
      title: collection.title,
      genre: collection.genre,
      description: collection.description,
    });
    setErrors({});
    setEditing(true);
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = async (e) => {
  e.preventDefault();
  setSaving(true);
  setErrors({});
  try {
    const updated = await patchJson(`/collections/${id}/`, form);
    setCollection(await fetchJson(`/collections/${id}/`));
    setEditing(false);
  } catch (error) {
    setErrors(error.details ?? { form: [error.error ?? "Не вдалося зберегти зміни"] });
  }
  setSaving(false);
};

  const handleVote = async (collection_game_id) => {
  setGameError("");
  try {
    await postJson(`/collections/${id}/votes/${collection_game_id}`, { collection_game: collection_game_id });
    await reload();
  } catch (error) {
    setGameError(error.error ?? "Не вдалося проголосувати");
  }
};

  const [gameError, setGameError] = useState(""); 

  if (status !== "ready") {
    return (
      <section className="page">
        <p className="card-state">{messages[status]}</p>
      </section>
    );
  }

  const reload = async () => setCollection(await fetchJson(`/collections/${id}/`));

const handleRemoveGame = async (steamId) => {
  if (!window.confirm("Видалити гру з колекції разом з її голосами?")) return;
  setGameError("");
  try {
    await deleteRequest(`/collections/${id}/games/${steamId}/`);
    await reload();
  } catch (error) {
    setGameError(error.error ?? "Не вдалося видалити гру");
  }
};

  const { title, genre, description, created_at, games } = collection;
  const maxVotes = Math.max(...games.map((item) => item.votes_count), 1);
  const createdDate = new Date(created_at).toLocaleDateString("uk-UA");

  return (
    <section className="page">
      <Link className="back-link" to="/collections">← Усі колекції</Link>

      {editing ? (
  <form className="form detail-form" onSubmit={handleSave}>
    <label className="field">
      Назва
      <input name="title" value={form.title} onChange={handleChange} maxLength={100} required />
      {errors.title && <span className="field-error">{errors.title[0]}</span>}
    </label>
    <label className="field">
      Жанр
      <select name="genre" value={form.genre} onChange={handleChange}>
        {GENRES.map(([value, label]) => (
          <option key={value} value={value}>{label}</option>
        ))}
      </select>
      {errors.genre && <span className="field-error">{errors.genre[0]}</span>}
    </label>
    <label className="field">
      Опис
      <textarea name="description" value={form.description} onChange={handleChange} rows={4} />
    </label>
    {errors.form && <p className="field-error">{errors.form[0]}</p>}
    <div className="form-actions">
      <button className="btn" type="submit" disabled={saving}>
        {saving ? "Збереження..." : "Зберегти"}
      </button>
      <button className="btn btn-ghost" type="button" onClick={() => setEditing(false)} disabled={saving}>
        Скасувати
      </button>
    </div>
  </form>
) : (
  <div className="detail-head">
    <h1 className="page-title">{title}</h1>
    <div className="detail-meta">
      <span className="genre-tag">{formatGenre(genre)}</span>
      <span className="detail-date">Створено {createdDate}</span>
    </div>
    <p className="detail-desc">{description || "Без опису"}</p>
    <button className="btn btn-ghost" type="button" onClick={startEditing}>Редагувати</button>
  </div>
)}
  <GameSearch
  collectionId={id}
  addedIds={games.map(({ game }) => game.steam_id)}
  onAdded={reload}
  />
  {gameError && <p className="field-error">{gameError}</p>}

      {games.length === 0 ? (
        <p className="card-state">У цій колекції ще немає ігор</p>
      ) : (
        <ol className="game-grid">
          {games.map(({ id, game, votes_count }, index) => (
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
                <Link to={`/games/${game.steam_id}`}>
                  <h3 className="game-card-title">{game.title}</h3>
                </Link>
                <div className="bar">
                  <div className="bar-fill" style={{ width: `${(votes_count / maxVotes) * 100}%` }} />
                </div>
                <button className="btn vote-btn" type="button" onClick={() => handleVote(id)}>Проголосувати</button>
                <button className="btn btn-ghost remove-btn" type="button" onClick={() => handleRemoveGame(game.steam_id)}>
                  Видалити з колекції
                </button>
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