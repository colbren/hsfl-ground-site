from django.urls import path
from . import views

urlpatterns = [

    path(
        "scheduled-passes/",
        views.remote_scheduled_passes,
    ),

]