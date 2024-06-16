from django.contrib.gis import admin

from labs.models import Marker


@admin.register(Marker)
class MarkerAdmin(admin.GISModelAdmin):
    list_display = ("name", "location")
