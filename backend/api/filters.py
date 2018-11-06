from django_filters import rest_framework as filters

from bugtracker.models import Ticket


class TicketFilter(filters.FilterSet):
    duplicate = filters.BooleanFilter(lookup_expr='isnull', exclude=True)
    status = filters.ChoiceFilter(choices=Ticket.STATUS_CHOICES)
    date = filters.DateFromToRangeFilter(field_name='created')

    class Meta:
        model = Ticket
        fields = ['status', 'duplicate', 'date']
