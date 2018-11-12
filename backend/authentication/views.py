from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.authtoken.serializers import AuthTokenSerializer

from knox.models import AuthToken

from .serializers import UserLoginSerializer, CreateUserSerializer


class LoginView(APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request, format=None):
        serializer = AuthTokenSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        context = {'request': self.request, 'view': self}
        return Response({
            'user': UserLoginSerializer(user, context=context).data,
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
