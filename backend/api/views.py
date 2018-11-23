from django.contrib.auth.models import User

from rest_framework import permissions, mixins, viewsets
from rest_framework.filters import OrderingFilter, SearchFilter

from django_filters.rest_framework import DjangoFilterBackend

from bugtracker import models
from .permissions import (IsOwnerOrStaffOrReadOnly,
                          IsSelfOrReadOnly,
                          IsStaffOrReadOnly)
from . import serializers
from . import filters as bugtracker_filters


class TicketViewSet(viewsets.ModelViewSet):
    queryset = models.Ticket.objects.all()
    permission_classes = (permissions.IsAuthenticatedOrReadOnly,
                          IsOwnerOrStaffOrReadOnly)
    filter_backends = (OrderingFilter, SearchFilter, DjangoFilterBackend)
    filterset_class = bugtracker_filters.TicketFilter
    ordering_fields = ('id', 'created')
    ordering = ('-created',)
    search_fields = ('title',)

    def get_serializer_class(self):
        if self.action == 'list' or self.action == 'create':
            return serializers.TicketListSerializer
        if not self.request.user.is_authenticated:
            return serializers.TicketDetailSerializer

        if self.request.user.profile.user_type == models.Profile.USER:
            return serializers.UserTicketDetailSerializer
        if self.request.user.profile.user_type == models.Profile.PROGRAMMER:
            return serializers.ProgrammerTicketDetailSerializer
        if self.request.user.profile.user_type == models.Profile.SUPERVISOR:
            return serializers.SupervisorTicketDetailSerializer

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)


class LanguageViewSet(viewsets.ModelViewSet):
    serializer_class = serializers.LanguageSerializer
    queryset = models.Language.objects.all()
    permission_classes = (permissions.IsAuthenticatedOrReadOnly,
                          IsStaffOrReadOnly)
    filter_backends = (OrderingFilter, SearchFilter, DjangoFilterBackend)
    filterset_class = bugtracker_filters.LanguageFilter
    search_fields = ('name',)
    ordering_fields = '__all__'
    ordering = ('id',)


class UserViewSet(mixins.RetrieveModelMixin,
                  mixins.UpdateModelMixin,
                  mixins.DestroyModelMixin,
                  mixins.ListModelMixin,
                  viewsets.GenericViewSet):
    queryset = User.objects.exclude(is_superuser=True)
    permission_classes = (permissions.IsAuthenticatedOrReadOnly,
                          IsSelfOrReadOnly)
    filter_backends = (OrderingFilter, SearchFilter, DjangoFilterBackend)
    ordering_fields = ('id', 'username', 'first_name', 'last_name')
    ordering = ('id',)
    search_fields = ('username', 'first_name', 'last_name')
    filterset_fields = ('username',)

    def get_serializer_class(self):
        if self.request.query_params.get('username', False):
            return serializers.UserDetailSerializer
        if self.action == 'list':
            return serializers.UserListSerializer
        return serializers.UserDetailSerializer


class ModuleViewSet(viewsets.ModelViewSet):
    serializer_class = serializers.ModuleSerializer
    queryset = models.Module.objects.all()
    permission_classes = (permissions.IsAuthenticatedOrReadOnly,
                          IsStaffOrReadOnly)
    filter_backends = (OrderingFilter, SearchFilter, DjangoFilterBackend)
    filterset_class = bugtracker_filters.ModuleFilter
    search_fields = ('name',)
    ordering_fields = ('id', 'name')
    ordering = ('id',)


class SeverityViewSet(viewsets.ModelViewSet):
    serializer_class = serializers.SeveritySerializer
    queryset = models.Severity.objects.all()
    permission_classes = (permissions.IsAuthenticatedOrReadOnly,
                          IsStaffOrReadOnly)
    filter_backends = (OrderingFilter, SearchFilter)
    search_fields = ('name',)
    ordering_fields = ('level', 'name')
    ordering = ('level',)


class BugViewSet(viewsets.ModelViewSet):
    serializer_class = serializers.BugSerializer
    queryset = models.Bug.objects.all()
    permission_classes = (permissions.IsAuthenticatedOrReadOnly,
                          IsStaffOrReadOnly)
    filter_backends = (OrderingFilter, SearchFilter, DjangoFilterBackend)
    filterset_class = bugtracker_filters.BugFilter
    search_fields = ('title',)
    ordering_fields = ('severity', 'id', 'created')
    ordering = ('-created',)

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)


class PatchViewset(viewsets.ModelViewSet):
    serializer_class = serializers.PatchSerializer
    queryset = models.Patch.objects.all()
    permission_classes = (permissions.IsAuthenticatedOrReadOnly,
                          IsStaffOrReadOnly)
    filter_backends = (OrderingFilter, SearchFilter, DjangoFilterBackend)
    filterset_class = bugtracker_filters.PatchFilter
    ordering_fields = ('id', 'date_released', 'date_applied')
    ordering = ('-date_released',)

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)
