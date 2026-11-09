import { useState } from "react";
import { Link, NavLink } from "react-router-dom";

export default function Header() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  const handleKeyDown = (e) => {
    if (e.key === "Escape") close();
  };

  return (
    <header className="site-header">
      <nav className={`site-nav ${open ? "is-open" : ""}`} onKeyDown={handleKeyDown}>
        <Link to="/" className="logo" onClick={close}>
          Rankify<span className="logo-accent">Games</span>
        </Link>
        <button
          className="menu-toggle"
          type="button"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="menu-bars" />
        </button>
        <div className="site-menu">
          <ul className="nav-links">
            <li>
              <NavLink to="/collections" end onClick={close}>Collections</NavLink>
            </li>
            <li>
              <NavLink to="/games" onClick={close}>Games</NavLink>
            </li>
          </ul>
          <Link className="btn btn-gold" to="/collections/new" onClick={close}>
            Create collection
          </Link>
        </div>
      </nav>
    </header>
  );
}
