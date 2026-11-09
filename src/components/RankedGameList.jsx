import { Link } from "react-router-dom";
import { useVote } from "../hooks/useVote.js";
import { formatNumber } from "../lib/format.js";
import Cover from "./Cover.jsx";
import HoloSurface from "./HoloSurface.jsx";
import VoteButton from "./VoteButton.jsx";

export default function RankedGameList({ collection, limit, onChanged, renderActions, compact = false }) {
  const { votedId, pendingId, error, toggle } = useVote(collection.id);
  const items = limit ? collection.games.slice(0, limit) : collection.games;
  const maxVotes = Math.max(1, ...items.map((item) => item.votes_count));
  const leaderHasVotes = items[0]?.votes_count > 0;

  const handleVote = async (collectionGameId) => {
    if (pendingId != null) return;
    if (await toggle(collectionGameId)) onChanged?.();
  };

  return (
    <>
      {error && <p className="form-error">{error}</p>}
      <ol className={`binder-grid ${compact ? "binder-grid-compact" : ""}`}>
        {items.map((item, index) => {
          const { id, game, votes_count } = item;
          const voted = votedId === id;
          return (
            <li className="pocket" key={id}>
              <HoloSurface
                as="article"
                active={index === 0 && leaderHasVotes}
                className={`tcard ${voted ? "is-voted" : ""}`}
              >
                <div className="tcard-top">
                  <span className="tcard-rank">
                    {index + 1}
                  </span>
                  <span className="tcard-votes">
                    <b className="tcard-count num">{formatNumber(votes_count)}</b>{" "}
                    {votes_count === 1 ? "vote" : "votes"}
                  </span>
                </div>
                <Link className="tcard-art-link" to={`/games/${game.steam_id}`} tabIndex={-1}>
                  <Cover className="tcard-art" src={game.img_url} alt="" />
                </Link>
                <Link className="tcard-name" to={`/games/${game.steam_id}`}>
                  {game.title}
                </Link>
                <div
                  className="stat-bar"
                  style={{ "--share": `${(votes_count / maxVotes) * 100}%` }}
                >
                  <div className="stat-fill" />
                </div>
                <div className="tcard-actions">
                  <VoteButton
                    active={voted}
                    pending={pendingId === id}
                    onClick={() => handleVote(id)}
                  />
                  {renderActions?.(item)}
                </div>
              </HoloSurface>
            </li>
          );
        })}
      </ol>
    </>
  );
}
