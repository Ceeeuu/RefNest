import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listArtworks } from "../api/artworks";

function Gallery() {
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listArtworks()
      .then(setArtworks)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="muted">Loading the gallery…</p>;

  if (artworks.length === 0) {
    return (
      <div className="empty">
        <p className="muted">The gallery is empty.</p>
        <Link to="/new" className="btn">Add your first artwork</Link>
      </div>
    );
  }

  return (
    <section className="gallery-wall">
      {artworks.map((art) => (
        <Link key={art.id} to={`/artworks/${art.id}`} className="frame">
          <img src={art.image} alt={art.artist || "artwork"} />
          <div className="frame-caption">
            <span>{art.artist || "Unknown"}</span>
            <span className="muted">{art.platform}</span>
          </div>
        </Link>
      ))}
    </section>
  );
}

export default Gallery;
