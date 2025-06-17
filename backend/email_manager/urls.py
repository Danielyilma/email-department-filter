from django.contrib import admin
from django.urls import path, include
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView, SpectacularRedocView
from .views import (
   DepartmentListView, DepartmentCreateView,
   DepartmentEmailsView, EmailListView, DepartmentRetrieveView,
   EmailStatisticsView, EmailRetrieveView, DepartmentUpdateView
)

urlpatterns = [
   path('departments/', DepartmentListView.as_view()),
   path('departments/create/', DepartmentCreateView.as_view()),
   path('departments/update/<int:id>/', DepartmentUpdateView.as_view()),
   path('departments/<int:id>/', DepartmentEmailsView.as_view()),
   path('', EmailListView.as_view()),
   path('<int:id>/', EmailRetrieveView.as_view()),
   path('stats', EmailStatisticsView.as_view()),
]
