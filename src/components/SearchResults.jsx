import { useEffect, useRef } from "react";
import { formatGenre } from "./HeroCard";

const messages = {
  loading: "Пошук...",
  error: "Не вдалося виконати пошук",
  empty: "Нічого не знайдено",
};

export default function SearchResults({ status, results }) {
  const ref = useRef(null);

  useEffect(() => {
    if (status !== "idle") ref.current?.scrollIntoView({ behavior: "smooth" });
  }, [status]);

  if (status === "idle") return null;

  const message = status === "ready" && results.length === 0 ? messages.empty : messages[status];

  return (
    <section className="results" ref={ref}>
      {message ? (
        <p className="card-state">{message}</p>
      ) : (
        <ul className="results-list">
          {results.map((collection) => (
            <li className="result-card" key={collection.id}>
              <div className="result-head">
                <h3>{collection.title}</h3>
                <span className="genre-tag">{formatGenre(collection.genre)}</span>
              </div>
              <p className="result-meta">
                {collection.games_count} ігор · {collection.total_votes} голосів
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}