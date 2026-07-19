from django.core.management.base import BaseCommand

from museum.models import Artwork
from museum.services.embeddings import embed_artwork


class Command(BaseCommand):
    help = "Generate embeddings for artworks that don't have one yet."

    def handle(self, *args, **options):
        pending = Artwork.objects.filter(embedding__isnull=True)
        total = pending.count()
        self.stdout.write(f"{total} artwork(s) to embed…")
        done = 0
        for art in pending:
            if embed_artwork(art):
                done += 1
                self.stdout.write(f"  ✓ #{art.id} {art.artist or 'Unknown'}")
        self.stdout.write(self.style.SUCCESS(f"Done. Embedded {done}/{total}."))
