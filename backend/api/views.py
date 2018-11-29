from django.contrib.auth.models import User

from rest_framework import permissions, mixins, viewsets
from rest_framework.filters import OrderingFilter, SearchFilter

from django_filters.rest_framework import DjangoFilterBackend

from bugtracker import models
from .permissions import (IsOwnerOrStaffOrReadOnly,
                          IsSelfOrReadOnly,
                          IsStaffOrReadOnly,
                          IsSupervisorOrReadOnly)
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

    def perform_update(self, serializer):
        ticket = self.get_object()
        duplicate = serializer.validated_data.get('duplicate', ticket.duplicate)
        expert = serializer.validated_data.get('expert', ticket.expert)

        if duplicate:
            serializer.save(status=models.Ticket.STATUS_DUPLICATE)
        elif expert:
            serializer.save(status=models.Ticket.STATUS_ASSIGNED)
        else:
            serializer.save(status=models.Ticket.STATUS_NEW)


class LanguageViewSet(viewsets.ModelViewSet):
    serializer_class = serializers.LanguageSerializer
    queryset = models.Language.objects.all()
    permission_classes = (permissions.IsAuthenticatedOrReadOnly,
                          IsSupervisorOrReadOnly)
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
                          IsSupervisorOrReadOnly)
    filter_backends = (OrderingFilter, SearchFilter, DjangoFilterBackend)
    filterset_class = bugtracker_filters.ModuleFilter
    search_fields = ('name',)
    ordering_fields = ('id', 'name')
    ordering = ('id',)


class SeverityViewSet(viewsets.ModelViewSet):
    serializer_class = serializers.SeveritySerializer
    queryset = models.Severity.objects.all()
    permission_classes = (permissions.IsAuthenticatedOrReadOnly,
                          IsSupervisorOrReadOnly)
    filter_backends = (OrderingFilter, SearchFilter)
    search_fields = ('name',)
    ordering_fields = ('level', 'name')
    ordering = ('level',)


class BugViewSet(viewsets.ModelViewSet):
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

    def get_serializer_class(self):
        if self.action == 'list' or self.action == 'retrieve':
            return serializers.BugGETSerializer
        return serializers.BugPOSTSerializer


class PatchViewset(viewsets.ModelViewSet):
    queryset = models.Patch.objects.all()
    permission_classes = (permissions.IsAuthenticatedOrReadOnly,
                          IsStaffOrReadOnly)
    filter_backends = (OrderingFilter, SearchFilter, DjangoFilterBackend)
    filterset_class = bugtracker_filters.PatchFilter
    ordering_fields = ('id', 'date_released', 'date_applied')
    ordering = ('-date_released',)

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

        tickets_involved = []
        for fixed_bug in serializer.validated_data['bugs']:
            tickets_involved.extend(fixed_bug.tickets.all())
        self.update_ticket_status(tickets_involved)

    def perform_update(self, serializer):
        tickets_before_update = set()
        for bug in self.get_object().bugs.all():
            for ticket in bug.tickets.all():
                tickets_before_update.add(ticket.id)

        serializer.save()

        tickets_after_update = set()
        for bug in self.get_object().bugs.all():
            for ticket in bug.tickets.all():
                tickets_after_update.add(ticket.id)

        diff = tickets_before_update.symmetric_difference(tickets_after_update)
        self.update_ticket_status(models.Ticket.objects.filter(pk__in=diff))

    def perform_destroy(self, instance):
        tickets_involved = []
        for fixed_bug in instance.bugs.all():
            tickets_involved.extend(fixed_bug.tickets.all())

        instance.delete()
        self.update_ticket_status(tickets_involved)

    def update_ticket_status(self, tickets):
        for ticket in tickets:
            for bug in ticket.bugs.all():
                if not bug.patch:
                    if ticket.expert:
                        ticket.status = models.Ticket.STATUS_ASSIGNED
                    else:
                        ticket.status = models.Ticket.STATUS_NEW
                    break
            else:
                ticket.status = models.Ticket.STATUS_CLOSED
            ticket.save(update_fields=['status'])

    def get_serializer_class(self):
        if self.action == 'list' or self.action == 'retrieve':
            return serializers.PatchGETSerializer
        return serializers.PatchPOSTSerializer
