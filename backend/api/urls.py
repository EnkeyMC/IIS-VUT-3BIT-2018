from django.urls import include, path
from rest_framework.routers import DefaultRouter
from knox import views as knox_views

from . import views as api_views

router = DefaultRouter()
router.register(r'languages', api_views.LanguageViewSet)
router.register(r'users', api_views.UserViewSet)
router.register(r'tickets', api_views.TicketViewSet)
router.register(r'modules', api_views.ModuleViewSet)
router.register(r'severities', api_views.SeverityViewSet)
router.register(r'bugs', api_views.BugViewSet)
router.register(r'patches', api_views.PatchViewset)

urlpatterns = [
    path('', include(router.urls)),
    path('api-auth/', include('rest_framework.urls')),
]
