from django.urls import path

from knox.views import LogoutView, LogoutAllView

from .views import LoginView, RegisterView, LoggedInView

urlpatterns = [
    path('register/', RegisterView.as_view()),
    path('login/', LoginView.as_view()),
    path('logout/', LogoutView.as_view()),
    path('logoutall/', LogoutAllView.as_view()),
    path('logged_in/', LoggedInView.as_view()),
]
