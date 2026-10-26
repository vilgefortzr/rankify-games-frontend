import { useState } from "react";
import { fetchJson } from "../api.js";
import HeroCard from "./HeroCard.jsx";
import SearchResults from "./SearchResults.jsx";

export default function Hero() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [status, setStatus] = useState("idle");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const search = encodeURIComponent(query.trim());
      setResults(await fetchJson(`/collections/?search=${search}`));
      setStatus("ready");
    } catch {
      setStatus("error");
    }
  };

  return (
    <>
      <section className="hero">
        <div className="hero-text">
          <p className="eyebrow">Рейтинги ігор від спільноти</p>
          <h1>Яка гра в серії найкраща?</h1>
          <p className="lead">
            Створюйте колекції ігор, додавайте їх зі Steam і голосуйте.
            <br />
            Один голос у кожній колекції, а лідера визначає спільнота.
          </p>
          <form className="search" onSubmit={handleSubmit}>
            <input
              type="search"
              placeholder="Знайти колекцію, наприклад Witcher"
              aria-label="Пошук колекції"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button className="btn" type="submit">Знайти</button>
          </form>
        </div>
        <HeroCard />
      </section>
      <SearchResults status={status} results={results} />
    </>
  );
}