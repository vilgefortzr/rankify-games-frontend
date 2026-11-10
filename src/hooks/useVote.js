import { useState } from "react";
import { collectionsApi } from "../api/endpoints.js";

export function useVote(collectionId, votedId) {
  const [pendingId, setPendingId] = useState(null);
  const [error, setError] = useState("");

  const toggle = async (collectionGameId) => {
    setPendingId(collectionGameId);
    setError("");
    try {
      if (votedId != null) await collectionsApi.unvote(collectionId, votedId);
      if (votedId !== collectionGameId) await collectionsApi.vote(collectionId, collectionGameId);
      return true;
    } catch (e) {
      setError(e.message);
      return false;
    } finally {
      setPendingId(null);
    }
  };

  return { pendingId, error, toggle };
}
