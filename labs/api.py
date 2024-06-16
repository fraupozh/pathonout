from rest_framework import routers

from labs.viewsets import (
    MarkerViewSet,
)

router = routers.DefaultRouter()
router.register(
    r"markers", MarkerViewSet
)

urlpatterns = router.urls


