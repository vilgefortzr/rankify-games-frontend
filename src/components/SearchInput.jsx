export default function SearchInput({ value, onChange, onSubmit, submitLabel, placeholder, className = "" }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit?.(value.trim());
  };

  return (
    <form className={`search ${submitLabel ? "search-with-button" : ""} ${className}`} onSubmit={handleSubmit}>
      <input
        className="search-input"
        type="search"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {submitLabel && (
        <button className="btn btn-gold search-submit" type="submit">
          {submitLabel}
        </button>
      )}
    </form>
  );
}
