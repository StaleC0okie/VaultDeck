from django.urls import path

from . import views

urlpatterns = [
    path('mazos/', views.mazos_lista, name='mazos-lista'),
    path('mazos/<int:pk>/', views.mazo_detalle, name='mazo-detalle'),
    path('mazos/<int:pk>/cartas/', views.mazo_cartas, name='mazo-cartas'),
    path('mazos/<int:pk>/cartas/<int:carta_pk>/',
        views.mazo_carta_detalle, name='mazo-carta-detalle'),
]