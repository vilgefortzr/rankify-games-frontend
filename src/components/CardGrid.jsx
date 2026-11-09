export default function CardGrid({ items, render, getKey = (item) => item.id }) {
  return (
    <ul className="card-grid">
      {items.map((item) => (
        <li key={getKey(item)}>{render(item)}</li>
      ))}
    </ul>
  );
}
