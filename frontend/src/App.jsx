import { useState } from "react";
import { Link, Route, Routes } from "react-router-dom";
import Gallery from "./pages/Gallery";
import NewArtwork from "./pages/NewArtwork";
import ArtworkDetail from "./pages/ArtworkDetail";
import CuratorSidebar from "./components/CuratorSidebar";
import CursorFx from "./components/CursorFx";

function App() {
  // When the Curator "curates", it puts a set of artworks here; the Gallery
  // shows them instead of the full wall. null = show everything.
  const [curated, setCurated] = useState(null);

  return (
    <div className="app">
      <CursorFx />
      <header className="topbar">
        <Link to="/" className="brand" onClick={() => setCurated(null)}>RefNest</Link>
        <nav>
          <Link to="/new" className="btn">+ New Artwork</Link>
        </nav>
      </header>

      <div className="layout">
        <main className="content">
          <Routes>
            <Route path="/" element={<Gallery curated={curated} onShowAll={() => setCurated(null)} />} />
            <Route path="/new" element={<NewArtwork />} />
            <Route path="/artworks/:id" element={<ArtworkDetail />} />
          </Routes>
        </main>
        <CuratorSidebar onCurate={setCurated} />
      </div>
    </div>
  );
}

export default App;
