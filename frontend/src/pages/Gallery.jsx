import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listArtworks, searchArtworks } from "../api/artworks";

function Gallery() {
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState(null); // null = not in search mode
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    listArtworks()
      .then(setArtworks)
      .catch(() => setLoadError(true))
      .finally(() => setLoading(false));
  }, []);

  const runSearch = async (e) => {
    e.preventDefault();
    const q = query.trim();
    if (!q) return clearSearch();
    setSearching(true);
    try {
      setResults(await searchArtworks(q));
    } catch {
      setLoadError(true);
    } finally {
      setSearching(false);
    }
  };

  const clearSearch = () => {
    setQuery("");
    setResults(null);
  };

  const shown = results !== null ? results : artworks;

  return (
    <>
      <header className="hero">
        <h1 className="hero-title">
          Ref<span className="amp">·</span>Nest
        </h1>
        <p className="hero-sub">The references worth keeping — a private museum of inspiration.</p>
        <div className="divider"><span className="lozenge" /></div>
        <svg className="wave" viewBox="0 0 1200 40" preserveAspectRatio="none" aria-hidden="true">
          <path
            d="M0,20 C150,0 300,40 450,20 C600,0 750,40 900,20 C1050,0 1150,30 1200,20"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          />
        </svg>
      </header>

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
          <button type="button" className="btn" onClick={clearSearch}>Clear</button>
        )}
      </form>

      {loadError && (
        <p className="notice">
          Couldn't reach the gallery. Is the backend running? (docker start refnest-db → runserver)
        </p>
      )}

      {results !== null && !loadError && (
        <p className="muted small" style={{ textAlign: "center", marginBottom: "1.5rem" }}>
          {shown.length} result{shown.length !== 1 ? "s" : ""} for “{query}”
        </p>
      )}

      {loading ? (
        <p className="muted">Loading the gallery…</p>
      ) : shown.length === 0 && !loadError ? (
        results !== null ? (
          <p className="muted" style={{ textAlign: "center" }}>Nothing matched. Try different words.</p>
        ) : (
          <div className="empty">
            <p className="muted">The gallery is empty.</p>
            <Link to="/new" className="btn primary">Add your first artwork</Link>
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
