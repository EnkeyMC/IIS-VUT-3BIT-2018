from rest_framework import permissions

from bugtracker.models import Profile


class IsOwnerOrStaffOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow owner or staff person to edit it
    """

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True

        # Write permissions are only allowed to the owner of the ticket
        # or staff person
        staff = (Profile.PROGRAMMER, Profile.SUPERVISOR)
        user = request.user
        return obj.author == user or user.profile.user_type in staff
