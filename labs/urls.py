from django.urls import path

from labs.views import MarkersMapView

app_name = "labs"

urlpatterns = [
    path(
        "map/", MarkersMapView.as_view()
    ),
]

