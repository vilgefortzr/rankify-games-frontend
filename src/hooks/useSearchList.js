import { useCallback, useState } from "react";
import { useAsync } from "./useAsync.js";
import { useDebouncedValue } from "./useDebouncedValue.js";

export function useSearchList(fetchList, { requireQuery = false, initialQuery = "" } = {}) {
  const [query, setQuery] = useState(initialQuery);
  const term = useDebouncedValue(query.trim());

  const loader = useCallback(
    (signal) => (requireQuery && !term ? undefined : fetchList(term, signal)),
    [fetchList, term, requireQuery],
  );
  const result = useAsync(loader);
  const typing = query.trim() !== term;
  const status = typing ? "loading" : result.status;
  const stale = status === "loading" && Array.isArray(result.data) && result.data.length > 0;

  return { query, setQuery, term, ...result, status, stale };
}
