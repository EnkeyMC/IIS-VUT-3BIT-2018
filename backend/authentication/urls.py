from django.urls import re_path

from knox.views import LogoutView, LogoutAllView

from .views import LoginView, RegisterView, LoggedInView

urlpatterns = [
    re_path(r'^register/?', RegisterView.as_view()),
    re_path(r'^login/?', LoginView.as_view()),
    re_path(r'^logout/?', LogoutView.as_view()),
    re_path(r'^logoutall/?', LogoutAllView.as_view()),
    re_path(r'^logged_in/?', LoggedInView.as_view()),
]
