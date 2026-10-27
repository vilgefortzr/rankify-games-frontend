export default function GameCard({ game }) {
  const { title, img_url } = game;

  return (
    <li className="collection-card">
      <div className="collection-img-wrap">
        {img_url ? (
          <img className="collection-img" src={img_url} alt={title} />
        ) : (
          <div className="collection-img" />
        )}
        <div className="collection-body">
          <h3 className="game-title">{title}</h3>
        </div>
      </div>
    </li>
  );
}