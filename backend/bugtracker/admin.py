from django.contrib import admin
from .models import Bug, Language, Module, Patch, Profile, Severity, Ticket

admin.site.register(Bug)
admin.site.register(Language)
admin.site.register(Module)
admin.site.register(Patch)
admin.site.register(Profile)
admin.site.register(Severity)
admin.site.register(Ticket)
