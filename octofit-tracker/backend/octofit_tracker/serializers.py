from rest_framework import serializers

from .models import Activity, Team, UserProfile, WorkoutSuggestion


class UserProfileSerializer(serializers.ModelSerializer):
    id = serializers.SerializerMethodField()

    def get_id(self, obj):
        return str(obj.pk)

    class Meta:
        model = UserProfile
        fields = ["id", "username", "email", "first_name", "last_name", "fitness_level", "created_at"]
        read_only_fields = ["id", "created_at"]


class ActivitySerializer(serializers.ModelSerializer):
    id = serializers.SerializerMethodField()
    user_name = serializers.CharField(source="user.username", read_only=True)

    def get_id(self, obj):
        return str(obj.pk)

    class Meta:
        model = Activity
        fields = [
            "id",
            "user",
            "user_name",
            "activity_type",
            "duration_minutes",
            "distance_km",
            "points",
            "performed_at",
        ]
        read_only_fields = ["id", "points", "user_name"]

    def create(self, validated_data):
        validated_data["points"] = max(1, validated_data["duration_minutes"])
        return super().create(validated_data)


class TeamSerializer(serializers.ModelSerializer):
    id = serializers.SerializerMethodField()
    member_ids = serializers.PrimaryKeyRelatedField(
        source="members", many=True, queryset=UserProfile.objects.all(), required=False
    )
    captain_name = serializers.CharField(source="captain.username", read_only=True)

    class Meta:
        model = Team
        fields = ["id", "name", "captain", "captain_name", "member_ids", "created_at"]
        read_only_fields = ["id", "created_at", "captain_name"]

    def get_id(self, obj):
        return str(obj.pk)


class WorkoutSuggestionSerializer(serializers.ModelSerializer):
    id = serializers.SerializerMethodField()

    def get_id(self, obj):
        return str(obj.pk)

    class Meta:
        model = WorkoutSuggestion
        fields = ["id", "title", "description", "activity_type", "difficulty", "duration_minutes"]
        read_only_fields = ["id"]