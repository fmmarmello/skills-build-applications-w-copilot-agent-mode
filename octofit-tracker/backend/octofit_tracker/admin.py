from django.contrib import admin

from .models import Activity, Team, UserProfile, WorkoutSuggestion

admin.site.register(UserProfile)
admin.site.register(Activity)
admin.site.register(Team)
admin.site.register(WorkoutSuggestion)