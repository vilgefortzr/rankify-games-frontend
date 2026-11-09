import { useCallback } from "react";
import { Link, useParams } from "react-router-dom";
import { gamesApi } from "../api/endpoints.js";
import BackLink from "../components/BackLink.jsx";
import Cover from "../components/Cover.jsx";
import GenreTag from "../components/GenreTag.jsx";
import ScreenshotGallery from "../components/ScreenshotGallery.jsx";
import StateMessage from "../components/StateMessage.jsx";
import { useAsync } from "../hooks/useAsync.js";

function Facts({ steam }) {
  const facts = [
    ["Release date", steam.coming_soon ? `Coming soon · ${steam.release_date ?? ""}` : steam.release_date],
    ["Developer", steam.developers.join(", ")],
    ["Publisher", steam.publishers.join(", ")],
    ["Steam genres", steam.genres.join(", ")],
    ["Metacritic", steam.metacritic_score],
  ].filter(([, value]) => value);

  if (!facts.length) return null;
  return (
    <dl className="facts">
      {facts.map(([label, value]) => (
        <div className="fact" key={label}>
          <dt>{label}</dt>
          <dd>{value}</dd>
        </div>
      ))}
    </dl>
  );
}

export default function GameDetail() {
  const { steamId } = useParams();
  const loader = useCallback((signal) => gamesApi.get(steamId, signal), [steamId]);
  const { status, data: game, error } = useAsync(loader);

  if (status !== "ready") {
    return (
      <section className="page">
        <title>Game · RankifyGames</title>
        <BackLink to="/games">All games</BackLink>
        <StateMessage
          status={status}
          error={error}
          messages={{ notFound: "Game not found", error: "Failed to load game" }}
        />
      </section>
    );
  }

  const { title, img_url, steam, game_collections } = game;

  return (
    <article className="page">
      <title>{`${title} · RankifyGames`}</title>
      <BackLink to="/games">All games</BackLink>

      <div className="game-layout">
        <div className="tcard tcard-feature">
          <Cover className="tcard-art" src={img_url} alt={title} />
          <h1 className="tcard-name">{title}</h1>
          {steam ? <Facts steam={steam} /> : <p className="state-text">Steam data is currently unavailable.</p>}
        </div>

        <div className="game-side">
          {steam?.short_description && <p className="lead">{steam.short_description}</p>}
          {steam && (
            <a className="btn btn-gold" href={steam.store_url} target="_blank" rel="noreferrer">
              Open in Steam
            </a>
          )}

          <section>
            <h2 className="section-title">
              Collections with this game
            </h2>
            {game_collections.length ? (
              <ul className="link-list">
                {game_collections.map(({ id, title: collectionTitle, genre }) => (
                  <li key={id}>
                    <Link className={`link-list-item g-${genre}`} to={`/collections/${id}`}>
                      <span>{collectionTitle}</span>
                      <GenreTag genre={genre} />
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="state-text">This game is not in any collection yet.</p>
            )}
          </section>
        </div>
      </div>

      {steam?.screenshots?.length > 0 && (
        <section className="section">
          <h2 className="section-title">
            Screenshots
          </h2>
          <ScreenshotGallery screenshots={steam.screenshots} title={title} />
        </section>
      )}
    </article>
  );
}
