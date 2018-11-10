from django.apps import AppConfig


class BugtrackerConfig(AppConfig):
    name = 'bugtracker'

    def ready(self):
        import bugtracker.signals
