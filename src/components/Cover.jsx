export default function Cover({ src, alt = "", className = "" }) {
  if (!src) return <div className={`cover cover-empty ${className}`} />;
  return <img className={`cover ${className}`} src={src} alt={alt} loading="lazy" />;
}
