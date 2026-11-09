import { useState } from "react";
import { useNavigate } from "react-router-dom";
import FeaturedCollection from "../components/FeaturedCollection.jsx";
import SearchInput from "../components/SearchInput.jsx";

export default function Home() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  const handleSearch = (term) => {
    navigate(term ? `/collections?search=${encodeURIComponent(term)}` : "/collections");
  };

  return (
    <section className="hero">
      <title>RankifyGames</title>
      <div className="hero-text">
        <h1 className="hero-title">Which game in the series is the best?</h1>
        <p className="lead">
          Create game collections, add games from Steam and vote. One vote per
          collection, and the community picks the winner.
        </p>
        <SearchInput
          className="hero-search"
          value={query}
          onChange={setQuery}
          onSubmit={handleSearch}
          submitLabel="Search"
          placeholder="Find a collection, e.g. Witcher"
        />
      </div>

      <div className="hero-side">
        <FeaturedCollection />
      </div>
    </section>
  );
}
