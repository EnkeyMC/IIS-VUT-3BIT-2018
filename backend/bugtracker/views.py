from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend

from .models import Ticket
from .serializers import TicketSerializer
from .filters import TicketFilter


class TicketViewSet(viewsets.ModelViewSet):
    queryset = Ticket.objects.all()
    serializer_class = TicketSerializer
    filter_backends = (filters.OrderingFilter, DjangoFilterBackend)
    filterset_class = TicketFilter
    ordering_fields = ('id', 'created')
    ordering = ('created',)
