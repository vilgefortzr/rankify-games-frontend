import { useEffect, useState } from "react";
import { fetchJson } from "../api.js";
import CollectionCard from "../components/CollectionCard.jsx";

const SEARCH_DELAY = 400;

const messages = {
  loading: "Завантаження...",
  error: "Не вдалося завантажити колекції",
  empty: "Нічого не знайдено",
};

export default function Collections() {
  const [query, setQuery] = useState("");
  const [collections, setCollections] = useState([]);
  const [status, setStatus] = useState("loading");

 useEffect(() => {
  const delay = query ? SEARCH_DELAY : 0;
  const timer = setTimeout(async () => {
    try {
      const search = encodeURIComponent(query.trim());
      const data = await fetchJson(`/collections/?search=${search}`);
      setCollections(data);
      setStatus(data.length ? "ready" : "empty");
    } catch {
      setStatus("error");
    }
  }, delay);

  return () => clearTimeout(timer);
}, [query]);

  return (
    <section className="page">
      <div className="page-head">
        <h1 className="page-title">Колекції</h1>
        <input
          className="page-search"
          type="search"
          placeholder="Знайти колекцію"
          aria-label="Пошук колекції"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      {status === "ready" ? (
        <ul className="collection-grid">
          {collections.map((collection) => (
            <CollectionCard key={collection.id} collection={collection} />
          ))}
        </ul>
      ) : (
        <p className="card-state">{messages[status]}</p>
      )}
    </section>
  );
}