#labs/serializer.py

from rest_framework import serializers
from rest_framework_gis.serializers import GeoFeatureModelSerializer
from .models import Marker, Sample

class SampleSerializer(serializers.ModelSerializer):
    collection_location = serializers.SerializerMethodField()

    class Meta:
        model = Sample
        fields = (
            'ID',
            'sample_type',
            'acquisition_date',
            'sampling_date',
            'collection_location',
        )
    
    def get_collection_location(self, obj):
        return {
            "type": "Point",
            "coordinates": [obj.collection_location.x, obj.collection_location.y]
        }

class MarkerSerializer(GeoFeatureModelSerializer):
    samples = SampleSerializer(many=True, read_only=True)

    class Meta:
        model = Marker
        geo_field = 'location'
        fields = ('id', 'name', 'location', 'samples')   
