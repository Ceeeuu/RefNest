import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { listArtworks } from "../api/artworks";

function Gallery({ curated, onShowAll }) {
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const wavesRef = useRef(null);

  useEffect(() => {
    listArtworks()
      .then(setArtworks)
      .catch(() => setLoadError(true))
      .finally(() => setLoading(false));
  }, []);

  // Mouse parallax: write cursor position (-0.5..0.5) into CSS vars on the waves.
  useEffect(() => {
    const onMove = (e) => {
      const el = wavesRef.current;
      if (!el) return;
      el.style.setProperty("--mx", (e.clientX / window.innerWidth - 0.5).toFixed(3));
      el.style.setProperty("--my", (e.clientY / window.innerHeight - 0.5).toFixed(3));
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  const curating = curated !== null;
  const shown = curating ? curated : artworks;

  return (
    <>
      <header className="hero">
        <h1 className="hero-title">
          Ref<span className="amp">·</span>Nest
        </h1>
        <p className="hero-sub">The references worth keeping — a private museum of inspiration.</p>
        <div className="divider">
          <span className="lozenge sm" />
          <span className="lozenge" />
          <span className="lozenge sm" />
        </div>
        <div className="waves" ref={wavesRef}>
          {/* viewBox is two identical periods so the -50% flow translate loops seamlessly */}
          <div className="wave-layer layer-1">
            <svg className="wave wave-1" viewBox="0 0 2400 46" preserveAspectRatio="none" aria-hidden="true">
              <path
                d="M0,23 C100,6 200,6 300,23 C400,40 500,40 600,23 C700,6 800,6 900,23 C1000,40 1100,40 1200,23 C1300,6 1400,6 1500,23 C1600,40 1700,40 1800,23 C1900,6 2000,6 2100,23 C2200,40 2300,40 2400,23"
                fill="none" stroke="currentColor" strokeWidth="2"
              />
            </svg>
          </div>
          <div className="wave-layer layer-2">
            <svg className="wave wave-2" viewBox="0 0 2400 46" preserveAspectRatio="none" aria-hidden="true">
              <path
                d="M0,23 C100,40 200,40 300,23 C400,6 500,6 600,23 C700,40 800,40 900,23 C1000,6 1100,6 1200,23 C1300,40 1400,40 1500,23 C1600,6 1700,6 1800,23 C1900,40 2000,40 2100,23 C2200,6 2300,6 2400,23"
                fill="none" stroke="currentColor" strokeWidth="2"
              />
            </svg>
          </div>
        </div>
      </header>

      {curating && (
        <div className="curated-banner">
          <span>The Curator picked {shown.length} piece{shown.length !== 1 ? "s" : ""} for you.</span>
          <button className="btn" onClick={onShowAll}>Show all</button>
        </div>
      )}

      {loadError && (
        <p className="notice">
          Couldn't reach the gallery. Is the backend running? (docker start refnest-db → runserver)
        </p>
      )}

      {loading && !curating ? (
        <p className="muted">Loading the gallery…</p>
      ) : shown.length === 0 && !loadError ? (
        <div className="empty">
          <p className="muted">The gallery is empty.</p>
          <Link to="/new" className="btn primary">Add your first artwork</Link>
        </div>
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
