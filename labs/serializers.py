#labs/serializer.py

from rest_framework import serializers
from rest_framework_gis.serializers import GeoFeatureModelSerializer
from .models import Marker, Isolate

class IsolateSerializer(serializers.ModelSerializer):
    collection_location = serializers.SerializerMethodField()

    class Meta:
        model = Isolate
        fields = (
            'species',
            'ID',
            'isolation_source',
            'host_organism_environment',
            'acquisition_date',
            'analysis_date',
            'collection_location',
        )
    
    def get_collection_location(self, obj):
        return {
            "type": "Point",
            "coordinates": [obj.collection_location.x, obj.collection_location.y]
        }

class MarkerSerializer(GeoFeatureModelSerializer):
    isolates = IsolateSerializer(many=True, read_only=True)

    class Meta:
        model = Marker
        geo_field = 'location'
        fields = ('id', 'name', 'location', 'isolates')   
