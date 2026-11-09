import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <section className="page page-narrow">
      <h1 className="page-title">Page not found</h1>
      <p className="page-subtitle">The link may be outdated.</p>
      <Link className="btn btn-gold" to="/">
        Go to home page
      </Link>
    </section>
  );
}
