from django.conf import settings
from django.db import models


class Mazo(models.Model):
    usuario = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='mazos')
    nombre = models.CharField(max_length=100)
    formato = models.CharField(max_length=30, default='commander')
    descripcion = models.TextField(blank=True)
    creado = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.nombre


class CartaMazo(models.Model):
    mazo = models.ForeignKey(
        Mazo, on_delete=models.CASCADE, related_name='cartas')
    scryfall_id = models.CharField(max_length=36)
    nombre = models.CharField(max_length=200)
    imagen = models.URLField(max_length=500, blank=True)
    cantidad = models.PositiveIntegerField(default=1)

    def __str__(self):
        return f'{self.cantidad}x {self.nombre}'