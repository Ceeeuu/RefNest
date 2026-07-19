from django.urls import include, path
from rest_framework.routers import DefaultRouter

from . import views

router = DefaultRouter()
router.register(r'artworks', views.ArtworkViewSet)

urlpatterns = [
    path('ping/', views.ping),
    path('curator/', views.curator_view),
    path('', include(router.urls)),
]
