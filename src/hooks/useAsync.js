import { useCallback, useEffect, useState } from "react";
import { isAbortError } from "../api/client.js";

const statusOf = (data) => (Array.isArray(data) && data.length === 0 ? "empty" : "ready");

export function useAsync(loader) {
  const [version, setVersion] = useState(0);
  const [state, setState] = useState({ loader: null, status: "loading", data: null, error: null });

  useEffect(() => {
    const controller = new AbortController();
    Promise.resolve(loader(controller.signal)).then(
      (data) => {
        const status = data === undefined ? "idle" : statusOf(data);
        setState({ loader, status, data: data ?? null, error: null });
      },
      (error) => {
        if (isAbortError(error)) return;
        const status = error?.status === 404 ? "notFound" : "error";
        setState({ loader, status, data: null, error });
      },
    );
    return () => controller.abort();
  }, [loader, version]);

  const reload = useCallback(() => setVersion((v) => v + 1), []);

  if (state.loader !== loader) return { status: "loading", data: state.data, error: null, reload };
  return { ...state, reload };
}
