from datetime import date

from django.contrib.auth.models import User

from rest_framework import serializers, utils
from rest_framework.exceptions import PermissionDenied
from rest_framework.fields import empty

from bugtracker import models


class StrictModelSerializer(serializers.ModelSerializer):

    def validate(self, attrs):
        if not hasattr(self, 'initial_data'):
            return attrs

        known_fields = set()
        known_fields.add('csrfmiddlewaretoken')
        readonly_fields = set()
        request_fields = set(self.initial_data.keys())
        for name, field in self.fields.items():
            known_fields.add(name)
            if field.read_only:
                readonly_fields.add(name)

            if not hasattr(field, 'fields'):
                continue
            for name_nested, field_nested in field.fields.items():
                known_fields.add(name + '.' + name_nested)
                if field_nested.read_only:
                    readonly_fields.add(name + '.' + name_nested)

        perm_denied_fields = request_fields.intersection(set(readonly_fields))
        if perm_denied_fields:
            raise PermissionDenied(detail=dict.fromkeys(
                perm_denied_fields,
                'You do not have permission to modify this field.'))

        unknown_fields = request_fields - known_fields
        if unknown_fields:
            raise serializers.ValidationError(detail=dict.fromkeys(
                unknown_fields, 'Unexpected field.'))

        return attrs


class TicketListSerializer(StrictModelSerializer):
    attachment = serializers.FileField(write_only=True, allow_null=True)
    author = serializers.ReadOnlyField(source='author.username')
    description = serializers.CharField(write_only=True)

    class Meta:
        model = models.Ticket
        exclude = ('expert', 'bugs')
        read_only_fields = ('status', 'duplicate')


class TicketDetailSerializer(StrictModelSerializer):
    author = serializers.ReadOnlyField(source='author.username')
    expert = serializers.ReadOnlyField(source='expert.username')

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
    class Meta:
        model = models.Ticket
        fields = '__all__'
        read_only_fields = ('title', 'description', 'attachment', 'status')


class SupervisorTicketDetailSerializer(TicketDetailSerializer):
    expert = serializers.SlugRelatedField(
        slug_field='username', allow_null=True, queryset=User.objects.all()
    )

    class Meta:
        model = models.Ticket
        fields = '__all__'
        read_only_fields = ('title', 'description', 'attachment', 'status')


class UserListSerializer(StrictModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'first_name', 'last_name')


class ProfileSerializer(StrictModelSerializer):
    languages = serializers.SlugRelatedField(
        slug_field='name', queryset=models.Language.objects.all(),
        many=True, required=False)
    position = serializers.ChoiceField(
        choices=models.Profile.USER_TYPES,
        read_only=True, required=False, source='user_type'
    )

    def validate_birth_date(self, birth_date):
        minimum_age = 15
        if birth_date.year + minimum_age > date.today().year:
            raise serializers.ValidationError(detail=(
                'The minimum age requirement for '
                'this site is {} years old.').format(minimum_age))
        return birth_date

    class Meta:
        model = models.Profile
        fields = ('birth_date', 'languages', 'position')


class SupervisorProfileSerializer(ProfileSerializer):
    position = serializers.ChoiceField(
        choices=models.Profile.USER_TYPES, required=False, source='user_type')

    class Meta:
        model = models.Profile
        fields = ('birth_date', 'languages', 'position')


class UserDetailSerializer(StrictModelSerializer):
    profile = ProfileSerializer()
    last_login = serializers.DateTimeField(read_only=True)
    date_joined = serializers.DateTimeField(read_only=True, format='%Y-%m-%d')

    class Meta:
        model = User
        fields = ('id', 'username', 'first_name', 'last_name', 'email',
                  'last_login', 'date_joined', 'profile')

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


class SupervisorUserDetailSerializer(UserDetailSerializer):
    profile = SupervisorProfileSerializer()

    class Meta:
        model = User
        fields = ('id', 'username', 'first_name', 'last_name', 'email',
                  'last_login', 'date_joined', 'profile', 'is_active')


class LanguageSerializer(StrictModelSerializer):
    class Meta:
        model = models.Language
        fields = ('id', 'name')


class ModuleSerializer(StrictModelSerializer):
    expert = serializers.SlugRelatedField(
        slug_field='username', allow_null=True, queryset=User.objects.all())
    languages = serializers.SlugRelatedField(
        slug_field='name', many=True, queryset=models.Language.objects.all())
    bugs = serializers.PrimaryKeyRelatedField(many=True, read_only=True)

    class Meta:
        model = models.Module
        fields = '__all__'


class SeveritySerializer(StrictModelSerializer):
    class Meta:
        model = models.Severity
        fields = '__all__'


class BugPOSTSerializer(StrictModelSerializer):
    author = serializers.ReadOnlyField(source='author.username')
    tickets = serializers.PrimaryKeyRelatedField(
            many=True, queryset=models.Ticket.objects.all())
    patch = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = models.Bug
        fields = '__all__'


class ModuleInsideBugSerializer(StrictModelSerializer):
    class Meta:
        model = models.Module
        fields = ('id', 'name')


class BugGETSerializer(BugPOSTSerializer):
    severity = SeveritySerializer()
    module = ModuleInsideBugSerializer()

    class Meta:
        model = models.Bug
        fields = '__all__'


class PatchPOSTSerializer(StrictModelSerializer):
    author = serializers.ReadOnlyField(source='author.username')
    bugs = serializers.PrimaryKeyRelatedField(
            many=True, queryset=models.Bug.objects.all())

    class Meta:
        model = models.Patch
        fields = '__all__'


class PatchGETSerializer(PatchPOSTSerializer):
    bugs = BugGETSerializer(many=True)

    class Meta:
        model = models.Patch
        fields = '__all__'
