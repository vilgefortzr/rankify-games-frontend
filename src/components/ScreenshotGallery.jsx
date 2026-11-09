import { useEffect, useRef, useState } from "react";
import Cover from "./Cover.jsx";

export default function ScreenshotGallery({ screenshots, title }) {
  const [index, setIndex] = useState(null);
  const dialogRef = useRef(null);
  const open = index !== null;
  const count = screenshots.length;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  const step = (delta) => setIndex((i) => (i + delta + count) % count);

  const handleKeyDown = (e) => {
    if (e.key === "ArrowRight") step(1);
    if (e.key === "ArrowLeft") step(-1);
  };

  const handleClick = (e) => {
    if (e.target === e.currentTarget) setIndex(null);
  };

  const current = open ? screenshots[index] : null;

  return (
    <>
      <ul className="card-grid">
        {screenshots.map((shot, i) => (
          <li key={shot.full}>
            <button
              className="screenshot"
              type="button"
              onClick={() => setIndex(i)}
            >
              <Cover src={shot.thumbnail ?? shot.full} alt={`${title} screenshot`} />
            </button>
          </li>
        ))}
      </ul>

      <dialog
        ref={dialogRef}
        className="lightbox"
        onClose={() => setIndex(null)}
        onKeyDown={handleKeyDown}
        onClick={handleClick}
      >
        {current && (
          <div className="lightbox-body">
            <img className="lightbox-img" src={current.full} alt={`Screenshot ${index + 1} of ${count}, ${title}`} />
            <div className="lightbox-controls">
              <div className="lightbox-pager">
                <button className="btn lightbox-nav" type="button" onClick={() => step(-1)} disabled={count < 2}>
                  Previous
                </button>
                <span className="lightbox-counter">
                  {index + 1} / {count}
                </span>
                <button className="btn lightbox-nav" type="button" onClick={() => step(1)} disabled={count < 2}>
                  Next
                </button>
              </div>
              <button className="btn lightbox-nav lightbox-close" type="button" onClick={() => setIndex(null)} autoFocus>
                Close
              </button>
            </div>
          </div>
        )}
      </dialog>
    </>
  );
}
