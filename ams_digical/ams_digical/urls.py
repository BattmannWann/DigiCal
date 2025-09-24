"""
URL configuration for ams_digical project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.contrib import admin
from django.urls import path, reverse_lazy, include
from django.conf import settings
from django.conf.urls.static import static
from digical.views import views, event_views, sso_views
from django.views.generic.base import RedirectView
from rest_framework import routers

#create a router object
router = routers.DefaultRouter()

#register routers
router.register(r'machines', views.MachineView, 'machine')
router.register(r'events', event_views.EventView, 'event')
router.register(r'staff away', event_views.StaffAwayView, 'staff away')
router.register(r'generic event', event_views.GenericEventView, 'generic event')
router.register(r'staff', views.StaffView, 'staff')
router.register(r'batches', views.BatchView, 'batches')
router.register(r'batch process', event_views.BatchProcessView, 'batch process')
router.register(r'submitter lab', views.SubmitterLabView, 'submitter lab')
router.register(r'radionuclide', views.RadionuclideView, 'radionuclide')
router.register(r'maintenance', event_views.MaintenanceView, 'maintenance')
#router.register(r'fault logging', event_views.FaultLogView, 'fault logging')


urlpatterns = [
    path('', RedirectView.as_view(url=reverse_lazy('admin:index'))),
    path('digical/', include('digical.urls')),
    path("admin/", admin.site.urls),
    path('api/', include(router.urls)),
    path('oauth2/login/', sso_views.OAuth2LoginView.as_view(), name = "oauth2_login"),
    path('oauth2/callback/', sso_views.OAuth2CallbackView.as_view(), name="oauth2_callback"),
    path('logout/', sso_views.LogoutView.as_view(), name = 'logout'),

] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

