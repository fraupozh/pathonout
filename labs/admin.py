from django.contrib.gis import admin

from labs.models import Marker, Isolate


@admin.register(Marker)
class MarkerAdmin(admin.GISModelAdmin):
    list_display = ("name", "location")

@admin.register(Isolate)
class IsolateAdmin(admin.GISModelAdmin):
    list_display = ("species", "ID", "marker", "collection_location")  # Added collection_location
    list_filter = ("species", "acquisition_date")
    search_fields = ("species", "ID", "marker__name")

    def get_queryset(self, request):
        queryset = super().get_queryset(request)
        queryset = queryset.select_related('marker')
        return queryset
