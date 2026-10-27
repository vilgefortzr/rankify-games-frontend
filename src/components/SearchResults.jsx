import CollectionCard from "./CollectionCard.jsx";

const messages = {
  loading: "Пошук...",
  error: "Не вдалося виконати пошук",
  empty: "Нічого не знайдено",
};

export default function SearchResults({ status, results }) {
  if (status === "idle") return null;

  const message = status === "ready" && results.length === 0 ? messages.empty : messages[status];

  return (
    <section className="results">
      {message ? (
        <p className="card-state">{message}</p>
      ) : (
        <ul className="collection-grid">
          {results.map((collection) => (
            <CollectionCard key={collection.id} collection={collection} />
          ))}
        </ul>
      )}
    </section>
  );
}