from django.urls import include, path
from rest_framework.routers import DefaultRouter
from knox import views as knox_views

from . import views as api_views

router = DefaultRouter()
router.register(r'languages', api_views.LanguageViewSet)
router.register(r'users', api_views.UserViewSet)
router.register(r'tickets', api_views.TicketViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('api-auth/', include('rest_framework.urls')),
    path('auth/register/', api_views.RegisterView.as_view()),
    path('auth/login/', api_views.LoginView.as_view()),
    path('auth/logout/', knox_views.LogoutView.as_view()),
]
