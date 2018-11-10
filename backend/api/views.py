from django.contrib.auth import login
from django.contrib.auth.models import User

from rest_framework import generics, permissions, mixins, viewsets
from rest_framework.filters import OrderingFilter, SearchFilter
from rest_framework.response import Response
from rest_framework.authtoken.serializers import AuthTokenSerializer

from django_filters.rest_framework import DjangoFilterBackend

from knox.models import AuthToken
from knox.views import LoginView as KnoxLoginView


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
        if self.action == 'list':
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


class LoginView(KnoxLoginView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request, format=None):
        serializer = AuthTokenSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        login(request, user)
        return super().post(request, format=None)


class RegisterView(generics.GenericAPIView):
    serializer_class = serializers.CreateUserSerializer
    permission_classes = (permissions.AllowAny,)

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response({
            'user': serializers.UserLoginSerializer(
                user, context=self.get_serializer_context()).data,
            'token': AuthToken.objects.create(user),
        })


class LanguageViewSet(viewsets.ModelViewSet):
    serializer_class = serializers.LanguageSerializer
    queryset = models.Language.objects.all()
    permission_classes = (permissions.IsAuthenticatedOrReadOnly,
                          IsStaffOrReadOnly)
    filter_backends = (OrderingFilter, SearchFilter)
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
    filter_backends = (OrderingFilter, SearchFilter)
    ordering_fields = ('id', 'username', 'first_name', 'last_name')
    ordering = ('id',)
    search_fields = ('username', 'first_name', 'last_name')

    def get_serializer_class(self):
        if self.action == 'list':
            return serializers.UserListSerializer
        return serializers.UserDetailSerializer
