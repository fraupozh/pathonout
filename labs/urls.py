# labs/urls.py

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from labs.views import MarkersMapView, marker_detail_view, sample_detail_view
from labs.viewsets import MarkerViewSet, SampleViewSet

app_name = "labs"

router = DefaultRouter()
router.register(r'markers', MarkerViewSet, basename='marker')
router.register(r'samples', SampleViewSet, basename='sample')

urlpatterns = [
    path("map/", MarkersMapView.as_view(), name='map'),
    path('', include(router.urls)),
    path('marker_detail/', marker_detail_view, name='marker_detail'),
    path('sample_detail/<str:sample_id>/', sample_detail_view, name='sample_detail')
]


