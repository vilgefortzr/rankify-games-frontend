import { useEffect, useState } from "react";

const SEARCH_DELAY = 400;

export function useDebouncedValue(value, delay = SEARCH_DELAY) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}
