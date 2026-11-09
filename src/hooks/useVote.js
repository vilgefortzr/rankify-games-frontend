import { useState } from "react";
import { collectionsApi } from "../api/endpoints.js";

const STORAGE_KEY = "rankify:votes";

const readVotes = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? {};
  } catch {
    return {};
  }
};

const writeVotes = (votes) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(votes));
    return true;
  } catch {
    return false;
  }
};

export function useVote(collectionId) {
  const key = String(collectionId);
  const [votes, setVotes] = useState(readVotes);
  const [pendingId, setPendingId] = useState(null);
  const [error, setError] = useState("");
  const votedId = votes[key] ?? null;

  const save = (value) => {
    const next = { ...readVotes() };
    if (value == null) delete next[key];
    else next[key] = value;
    writeVotes(next);
    setVotes(next);
  };

  const toggle = async (collectionGameId) => {
    setPendingId(collectionGameId);
    setError("");
    try {
      if (votedId != null) {
        await collectionsApi.unvote(collectionId, votedId).catch((e) => {
          if (e.status !== 404) throw e;
        });
        save(null);
      }
      if (votedId !== collectionGameId) {
        await collectionsApi.vote(collectionId, collectionGameId);
        save(collectionGameId);
      }
      return true;
    } catch (e) {
      setError(e.message);
      return false;
    } finally {
      setPendingId(null);
    }
  };

  return { votedId, pendingId, error, toggle };
}
