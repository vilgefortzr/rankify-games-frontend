const DEFAULT_MESSAGES = {
  loading: "Loading…",
  empty: "Nothing found",
  notFound: "Not found",
  error: "Failed to load data",
};

export default function StateMessage({ status, error, messages = {} }) {
  if (status === "ready" || status === "idle") return null;
  const text = messages[status] ?? DEFAULT_MESSAGES[status];
  const detail = status === "error" && error?.message;

  return (
    <div className={`state state-${status}`}>
      <p className="state-text">{text}</p>
      {detail && detail !== text && <p className="state-detail">{detail}</p>}
    </div>
  );
}
