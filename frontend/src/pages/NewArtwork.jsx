import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createArtwork } from "../api/artworks";

const PLATFORMS = ["X", "Pixiv", "Instagram", "Threads", "Bilibili", "米畫師", "小紅書", "Pinterest", "Other"];

function NewArtwork() {
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [form, setForm] = useState({
    artist: "",
    platform: "",
    note: "",
    tags: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const update = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    if (!image) return setError("Please choose an image.");
    setSaving(true);
    setError("");

    const data = new FormData();
    data.append("image", image);
    data.append("artist", form.artist);
    data.append("platform", form.platform);
    data.append("note", form.note);
    form.tags
      .split(/[,，、;；/／]/) // accept , ， 、 ; ； / ／ as separators
      .map((t) => t.trim())
      .filter(Boolean)
      .forEach((t) => data.append("tags", t));

    try {
      const created = await createArtwork(data);
      navigate(`/artworks/${created.id}`);
    } catch (err) {
      setError(err.response?.data ? JSON.stringify(err.response.data) : err.message);
      setSaving(false);
    }
  };

  return (
    <form className="registration" onSubmit={submit}>
      <h1>Register a new artwork</h1>

      <label>
        Image *
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
        />
      </label>

      <label>
        Artist
        <input name="artist" value={form.artist} onChange={update} placeholder="Who made it?" />
      </label>

      <label>
        Platform
        <select name="platform" value={form.platform} onChange={update}>
          <option value="">—</option>
          {PLATFORMS.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
      </label>

      <label>
        Note
        <textarea
          name="note"
          value={form.note}
          onChange={update}
          rows={4}
          placeholder="Why did you save this? What do you love about it?"
        />
      </label>

      <label>
        Tags
        <input name="tags" value={form.tags} onChange={update} placeholder="eyes, lighting, cold color" />
      </label>

      {error && <p className="error">{error}</p>}

      <button type="submit" className="btn primary" disabled={saving}>
        {saving ? "Saving…" : "Add to collection"}
      </button>
    </form>
  );
}

export default NewArtwork;
