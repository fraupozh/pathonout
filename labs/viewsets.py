# labs/viewsets.py

from rest_framework import viewsets
from rest_framework_gis import filters
from labs.models import Marker, Sample
from labs.serializers import MarkerSerializer, SampleSerializer

class MarkerViewSet(viewsets.ReadOnlyModelViewSet):
    bbox_filter_field = "location"
    filter_backends = (filters.InBBoxFilter,)
    queryset = Marker.objects.all()
    serializer_class = MarkerSerializer

class SampleViewSet(viewsets.ReadOnlyModelViewSet):
    bbox_filter_field = "collection_location"
    filter_backends = (filters.InBBoxFilter,)
    queryset = Sample.objects.all()
    serializer_class = SampleSerializer

