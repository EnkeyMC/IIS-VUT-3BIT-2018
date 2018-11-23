from django_filters import rest_framework as filters

from bugtracker.models import Ticket, Module, Language, Patch, Bug


class TicketFilter(filters.FilterSet):
    username = filters.CharFilter(field_name='author__username')
    expert = filters.CharFilter(field_name='expert__username')
    duplicate = filters.BooleanFilter(lookup_expr='isnull', exclude=True)
    status = filters.ChoiceFilter(choices=Ticket.STATUS_CHOICES)
    date = filters.DateFromToRangeFilter(field_name='created')

    class Meta:
        model = Ticket
        fields = ['status', 'duplicate', 'date', 'expert', 'username']


class ModuleFilter(filters.FilterSet):
    expert = filters.CharFilter(field_name='expert__username')
    languages = filters.ModelMultipleChoiceFilter(
        queryset=Language.objects.all(),
        field_name='languages__name', to_field_name='name',
    )

    class Meta:
        model = Module
        fields = ['expert', 'languages']


class LanguageFilter(filters.FilterSet):
    language = filters.CharFilter(field_name='name', lookup_expr='iexact')

    class Meta:
        model = Language
        fields = ['language']


class PatchFilter(filters.FilterSet):
    status = filters.ChoiceFilter(choices=Patch.STATUS_CHOICES)
    username = filters.CharFilter(field_name='author__username')
    applied = filters.BooleanFilter(
        field_name='date_released', lookup_expr='isnull', exclude=True)
    date_released = filters.DateFromToRangeFilter()
    date_applied = filters.DateFromToRangeFilter()

    class Meta:
        model = Patch
        fields = [
            'status', 'username', 'applied', 'date_released', 'date_applied'
        ]


class BugFilter(filters.FilterSet):
    username = filters.CharFilter(field_name='author__username')

    class Meta:
        model = Bug
        fields = ['username']
