#labs/urls.py

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from labs.views import MarkersMapView, marker_detail_view, isolate_detail_view
from labs.viewsets import MarkerViewSet, IsolateViewSet

app_name = "labs"

router = DefaultRouter()
router.register(r'markers', MarkerViewSet, basename='marker')
router.register(r'isolates', IsolateViewSet, basename='isolate')

urlpatterns = [
    path("map/", MarkersMapView.as_view(), name='map'),
    path('', include(router.urls)),
    path('marker_detail/', marker_detail_view, name='marker_detail'),
    path('isolate_detail/<str:isolate_id>/', isolate_detail_view, name='isolate_detail')

]


