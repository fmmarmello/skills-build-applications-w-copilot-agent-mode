from django.db import models


class UserProfile(models.Model):
    username = models.CharField(max_length=80, unique=True)
    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=80)
    last_name = models.CharField(max_length=80, blank=True)
    fitness_level = models.CharField(max_length=20, default="iniciante")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["username"]

    def __str__(self):
        return self.username


class Activity(models.Model):
    user = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name="activities")
    activity_type = models.CharField(max_length=40)
    duration_minutes = models.PositiveIntegerField()
    distance_km = models.FloatField(default=0)
    points = models.PositiveIntegerField(default=0)
    performed_at = models.DateTimeField()

    class Meta:
        ordering = ["-performed_at"]


class Team(models.Model):
    name = models.CharField(max_length=100, unique=True)
    captain = models.ForeignKey(UserProfile, on_delete=models.PROTECT, related_name="captained_teams")
    members = models.ManyToManyField(UserProfile, related_name="teams", blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["name"]


class WorkoutSuggestion(models.Model):
    title = models.CharField(max_length=120)
    description = models.TextField()
    activity_type = models.CharField(max_length=40)
    difficulty = models.CharField(max_length=20, default="iniciante")
    duration_minutes = models.PositiveIntegerField()

    class Meta:
        ordering = ["difficulty", "title"]