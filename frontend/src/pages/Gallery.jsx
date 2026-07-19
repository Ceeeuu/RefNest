import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listArtworks, searchArtworks } from "../api/artworks";

function Gallery() {
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState(null); // null = not in search mode
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    listArtworks()
      .then(setArtworks)
      .finally(() => setLoading(false));
  }, []);

  const runSearch = async (e) => {
    e.preventDefault();
    const q = query.trim();
    if (!q) return clearSearch();
    setSearching(true);
    try {
      setResults(await searchArtworks(q));
    } finally {
      setSearching(false);
    }
  };

  const clearSearch = () => {
    setQuery("");
    setResults(null);
  };

  if (loading) return <p className="muted">Loading the gallery…</p>;

  const shown = results !== null ? results : artworks;

  return (
    <>
      <form className="search" onSubmit={runSearch}>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask the collection… e.g. 水彩畫風、可愛美少女"
        />
        <button type="submit" className="btn" disabled={searching}>
          {searching ? "Searching…" : "Search"}
        </button>
        {results !== null && (
          <button type="button" className="btn" onClick={clearSearch}>
            Clear
          </button>
        )}
      </form>

      {results !== null && (
        <p className="muted small">
          {shown.length} result{shown.length !== 1 ? "s" : ""} for “{query}”
        </p>
      )}

      {shown.length === 0 ? (
        results !== null ? (
          <p className="muted">Nothing matched. Try different words.</p>
        ) : (
          <div className="empty">
            <p className="muted">The gallery is empty.</p>
            <Link to="/new" className="btn">Add your first artwork</Link>
          </div>
        )
      ) : (
        <section className="gallery-wall">
          {shown.map((art) => (
            <Link key={art.id} to={`/artworks/${art.id}`} className="frame">
              <img src={art.image} alt={art.artist || "artwork"} />
              <div className="frame-caption">
                <span>{art.artist || "Unknown"}</span>
                <span className="muted">{art.platform}</span>
              </div>
            </Link>
          ))}
        </section>
      )}
    </>
  );
}

export default Gallery;
