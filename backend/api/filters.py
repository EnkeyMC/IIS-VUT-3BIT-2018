from django.contrib.auth.models import User

from django_filters import rest_framework as filters

from bugtracker import models


class TicketFilter(filters.FilterSet):
    username = filters.CharFilter(field_name='author__username')
    expert = filters.CharFilter(field_name='expert__username')
    duplicate = filters.BooleanFilter(lookup_expr='isnull', exclude=True)
    status = filters.ChoiceFilter(choices=models.Ticket.STATUS_CHOICES)
    date = filters.DateFromToRangeFilter(field_name='created')

    class Meta:
        model = models.Ticket
        fields = ['status', 'duplicate', 'date', 'expert', 'username']


class ModuleFilter(filters.FilterSet):
    expert = filters.CharFilter(field_name='expert__username')
    languages = filters.ModelMultipleChoiceFilter(
        queryset=models.Language.objects.all(),
        field_name='languages__name', to_field_name='name',
    )

    class Meta:
        model = models.Module
        fields = ['expert', 'languages']


class LanguageFilter(filters.FilterSet):
    language = filters.CharFilter(field_name='name', lookup_expr='iexact')

    class Meta:
        model = models.Language
        fields = ['language']


class PatchFilter(filters.FilterSet):
    status = filters.ChoiceFilter(choices=models.Patch.STATUS_CHOICES)
    username = filters.CharFilter(field_name='author__username')
    date_created = filters.DateFromToRangeFilter()
    date_released = filters.DateFromToRangeFilter()
    module = filters.ModelChoiceFilter(
        queryset=models.Module.objects.all(), field_name='bugs__module')

    class Meta:
        model = models.Patch
        fields = [
            'status', 'username', 'date_created', 'date_released', 'module'
        ]


class BugFilter(filters.FilterSet):
    username = filters.CharFilter(field_name='author__username')
    date = filters.DateFromToRangeFilter(field_name='created')
    has_patch = filters.BooleanFilter(
        field_name='patch', lookup_expr='isnull', exclude=True)
    module = filters.ModelChoiceFilter(queryset=models.Module.objects.all())
    severity = filters.ModelMultipleChoiceFilter(
        queryset=models.Severity.objects.all())

    class Meta:
        model = models.Bug
        fields = ['username', 'date', 'has_patch',
                  'module', 'vulnerability', 'severity']


class UserFilter(filters.FilterSet):
    position = filters.MultipleChoiceFilter(
        choices=models.Profile.USER_TYPES,
        field_name='profile__position',
        label='Position'
    )

    class Meta:
        model = User
        fields = ['username', 'position']
