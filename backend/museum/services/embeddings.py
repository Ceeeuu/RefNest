"""Turn an artwork's text (note + tags + artist + platform) into a vector.

The image is never analyzed — knowledge lives in the text the user wrote.
"""
import os

from openai import OpenAI

MODEL = os.getenv("OPENAI_EMBED_MODEL", "text-embedding-3-small")


def artwork_text(artwork) -> str:
    """Combine the user's *descriptive* text to embed.

    Only note + tags — the semantic content. artist/platform are categorical
    and belong in structured filters, not the vector (they'd add noise).
    """
    tags = ", ".join(t.name for t in artwork.tags.all())
    parts = [artwork.note, tags]
    return "\n".join(p for p in parts if p).strip()


def embed_text(text: str) -> list[float]:
    client = OpenAI(api_key=os.environ["OPENAI_API_KEY"])
    resp = client.embeddings.create(model=MODEL, input=text)
    return resp.data[0].embedding


def embed_artwork(artwork, save: bool = True) -> bool:
    """Generate and store the embedding. Returns False if there's no text yet."""
    text = artwork_text(artwork)
    if not text:
        return False
    artwork.embedding = embed_text(text)
    if save:
        artwork.save(update_fields=["embedding"])
    return True
