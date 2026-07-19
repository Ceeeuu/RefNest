"""The AI Curator: conversational RAG over the user's own collection.

Ask a question -> semantic search finds matching artworks -> GPT answers
in the voice of a museum curator, referencing those pieces.
"""
import os

from openai import OpenAI
from pgvector.django import CosineDistance

from ..models import Artwork
from .embeddings import embed_text

CHAT_MODEL = os.getenv("OPENAI_CURATOR_MODEL", "gpt-4o-mini")

# Only surface artworks whose cosine distance is below this. Measured on
# text-embedding-3-small: relevant hits ~0.2-0.45, unrelated ~0.6+.
# ponytail: heuristic knob, tune per collection if recall/precision feels off.
MATCH_MAX_DISTANCE = float(os.getenv("CURATOR_MAX_DISTANCE", "0.6"))

SYSTEM_PROMPT = (
    "You are the Curator of RefNest — a young, upbeat anime-style gallery girl. "
    "Speak briefly, warmly and with energy. Keep replies to 1-3 short sentences. "
    "Do NOT use kaomoji or emoticons. You are given the visitor's question and "
    "the matching artworks from their collection (artist, platform, note, tags). "
    "Point them to the pieces, mentioning artist and note briefly. If nothing "
    "matches, say so in one line. Always reply in the visitor's language."
)


def ask_curator(message: str):
    """Returns (reply_text, matching_artwork_queryset)."""
    message = (message or "").strip()
    if not message:
        return "…", []

    qvec = embed_text(message)
    matches = list(
        Artwork.objects.exclude(embedding=None)
        .annotate(distance=CosineDistance("embedding", qvec))
        .filter(distance__lt=MATCH_MAX_DISTANCE)
        .order_by("distance")[:5]
    )

    lines = []
    for a in matches:
        tags = ", ".join(t.name for t in a.tags.all())
        lines.append(
            f"- #{a.id} {a.artist or 'Unknown'} ({a.platform}): {a.note} [tags: {tags}]"
        )
    context = "\n".join(lines) if lines else "(no artworks matched this query)"

    client = OpenAI(api_key=os.environ["OPENAI_API_KEY"])
    resp = client.chat.completions.create(
        model=CHAT_MODEL,
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {
                "role": "user",
                "content": f"Visitor asks: {message}\n\nMatching artworks:\n{context}",
            },
        ],
        temperature=0.7,
    )
    return resp.choices[0].message.content, matches
