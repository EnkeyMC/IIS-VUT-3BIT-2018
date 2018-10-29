from django.contrib import admin
from django.contrib.auth.models import User
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import Bug, Language, Module, Patch, Profile, Severity, Ticket


class ProfileInline(admin.StackedInline):
    model = Profile
    verbose_name_plural = 'profile'


class UserAdmin(BaseUserAdmin):
    inlines = (ProfileInline,)


admin.site.unregister(User)
admin.site.register(User, UserAdmin)
admin.site.register(Bug)
admin.site.register(Language)
admin.site.register(Module)
admin.site.register(Patch)
admin.site.register(Severity)
admin.site.register(Ticket)
