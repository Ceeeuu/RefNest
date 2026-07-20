from rest_framework import viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .models import Artwork
from .serializers import ArtworkSerializer
from .services.curator import ask_curator


@api_view(['GET'])
def ping(request):
    return Response({'status': 'ok', 'service': 'RefNest'})


@api_view(['POST'])
def curator_view(request):
    """AI curator: answer a question and return the artworks it referenced."""
    try:
        reply, matches = ask_curator(request.data.get('message', ''))
    except Exception as e:
        return Response({'error': str(e), 'artworks': []}, status=503)
    data = ArtworkSerializer(matches, many=True, context={'request': request}).data
    return Response({'reply': reply, 'artworks': data})


class ArtworkViewSet(viewsets.ModelViewSet):
    """Full CRUD for artworks: list, create, retrieve, update, delete."""
    queryset = Artwork.objects.all()
    serializer_class = ArtworkSerializer
