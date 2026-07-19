from django.db import models


class Tag(models.Model):
    """A label attached to artworks. Shared across artworks (many-to-many)."""
    name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.name


class Artwork(models.Model):
    """One saved reference image and everything the user knows about it."""

    # ponytail: platform is a small fixed set → CharField+choices, not a table
    PLATFORM_CHOICES = [
        ("X", "X / Twitter"),
        ("Pixiv", "Pixiv"),
        ("Instagram", "Instagram"),
        ("Threads", "Threads"),
        ("Bilibili", "Bilibili"),
        ("米畫師", "米畫師"),
        ("小紅書", "小紅書"),
        ("Pinterest", "Pinterest"),
        ("Other", "Other"),
    ]

    image = models.ImageField(upload_to="artworks/")
    # ponytail: artist as text for now; promote to its own model if we ever
    # need per-artist pages / grouping
    artist = models.CharField(max_length=100, blank=True)
    platform = models.CharField(max_length=20, choices=PLATFORM_CHOICES, blank=True)
    source_url = models.URLField(blank=True)
    note = models.TextField(blank=True)  # the user's own words = the real knowledge
    tags = models.ManyToManyField(Tag, blank=True, related_name="artworks")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]  # newest first on the gallery wall

    def __str__(self):
        return f"{self.artist or 'Unknown'} ({self.platform or 'n/a'})"
