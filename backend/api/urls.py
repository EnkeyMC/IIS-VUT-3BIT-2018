from django.urls import include, path

from . import views

urlpatterns = [
    path('api-auth/', include('rest_framework.urls')),
    path('tickets/', views.TicketList.as_view()),
    path('tickets/<int:pk>/', views.TicketDetail.as_view()),
]
