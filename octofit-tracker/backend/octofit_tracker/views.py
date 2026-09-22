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
    leaderboard = (
        UserProfile.objects.annotate(total_points=Sum("activities__points"))
        .values("id", "username", "total_points")
        .order_by("-total_points", "username")
    )
    return Response(
        {
            "users": request.build_absolute_uri("users/"),
            "activities": request.build_absolute_uri("activities/"),
            "teams": request.build_absolute_uri("teams/"),
            "workout-suggestions": request.build_absolute_uri("workout-suggestions/"),
            "leaderboard": list(leaderboard),
        }
    )