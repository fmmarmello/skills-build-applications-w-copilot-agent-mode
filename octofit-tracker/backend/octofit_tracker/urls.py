import os

from django.contrib import admin
from django.urls import include, path
from rest_framework.routers import DefaultRouter
from rest_framework.response import Response
from rest_framework.decorators import api_view

from .views import (
    ActivityViewSet,
    TeamViewSet,
    UserProfileViewSet,
    WorkoutSuggestionViewSet,
    leaderboard,
)

codespace_name = os.environ.get("CODESPACE_NAME")
if codespace_name:
    base_url = f"https://{codespace_name}-8000.app.github.dev"
else:
    base_url = "http://localhost:8000"


@api_view(["GET"])
def api_root(request):
    return Response(
        {
            "users": f"{base_url}/api/users/",
            "activities": f"{base_url}/api/activities/",
            "teams": f"{base_url}/api/teams/",
            "workout-suggestions": f"{base_url}/api/workout-suggestions/",
            "leaderboard": f"{base_url}/api/leaderboard/",
        }
    )

router = DefaultRouter()
router.register("users", UserProfileViewSet)
router.register("activities", ActivityViewSet)
router.register("teams", TeamViewSet)
router.register("workout-suggestions", WorkoutSuggestionViewSet)

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", api_root, name="api-root"),
    path("api/leaderboard/", leaderboard, name="leaderboard"),
    path("api/", include(router.urls)),
]