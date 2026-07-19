import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { deleteArtwork, getArtwork } from "../api/artworks";

function ArtworkDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [art, setArt] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getArtwork(id)
      .then(setArt)
      .catch(() => setError("Artwork not found."));
  }, [id]);

  const remove = async () => {
    if (!window.confirm("Remove this artwork from your collection?")) return;
    await deleteArtwork(id);
    navigate("/");
  };

  if (error) return <p className="error">{error}</p>;
  if (!art) return <p className="muted">Loading…</p>;

  return (
    <article className="detail">
      <div className="detail-image">
        <img src={art.image} alt={art.artist || "artwork"} />
      </div>

      <aside className="detail-info">
        <h1>{art.artist || "Unknown artist"}</h1>
        <p className="muted">{art.platform}</p>

        {art.note && <p className="note">{art.note}</p>}

        {art.tags?.length > 0 && (
          <div className="tags">
            {art.tags.map((t) => (
              <span key={t} className="tag">{t}</span>
            ))}
          </div>
        )}

        {art.source_url && (
          <p>
            <a href={art.source_url} target="_blank" rel="noreferrer">
              View original source ↗
            </a>
          </p>
        )}

        <p className="muted small">
          Saved {new Date(art.created_at).toLocaleDateString()}
        </p>

        <button className="btn danger" onClick={remove}>Delete</button>
      </aside>
    </article>
  );
}

export default ArtworkDetail;
