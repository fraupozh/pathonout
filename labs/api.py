from rest_framework import routers

from labs.viewsets import MarkerViewSet, SampleViewSet  # Update the import to SampleViewSet

router = routers.DefaultRouter()
router.register(r"markers", MarkerViewSet)
router.register(r"samples", SampleViewSet)  # Update the route to "samples"

urlpatterns = router.urls


