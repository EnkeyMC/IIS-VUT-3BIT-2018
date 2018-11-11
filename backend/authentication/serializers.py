from django.contrib.auth.models import User

from rest_framework import serializers
from rest_framework.validators import UniqueValidator


class CreateUserSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(
        validators=[UniqueValidator(
            queryset=User.objects.all(),
            message='An account with this email address already exists.')
        ]
    )

    class Meta:
        model = User
        fields = ('email', 'username', 'password')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User(
            username=validated_data['username'],
            email=validated_data['email']
        )
        user.set_password(validated_data['password'])
        user.save()
        return user


class UserLoginSerializer(serializers.ModelSerializer):
    user_type = serializers.ReadOnlyField(source='profile.user_type')

    class Meta:
        model = User
        fields = ('id', 'username', 'user_type')
