from django_filters import rest_framework as filters

from .models import Ticket


class TicketFilter(filters.FilterSet):
    duplicate = filters.BooleanFilter(lookup_expr='isnull', exclude=True)
    title = filters.CharFilter(lookup_expr='icontains')
    description = filters.CharFilter(lookup_expr='icontains')
    status = filters.CharFilter(lookup_expr='icontains')
    date = filters.DateFromToRangeFilter(field_name='created')

    class Meta:
        model = Ticket
        fields = ['title', 'description', 'status', 'duplicate', 'date']
