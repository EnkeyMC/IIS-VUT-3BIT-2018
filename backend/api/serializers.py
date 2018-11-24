from datetime import date

from django.contrib.auth.models import User
from rest_framework import serializers, utils

from bugtracker import models


class TicketListSerializer(serializers.ModelSerializer):
    attachment = serializers.FileField(write_only=True, allow_null=True)
    author = serializers.ReadOnlyField(source='author.username')
    description = serializers.CharField(write_only=True)

    class Meta:
        model = models.Ticket
        exclude = ('expert', 'bugs')
        read_only_fields = ('status', 'duplicate')
        extra_kwargs = {
            'created': {'format': '%Y-%m-%d, %H:%M'},
        }


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


class UserListSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'first_name', 'last_name')


class ProfileSerializer(serializers.ModelSerializer):
    languages = serializers.SlugRelatedField(
        slug_field='name', many=True, queryset=models.Language.objects.all())

    def validate_birth_date(self, birth_date):
        minimum_age = 15
        if birth_date.year + minimum_age > date.today().year:
            raise serializers.ValidationError((
                'The minimum age requirement for '
                'this site is {} years old.').format(minimum_age))
        return birth_date

    class Meta:
        model = models.Profile
        fields = ('birth_date', 'languages')


class UserDetailSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer()

    class Meta:
        model = User
        fields = ('id', 'username', 'first_name', 'last_name', 'email',
                  'last_login', 'date_joined', 'profile')
        extra_kwargs = {
            'email': {'read_only': True},
            'last_login': {'read_only': True, 'format': '%Y-%m-%d, %H:%M'},
            'date_joined': {'read_only': True, 'format': '%Y-%m-%d'}
        }

    def update(self, instance, validated_data):
        if validated_data.get('profile', False):
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


class ModuleSerializer(serializers.ModelSerializer):
    expert = serializers.SlugRelatedField(
        slug_field='username', allow_null=True, queryset=User.objects.all())
    languages = serializers.SlugRelatedField(
        slug_field='name', many=True, queryset=models.Language.objects.all())
    bugs = serializers.PrimaryKeyRelatedField(many=True, read_only=True)

    class Meta:
        model = models.Module
        fields = '__all__'


class SeveritySerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Severity
        fields = '__all__'


class BugSerializer(serializers.ModelSerializer):
    author = serializers.ReadOnlyField(source='author.username')
    tickets = serializers.PrimaryKeyRelatedField(
            many=True, queryset=models.Ticket.objects.all())

    class Meta:
        model = models.Bug
        fields = '__all__'
        extra_kwargs = {
            'created': {'format': '%Y-%m-%d, %H:%M'},
            'patch': {'read_only': True},
        }


class PatchSerializer(serializers.ModelSerializer):
    author = serializers.ReadOnlyField(source='author.username')
    bugs = serializers.PrimaryKeyRelatedField(
            many=True, queryset=models.Bug.objects.all())

    class Meta:
        model = models.Patch
        fields = '__all__'
        extra_kwargs = {
            'date_released': {'format': '%Y-%m-%d, %H:%M'},
            'date_applied': {'format': '%Y-%m-%d, %H:%M'},
        }
