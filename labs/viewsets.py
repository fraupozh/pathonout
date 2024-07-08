#labs/viewsets.py

from rest_framework import viewsets
from rest_framework_gis import filters
from labs.models import Marker, Isolate
from labs.serializers import MarkerSerializer, IsolateSerializer

class MarkerViewSet(viewsets.ReadOnlyModelViewSet):
    bbox_filter_field = "location"
    filter_backends = (filters.InBBoxFilter,)
    queryset = Marker.objects.all()
    serializer_class = MarkerSerializer

class IsolateViewSet(viewsets.ReadOnlyModelViewSet):
    bbox_filter_field = "collection_location"
    filter_backends = (filters.InBBoxFilter,)
    queryset = Isolate.objects.all()
    serializer_class = IsolateSerializer



