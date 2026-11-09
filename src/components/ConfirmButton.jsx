import { useState } from "react";

export default function ConfirmButton({
  children,
  confirmLabel = "Yes, delete",
  pendingLabel = "Deleting…",
  onConfirm,
}) {
  const [asking, setAsking] = useState(false);
  const [pending, setPending] = useState(false);

  const confirm = async () => {
    setPending(true);
    const ok = await onConfirm();
    if (ok === false) {
      setPending(false);
      setAsking(false);
    }
  };

  if (!asking) {
    return (
      <button className="btn btn-danger-ghost" type="button" onClick={() => setAsking(true)}>
        {children}
      </button>
    );
  }

  return (
    <span className="confirm">
      <button className="btn btn-danger" type="button" onClick={confirm} disabled={pending}>
        {pending ? pendingLabel : confirmLabel}
      </button>
      <button
        className="btn btn-ghost"
        type="button"
        autoFocus
        onClick={() => setAsking(false)}
        disabled={pending}
      >
        Cancel
      </button>
    </span>
  );
}
