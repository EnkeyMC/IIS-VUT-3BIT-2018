from rest_framework import permissions

from bugtracker.models import Profile


class IsOwnerOrStaffOrReadOnly(permissions.BasePermission):

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True

        staff = (Profile.PROGRAMMER, Profile.SUPERVISOR)
        return (obj.author == request.user
                or request.user.profile.user_type in staff)


class IsSelfOrSupervisorOrReadOnly(permissions.BasePermission):

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True

        return (obj == request.user
                or request.user.profile.user_type == Profile.SUPERVISOR)


class IsStaffOrReadOnly(permissions.BasePermission):

    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True

        staff = (Profile.PROGRAMMER, Profile.SUPERVISOR)
        return request.user.profile.user_type in staff


class IsSupervisorOrReadOnly(permissions.BasePermission):

    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True

        return request.user.profile.user_type in Profile.SUPERVISOR
