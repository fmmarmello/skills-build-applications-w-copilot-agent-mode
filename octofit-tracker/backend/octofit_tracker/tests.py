from datetime import timedelta

from django.utils import timezone
from rest_framework import status
from rest_framework.test import APITestCase

from .models import Activity, UserProfile


class OctofitApiTests(APITestCase):
    def setUp(self):
        self.user = UserProfile.objects.create(
            username="teste",
            email="teste@mergington.edu",
            first_name="Teste",
        )

    def test_create_activity_assigns_points(self):
        response = self.client.post(
            "/api/activities/",
            {
                "user": self.user.pk,
                "activity_type": "corrida",
                "duration_minutes": 30,
                "distance_km": 4.2,
                "performed_at": (timezone.now() - timedelta(days=1)).isoformat(),
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["points"], 30)
        self.assertEqual(Activity.objects.count(), 1)

    def test_users_endpoint_returns_string_id(self):
        response = self.client.get("/api/users/")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIsInstance(response.data[0]["id"], str)