import { useState } from "react";
import HeroCard from "./HeroCard.jsx";

export default function Hero() {
  const [query, setQuery] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("search:", query);
  };

  return (
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
  );
}