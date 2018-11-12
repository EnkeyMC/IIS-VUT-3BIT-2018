from rest_framework import generics, permissions
from rest_framework.response import Response

from knox.models import AuthToken

from .serializers import (LoginSerializer,
                          UserLoginSerializer,
                          CreateUserSerializer)


class LoginView(generics.GenericAPIView):
    permission_classes = (permissions.AllowAny,)
    serializer_class = LoginSerializer

    def post(self, request, format=None):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data
        return Response({
            'user': UserLoginSerializer(
                user,
                context=self.get_serializer_context()).data,
            'token': AuthToken.objects.create(user),
        })


class RegisterView(generics.GenericAPIView):
    serializer_class = CreateUserSerializer
    permission_classes = (permissions.AllowAny,)

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response({
            'user': UserLoginSerializer(
                user,
                context=self.get_serializer_context()).data,
            'token': AuthToken.objects.create(user),
        })
