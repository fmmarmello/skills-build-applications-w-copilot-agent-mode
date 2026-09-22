from django.db.models import Sum
from rest_framework import viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .models import Activity, Team, UserProfile, WorkoutSuggestion
from .serializers import (
    ActivitySerializer,
    TeamSerializer,
    UserProfileSerializer,
    WorkoutSuggestionSerializer,
)


@api_view(["GET"])
def leaderboard(request):
    leaderboard_data = (
        UserProfile.objects.annotate(total_points=Sum("activities__points"))
        .values("id", "username", "first_name", "last_name", "total_points")
        .order_by("-total_points", "username")
    )

    return Response(
        [
            {
                "id": str(item["id"]),
                "username": item["username"],
                "first_name": item["first_name"],
                "last_name": item["last_name"],
                "total_points": item["total_points"] or 0,
            }
            for item in leaderboard_data
        ]
    )


class UserProfileViewSet(viewsets.ModelViewSet):
    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer


class ActivityViewSet(viewsets.ModelViewSet):
    queryset = Activity.objects.select_related("user").all()
    serializer_class = ActivitySerializer


class TeamViewSet(viewsets.ModelViewSet):
    queryset = Team.objects.prefetch_related("members").all()
    serializer_class = TeamSerializer


class WorkoutSuggestionViewSet(viewsets.ModelViewSet):
    queryset = WorkoutSuggestion.objects.all()
    serializer_class = WorkoutSuggestionSerializer


@api_view(["GET"])
def api_root(request):
    return Response(
        {
            "users": request.build_absolute_uri("users/"),
            "activities": request.build_absolute_uri("activities/"),
            "teams": request.build_absolute_uri("teams/"),
            "workout-suggestions": request.build_absolute_uri("workout-suggestions/"),
            "leaderboard": request.build_absolute_uri("leaderboard/"),
        }
    )