import { useEffect, useState } from "react";
import { fetchJson } from "../api.js";
import HeroCard from "./HeroCard.jsx";
import SearchResults from "./SearchResults.jsx";

const SEARCH_DELAY = 400;

export default function Hero() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [searchStatus, setSearchStatus] = useState("idle");

  useEffect(() => {
    const search = query.trim();
    if (!search) {
      setSearchStatus("idle");
      return;
    }

    setSearchStatus("loading");
    const timer = setTimeout(async () => {
      try {
        setResults(await fetchJson(`/collections/?search=${encodeURIComponent(search)}`));
        setSearchStatus("ready");
      } catch {
        setSearchStatus("error");
      }
    }, SEARCH_DELAY);

    return () => clearTimeout(timer);
  }, [query]);

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
          <form className="search" onSubmit={(e) => e.preventDefault()}>
            <input
              type="search"
              placeholder="Знайти колекцію, наприклад Witcher"
              aria-label="Пошук колекції"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </form>
        </div>
        <HeroCard />
      </section>
      <SearchResults status={searchStatus} results={results} />
    </>
  );
}