import { useEffect, useState } from "react";
import { fetchJson } from "../api.js";
import CollectionCard from "../components/CollectionCard.jsx";

const messages = {
  loading: "Завантаження...",
  error: "Не вдалося завантажити колекції",
  empty: "Колекцій поки немає",
};

export default function Collections() {
  const [collections, setCollections] = useState([]);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchJson("/collections/");
        setCollections(data);
        setStatus(data.length ? "ready" : "empty");
      } catch {
        setStatus("error");
      }
    };
    load();
  }, []);

  return (
    <section className="page">
      <h1 className="page-title">Колекції</h1>
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