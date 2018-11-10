from rest_framework import permissions

from bugtracker.models import Profile


class IsOwnerOrStaffOrReadOnly(permissions.BasePermission):

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True

        staff = (Profile.PROGRAMMER, Profile.SUPERVISOR)
        return (obj.author == request.user or
                request.user.profile.user_type in staff)


class IsSelfOrReadOnly(permissions.BasePermission):

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True

        return obj == request.user


class IsStaffOrReadOnly(permissions.BasePermission):

    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True

        staff = (Profile.PROGRAMMER, Profile.SUPERVISOR)
        return request.user.profile.user_type in staff
