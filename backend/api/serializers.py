from datetime import date

from django.contrib.auth.models import User

from rest_framework import serializers, utils
from rest_framework.exceptions import PermissionDenied

from bugtracker import models


class StrictModelSerializer(serializers.ModelSerializer):

    def validate(self, attrs):
        if not hasattr(self, 'initial_data'):
            return attrs

        known_fields = set(self.fields.keys())
        writable_fields = set(f.field_name for f in self._writable_fields)
        readonly_fields = known_fields - writable_fields
        request_fields = set(self.initial_data.keys())

        perm_denied_fields = request_fields.intersection(readonly_fields)
        if perm_denied_fields:
            raise PermissionDenied(detail=dict.fromkeys(
                perm_denied_fields,
                'You do not have permission to modify this field.'))

        known_fields.add('csrfmiddlewaretoken')
        unknown_fields = request_fields - known_fields
        if unknown_fields:
            raise serializers.ValidationError(detail=dict.fromkeys(
                unknown_fields, 'Unexpected field.'))

        return attrs


class TicketListSerializer(StrictModelSerializer):
    author = serializers.ReadOnlyField(source='author.username')
    expert = serializers.ReadOnlyField(source='expert.username', default=None)
    status = serializers.ReadOnlyField()

    class Meta:
        model = models.Ticket
        exclude = ('bugs',)
        read_only_fields = ('status', 'duplicate')
        extra_kwargs = {
            'description': {'write_only': True},
            'attachment': {'write_only': True,
                           'required': False,
                           'allow_empty_file': False}
        }


class UserTicketDetailSerializer(TicketListSerializer):
    attachment = serializers.FileField(
        required=False, default=None, allow_empty_file=False)

    class Meta:
        model = models.Ticket
        fields = '__all__'
        read_only_fields = ('duplicate', 'bugs')


class ProgrammerTicketDetailSerializer(TicketListSerializer):
    class Meta:
        model = models.Ticket
        fields = '__all__'
        read_only_fields = ('title', 'description', 'attachment')


class ProgrammerTicketOwnerSerializer(UserTicketDetailSerializer):
    class Meta:
        model = models.Ticket
        fields = '__all__'


class SupervisorTicketDetailSerializer(UserTicketDetailSerializer):
    expert = serializers.SlugRelatedField(
        slug_field='username', allow_null=True, queryset=User.objects.all()
    )

    class Meta:
        model = models.Ticket
        fields = '__all__'


class UserListSerializer(StrictModelSerializer):
    position = serializers.ReadOnlyField(source='profile.position')

    class Meta:
        model = User
        fields = (
            'id',
            'username',
            'first_name',
            'last_name',
            'is_active',
            'position'
        )


class UserDetailSerializer(StrictModelSerializer):
    email = serializers.EmailField(allow_blank=False)
    languages = serializers.SlugRelatedField(
        many=True, slug_field='name', source='profile.languages',
        queryset=models.Language.objects.all())
    birth_date = serializers.DateField(source='profile.birth_date')
    last_login = serializers.DateTimeField(read_only=True)
    date_joined = serializers.DateTimeField(read_only=True, format='%Y-%m-%d')
    position = serializers.ChoiceField(
        choices=models.Profile.USER_TYPES, source='profile.position',
        read_only=True, required=False)

    class Meta:
        model = User
        exclude = ('password', 'groups', 'user_permissions',
                   'is_staff', 'is_superuser')
        read_only_fields = ('is_active')

    def validate_birth_date(self, birth_date):
        minimum_age = 15
        if birth_date.year + minimum_age > date.today().year:
            raise serializers.ValidationError(detail=(
                'The minimum age requirement for '
                'this site is {} years old.').format(minimum_age))
        return birth_date

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
    position = serializers.ChoiceField(
        choices=models.Profile.USER_TYPES, source='profile.position',
        required=False)

    class Meta:
        model = User
        exclude = UserDetailSerializer.Meta.exclude


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
