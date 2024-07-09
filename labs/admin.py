from django.contrib.gis import admin

from labs.models import Marker, Sample


@admin.register(Marker)
class MarkerAdmin(admin.GISModelAdmin):
    list_display = ("name", "location")

@admin.register(Sample)
class SampleAdmin(admin.GISModelAdmin):
    list_display = ("sample_type", "ID", "marker", "collection_location")  # Updated fields
    list_filter = ("sample_type", "acquisition_date")
    search_fields = ("sample_type", "ID", "marker__name")

    def get_queryset(self, request):
        queryset = super().get_queryset(request)
        queryset = queryset.select_related('marker')
        return queryset