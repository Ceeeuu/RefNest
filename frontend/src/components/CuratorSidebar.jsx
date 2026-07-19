import { useState } from "react";
import { askCurator } from "../api/artworks";

function CuratorSidebar({ onCurate }) {
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const [reply, setReply] = useState(null);
  const [artworks, setArtworks] = useState([]);
  const [chibi, setChibi] = useState(false); // which look; click the figure to flip

  const send = async (e) => {
    e.preventDefault();
    const message = input.trim();
    if (!message || thinking) return;
    setInput("");
    setReply(null);
    setArtworks([]);
    setThinking(true);
    try {
      const res = await askCurator(message);
      if (res.error) {
        setReply("I can't reach the archives right now.");
      } else {
        setReply(res.reply);
        setArtworks(res.artworks || []);
      }
    } catch {
      setReply("Something went wrong.");
    } finally {
      setThinking(false);
    }
  };

  const showThese = () => {
    onCurate(artworks);
    setReply(null);
    setArtworks([]);
  };

  const bubbleOpen = thinking || reply !== null;

  return (
    <aside className="curator">
      <div className="curator-stage">
        <div
          className="curator-flip"
          data-flipped={chibi}
          onClick={() => setChibi((c) => !c)}
          title="Tap to switch her look"
        >
          <div className="flip-inner">
            <img className="flip-face front" src="/curator.png" alt="The Curator" />
            <img className="flip-face back" src="/curator-chibi.png" alt="The Curator (chibi)" />
          </div>
        </div>
        <div className="curator-nameplate">
          <h3>The Curator</h3>
          <p className="muted small">Keeper of your collection</p>
        </div>

        {bubbleOpen && (
          <div className="curator-bubble">
            {thinking ? (
              <p className="muted">The Curator is looking…</p>
            ) : (
              <>
                <p>{reply}</p>
                {artworks.length > 0 && (
                  <button className="btn primary bubble-cta" onClick={showThese}>
                    Show these {artworks.length} in the gallery →
                  </button>
                )}
              </>
            )}
          </div>
        )}
      </div>

      <form className="curator-input" onSubmit={send}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask the Curator…"
        />
        <button type="submit" className="btn primary" disabled={thinking}>Ask</button>
      </form>
    </aside>
  );
}

export default CuratorSidebar;
