from rest_framework import viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .models import Artwork
from .serializers import ArtworkSerializer


@api_view(['GET'])
def ping(request):
    return Response({'status': 'ok', 'service': 'RefNest'})


class ArtworkViewSet(viewsets.ModelViewSet):
    """Full CRUD for artworks: list, create, retrieve, update, delete."""
    queryset = Artwork.objects.all()
    serializer_class = ArtworkSerializer
