from rest_framework import routers

from labs.viewsets import (
    MarkerViewSet, IsolateViewSet
)

router = routers.DefaultRouter()
router.register(r"markers", MarkerViewSet)
router.register(r"isolates", IsolateViewSet)

urlpatterns = router.urls


