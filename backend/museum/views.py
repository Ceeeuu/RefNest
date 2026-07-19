from pgvector.django import CosineDistance
from rest_framework import viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .models import Artwork
from .serializers import ArtworkSerializer
from .services.embeddings import embed_text


@api_view(['GET'])
def ping(request):
    return Response({'status': 'ok', 'service': 'RefNest'})


@api_view(['GET'])
def search_view(request):
    """Semantic search: embed the query, return artworks by vector similarity."""
    q = request.query_params.get('q', '').strip()
    if not q:
        return Response([])
    try:
        qvec = embed_text(q)
    except Exception as e:
        return Response({'error': str(e)}, status=503)
    results = (
        Artwork.objects.exclude(embedding=None)
        .order_by(CosineDistance('embedding', qvec))[:20]
    )
    data = ArtworkSerializer(results, many=True, context={'request': request}).data
    return Response(data)


class ArtworkViewSet(viewsets.ModelViewSet):
    """Full CRUD for artworks: list, create, retrieve, update, delete."""
    queryset = Artwork.objects.all()
    serializer_class = ArtworkSerializer
