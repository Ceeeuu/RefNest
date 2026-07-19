import { Link, Route, Routes } from "react-router-dom";
import Gallery from "./pages/Gallery";
import NewArtwork from "./pages/NewArtwork";
import ArtworkDetail from "./pages/ArtworkDetail";
import CuratorSidebar from "./components/CuratorSidebar";

function App() {
  return (
    <div className="app">
      <header className="topbar">
        <Link to="/" className="brand">RefNest</Link>
        <nav>
          <Link to="/new" className="btn">+ New Artwork</Link>
        </nav>
      </header>

      <div className="layout">
        <main className="content">
          <Routes>
            <Route path="/" element={<Gallery />} />
            <Route path="/new" element={<NewArtwork />} />
            <Route path="/artworks/:id" element={<ArtworkDetail />} />
          </Routes>
        </main>
        <CuratorSidebar />
      </div>
    </div>
  );
}

export default App;
