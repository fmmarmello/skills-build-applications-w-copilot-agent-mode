from .seed_data import Command as SeedDataCommand


class Command(SeedDataCommand):
    help = "Populate the octofit_db database with test data"