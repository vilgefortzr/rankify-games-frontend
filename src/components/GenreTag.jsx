import { formatGenre } from "../lib/genres.js";

export default function GenreTag({ genre, className = "" }) {
  return <span className={`genre-tag g-${genre} ${className}`}>{formatGenre(genre)}</span>;
}
