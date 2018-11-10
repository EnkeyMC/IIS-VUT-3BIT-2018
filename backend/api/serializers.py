from django.contrib.auth.models import User
from rest_framework import serializers, utils
from rest_framework.validators import UniqueValidator

from bugtracker import models


class TicketListSerializer(serializers.ModelSerializer):
    attachment = serializers.FileField(write_only=True, allow_null=True)
    author = serializers.ReadOnlyField(source='author.username')
    description = serializers.CharField(write_only=True)

    class Meta:
        model = models.Ticket
        exclude = ('expert', 'bugs')
        read_only_fields = ('status', 'duplicate')


class TicketDetailSerializer(serializers.ModelSerializer):
    author = serializers.ReadOnlyField(source='author.username')
    expert = serializers.SlugRelatedField(
        slug_field='username', read_only=True
    )

    class Meta:
        model = models.Ticket
        fields = '__all__'


class UserTicketDetailSerializer(TicketDetailSerializer):
    attachment = serializers.FileField(allow_null=True)

    class Meta:
        model = models.Ticket
        fields = '__all__'
        read_only_fields = ('bugs', 'status', 'duplicate')


class ProgrammerTicketDetailSerializer(TicketDetailSerializer):
    status = serializers.ChoiceField(choices=models.Ticket.STATUS_CHOICES)

    class Meta:
        model = models.Ticket
        fields = '__all__'
        read_only_fields = ('title', 'description', 'attachment', 'bugs')


class SupervisorTicketDetailSerializer(TicketDetailSerializer):
    expert = serializers.SlugRelatedField(
        slug_field='username', allow_null=True, queryset=User.objects.all()
    )

    class Meta:
        model = models.Ticket
        fields = '__all__'
        read_only_fields = (
            'title', 'description', 'attachment', 'status', 'duplicate', 'bugs'
        )


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


class UserListSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'first_name', 'last_name')


class ProfileSerializer(serializers.ModelSerializer):
    languages = serializers.SlugRelatedField(
        slug_field='name', many=True, queryset=models.Language.objects.all())

    class Meta:
        model = models.Profile
        fields = ('birth_date', 'languages')


class UserDetailSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer()

    class Meta:
        model = User
        fields = ('id', 'username', 'first_name', 'last_name', 'email',
                  'date_joined', 'profile')
        extra_kwargs = {'email': {'read_only': True},
                        'date_joined': {'read_only': True}}

    def update(self, instance, validated_data):
        profile_data = validated_data.pop('profile')
        info = utils.model_meta.get_field_info(instance.profile)

        for attr, value in profile_data.items():
            if attr in info.relations and info.relations[attr].to_many:
                field = getattr(instance.profile, attr)
                field.set(value)
            else:
                setattr(instance.profile, attr, value)
        return super().update(instance, validated_data)


class LanguageSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Language
        fields = ('id', 'name')
