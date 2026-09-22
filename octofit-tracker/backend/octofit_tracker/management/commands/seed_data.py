from datetime import timedelta

from django.core.management.base import BaseCommand
from django.utils import timezone

from octofit_tracker.models import Activity, Team, UserProfile, WorkoutSuggestion


class Command(BaseCommand):
    help = "Popula o octofit_db com dados de demonstração usando o ORM do Django."

    def handle(self, *args, **options):
        users = {}
        for data in [
            {
                "username": "ana",
                "email": "ana@mergington.edu",
                "first_name": "Ana",
                "last_name": "Silva",
                "fitness_level": "intermediario",
            },
            {
                "username": "bruno",
                "email": "bruno@mergington.edu",
                "first_name": "Bruno",
                "last_name": "Costa",
                "fitness_level": "iniciante",
            },
            {
                "username": "carla",
                "email": "carla@mergington.edu",
                "first_name": "Carla",
                "last_name": "Oliveira",
                "fitness_level": "avancado",
            },
        ]:
            username = data.pop("username")
            users[username], _ = UserProfile.objects.update_or_create(
                username=username,
                defaults=data,
            )

        activities = [
            ("ana", "corrida", 35, 5.1, 7),
            ("bruno", "caminhada", 45, 3.2, 4),
            ("carla", "forca", 50, 0, 9),
        ]
        for username, activity_type, duration, distance, points in activities:
            Activity.objects.update_or_create(
                user=users[username],
                activity_type=activity_type,
                performed_at=timezone.now() - timedelta(days=2),
                defaults={
                    "duration_minutes": duration,
                    "distance_km": distance,
                    "points": points,
                },
            )

        team, _ = Team.objects.update_or_create(
            name="Mergington Movers",
            defaults={"captain": users["ana"]},
        )
        team.members.set(users.values())

        for data in [
            {
                "title": "Corrida de 20 minutos",
                "description": "Mantenha um ritmo confortável e constante.",
                "activity_type": "corrida",
                "difficulty": "iniciante",
                "duration_minutes": 20,
            },
            {
                "title": "Circuito de força",
                "description": "Alterne agachamentos, flexões e prancha.",
                "activity_type": "forca",
                "difficulty": "intermediario",
                "duration_minutes": 30,
            },
        ]:
            WorkoutSuggestion.objects.update_or_create(
                title=data["title"],
                defaults=data,
            )

        self.stdout.write(
            self.style.SUCCESS(
                "Dados populados em octofit_db: "
                f"{UserProfile.objects.count()} usuários, "
                f"{Activity.objects.count()} atividades, "
                f"{Team.objects.count()} equipes, "
                f"{WorkoutSuggestion.objects.count()} sugestões."
            )
        )