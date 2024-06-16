from rest_framework_gis.serializers import (
    GeoFeatureModelSerializer,
)

from labs.models import Marker


class MarkerSerializer(
    GeoFeatureModelSerializer
):
    class Meta:
        fields = ("id", "name")
        geo_field = "location"
        model = Marker
