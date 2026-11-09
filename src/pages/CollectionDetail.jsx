import { useCallback, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { collectionsApi } from "../api/endpoints.js";
import BackLink from "../components/BackLink.jsx";
import CollectionForm from "../components/CollectionForm.jsx";
import ConfirmButton from "../components/ConfirmButton.jsx";
import GenreTag from "../components/GenreTag.jsx";
import RankedGameList from "../components/RankedGameList.jsx";
import StateMessage from "../components/StateMessage.jsx";
import SteamGameSearch from "../components/SteamGameSearch.jsx";
import { useAsync } from "../hooks/useAsync.js";
import { formatDate, gamesCount, votesCount } from "../lib/format.js";

export default function CollectionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [actionError, setActionError] = useState("");

  const loader = useCallback((signal) => collectionsApi.get(id, signal), [id]);
  const { status, data: collection, error, reload } = useAsync(loader);

  if (status !== "ready") {
    return (
      <section className="page">
        <BackLink to="/collections">All collections</BackLink>
        <StateMessage
          status={status}
          error={error}
          messages={{ notFound: "Collection not found", error: "Failed to load collection" }}
        />
      </section>
    );
  }

  const { title, genre, description, created_at, games } = collection;
  const totalVotes = games.reduce((sum, item) => sum + item.votes_count, 0);

  const handleSave = async (values) => {
    await collectionsApi.update(id, values);
    setEditing(false);
    reload();
  };

  const handleDelete = async () => {
    try {
      await collectionsApi.remove(id);
      navigate("/collections");
      return true;
    } catch (e) {
      setActionError(e.message);
      return false;
    }
  };

  const handleRemoveGame = async (steamId) => {
    setActionError("");
    try {
      await collectionsApi.removeGame(id, steamId);
      reload();
      return true;
    } catch (e) {
      setActionError(e.message);
      return false;
    }
  };

  return (
    <section className={`page g-${genre}`}>
      <title>{`${title} · RankifyGames`}</title>
      <BackLink to="/collections">All collections</BackLink>

      {editing ? (
        <div className="sheet page-narrow">
          <h1 className="sheet-title">Edit collection</h1>
          <CollectionForm
            initial={{ title, genre, description }}
            submitLabel="Save"
            pendingLabel="Saving…"
            onSubmit={handleSave}
            onCancel={() => setEditing(false)}
          />
        </div>
      ) : (
        <header className="collection-head">
          <div className="collection-band">
            <GenreTag genre={genre} className="genre-tag-on-band" />
            <span className="num">{gamesCount(games.length)}</span>
            <span className="num">{votesCount(totalVotes)}</span>
            <span className="collection-band-date">Created {formatDate(created_at)}</span>
          </div>
          <div className="collection-head-body">
            <h1 className="page-title">{title}</h1>
            <p className="lead">{description || "No description"}</p>
            <div className="detail-actions">
              <button className="btn btn-ghost" type="button" onClick={() => setEditing(true)}>
                Edit
              </button>
              <ConfirmButton confirmLabel="Confirm delete" onConfirm={handleDelete}>
                Delete collection
              </ConfirmButton>
            </div>
          </div>
        </header>
      )}

      {actionError && <p className="form-error">{actionError}</p>}

      <section className="binder">
        <h2 className="section-title">Ranking</h2>
        {games.length ? (
          <RankedGameList
            collection={collection}
            onChanged={reload}
            renderActions={({ game }) => (
              <ConfirmButton
               
                confirmLabel="Remove"
                pendingLabel="Removing…"
                onConfirm={() => handleRemoveGame(game.steam_id)}
              >
                Remove
              </ConfirmButton>
            )}
          />
        ) : (
          <div className="pocket-empty">
            <p className="state-text">This collection has no games yet. Find some on Steam below.</p>
          </div>
        )}
      </section>

      <SteamGameSearch
        collectionId={id}
        addedSteamIds={games.map(({ game }) => game.steam_id)}
        onAdded={reload}
      />
    </section>
  );
}
