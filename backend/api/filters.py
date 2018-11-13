from django_filters import rest_framework as filters

from bugtracker.models import Ticket, Module, Language


class TicketFilter(filters.FilterSet):
    duplicate = filters.BooleanFilter(lookup_expr='isnull', exclude=True)
    status = filters.ChoiceFilter(choices=Ticket.STATUS_CHOICES)
    date = filters.DateFromToRangeFilter(field_name='created')

    class Meta:
        model = Ticket
        fields = ['status', 'duplicate', 'date']


class ModuleFilter(filters.FilterSet):
    expert = filters.CharFilter(
        field_name='expert__username', lookup_expr='icontains')
    languages = filters.ModelMultipleChoiceFilter(
        queryset=Language.objects.all())

    class Meta:
        model = Module
        fields = ['expert', 'languages']
