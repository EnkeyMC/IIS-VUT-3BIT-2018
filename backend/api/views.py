from django.contrib.auth.models import User
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters, generics, permissions

from bugtracker import models
from . import serializers
from . import filters as bugtracker_filters
from .permissions import IsOwnerOrStaffOrReadOnly


class TicketList(generics.ListCreateAPIView):
    queryset = models.Ticket.objects.all()
    serializer_class = serializers.TicketListSerializer
    filter_backends = (
        filters.OrderingFilter, filters.SearchFilter, DjangoFilterBackend
    )
    filterset_class = bugtracker_filters.TicketFilter
    ordering_fields = ('id', 'created')
    ordering = ('-created',)
    search_fields = ('title',)

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)


class TicketDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = models.Ticket.objects.all()
    serializer_class = serializers.TicketDetailSerializer
    permission_classes = (
        permissions.IsAuthenticatedOrReadOnly, IsOwnerOrStaffOrReadOnly
    )

    def get_serializer_class(self):
        if isinstance(self.request.user, User):
            if self.request.user.profile.user_type == models.Profile.USER:
                return serializers.UserTicketDetailSerializer
            if self.request.user.profile.user_type == models.Profile.PROGRAMMER:
                return serializers.ProgrammerTicketDetailSerializer
            if self.request.user.profile.user_type == models.Profile.SUPERVISOR:
                return serializers.SupervisorTicketDetailSerializer
        return super().get_serializer_class()
