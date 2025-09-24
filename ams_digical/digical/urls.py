from django.urls import path
from digical.views.sso_views import RegisterView, LoginView, LogoutView, EditProfileView, MicrosoftUserInfoView, DigicalUserInfoView

app_name = 'digical'

urlpatterns = [
     #separated these to show the bare django urls and the api views for django-react
     path('api/register/', RegisterView.as_view(), name = 'register'),
     path('api/edit-profile/', EditProfileView.as_view(), name = "profile_edit"),
     path('api/user/', MicrosoftUserInfoView.as_view(), name='user-info'),
     path('api/digical-user/', DigicalUserInfoView.as_view(), name = "digical-user-info"),
     path('api/digical-login/', LoginView.as_view(), name = 'digical-login'),
]
