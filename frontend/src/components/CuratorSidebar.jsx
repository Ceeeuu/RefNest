import { useState } from "react";
import { Link } from "react-router-dom";
import { askCurator } from "../api/artworks";

function CuratorSidebar() {
  const [messages, setMessages] = useState([
    {
      role: "curator",
      text: "Welcome to your museum. Ask me to find a piece — by mood, subject, or style.",
      artworks: [],
    },
  ]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);

  const send = async (e) => {
    e.preventDefault();
    const message = input.trim();
    if (!message || thinking) return;
    setMessages((m) => [...m, { role: "visitor", text: message }]);
    setInput("");
    setThinking(true);
    try {
      const res = await askCurator(message);
      setMessages((m) => [
        ...m,
        res.error
          ? { role: "curator", text: "I can't reach the archives right now.", artworks: [] }
          : { role: "curator", text: res.reply, artworks: res.artworks || [] },
      ]);
    } catch {
      setMessages((m) => [...m, { role: "curator", text: "Something went wrong.", artworks: [] }]);
    } finally {
      setThinking(false);
    }
  };

  return (
    <aside className="curator">
      <div className="curator-portrait">
        <img src="/curator.png" alt="The Curator" />
        <div>
          <h3>The Curator</h3>
          <p className="muted small">Keeper of your collection</p>
        </div>
      </div>

      <div className="curator-log">
        {messages.map((m, i) => (
          <div key={i} className={`bubble ${m.role}`}>
            <p>{m.text}</p>
            {m.artworks?.length > 0 && (
              <div className="bubble-thumbs">
                {m.artworks.map((a) => (
                  <Link key={a.id} to={`/artworks/${a.id}`} title={a.artist}>
                    <img src={a.image} alt={a.artist || "artwork"} />
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
        {thinking && <p className="muted small">The Curator is looking…</p>}
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
