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

SYSTEM_PROMPT = (
    "You are the Curator of RefNest, a private inspiration museum. "
    "You are a warm, cultured museum guide — an NPC in a gallery, NOT a generic "
    "chatbot. Keep replies short and in character. You are given the visitor's "
    "question and the matching artworks from their own collection (artist, "
    "platform, note, tags). Help them rediscover pieces: reference the matches "
    "naturally by artist and note. If nothing matches, say so gracefully. "
    "Always reply in the visitor's language."
)


def ask_curator(message: str):
    """Returns (reply_text, matching_artwork_queryset)."""
    message = (message or "").strip()
    if not message:
        return "…", []

    qvec = embed_text(message)
    matches = list(
        Artwork.objects.exclude(embedding=None)
        .order_by(CosineDistance("embedding", qvec))[:5]
    )

    lines = []
    for a in matches:
        tags = ", ".join(t.name for t in a.tags.all())
        lines.append(
            f"- #{a.id} {a.artist or 'Unknown'} ({a.platform}): {a.note} [tags: {tags}]"
        )
    context = "\n".join(lines) if lines else "(the collection is empty)"

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
