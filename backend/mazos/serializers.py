from django.db.models import Sum
from rest_framework import serializers

from .models import CartaMazo, Mazo

FORMATOS_VALIDOS = ['commander']
LIMITE_MAZO = 100 
NOMBRES_COLOR = {'W': 'blanco', 'U': 'azul', 'B': 'negro', 'R': 'rojo', 'G': 'verde'}


def texto_colores(colores):
    return ', '.join(NOMBRES_COLOR.get(c, c) for c in colores) or 'incoloro'


class CartaMazoSerializer(serializers.ModelSerializer):
    class Meta:
        model = CartaMazo
        fields = ['id', 'scryfall_id', 'nombre', 'imagen', 'cantidad',
                  'es_basica', 'color_identity']

    def validate_cantidad(self, value):
        if value < 1:
            raise serializers.ValidationError('La cantidad debe ser al menos 1.')
        return value

    def validate(self, datos):
        mazo = self.context['mazo']
        es_basica = datos.get('es_basica', self.instance.es_basica if self.instance else False)
        cantidad = datos.get('cantidad', self.instance.cantidad if self.instance else 1)

        if not es_basica and cantidad > 1:
            raise serializers.ValidationError(
                'Solo las tierras básicas pueden repetirse.')

        if mazo.comandante_scryfall_id:
            fuera = [c for c in datos.get('color_identity', [])
                     if c not in mazo.comandante_colores]
            if fuera:
                raise serializers.ValidationError(
                    'Esta carta tiene colores que no están en la identidad de tu '
                    f'comandante ({texto_colores(mazo.comandante_colores)}).')

        comandante = 1 if mazo.comandante_scryfall_id else 0
        otras = mazo.cartas.exclude(pk=self.instance.pk) if self.instance else mazo.cartas.all()
        total = (otras.aggregate(t=Sum('cantidad'))['t'] or 0) + cantidad + comandante
        if total > LIMITE_MAZO:
            raise serializers.ValidationError(
                f'El mazo no puede superar las {LIMITE_MAZO} cartas.')
        return datos


class MazoSerializer(serializers.ModelSerializer):
    cartas = CartaMazoSerializer(many=True, read_only=True)

    class Meta:
        model = Mazo
        fields = ['id', 'nombre', 'formato', 'descripcion', 'creado', 'cartas',
                  'comandante_scryfall_id', 'comandante_nombre',
                  'comandante_imagen', 'comandante_colores']
        read_only_fields = ['id', 'creado']
        extra_kwargs = {
            'comandante_scryfall_id': {'required': True, 'allow_null': False, 'allow_blank': False},
            'comandante_nombre': {'required': True, 'allow_null': False, 'allow_blank': False},
            'comandante_imagen': {'required': False},
            'comandante_colores': {'required': True},
        }

    def validate_nombre(self, value):
        if len(value) < 3:
            raise serializers.ValidationError(
                'El nombre debe tener al menos 3 caracteres.')
        return value

    def validate_formato(self, value):
        value = value.lower()
        if value not in FORMATOS_VALIDOS:
            raise serializers.ValidationError(
                'Formato no válido. Opciones: ' + ', '.join(FORMATOS_VALIDOS))
        return value

    def validate_comandante_colores(self, value):
        if not isinstance(value, list) or any(c not in NOMBRES_COLOR for c in value):
            raise serializers.ValidationError('Colores no válidos. Usa W, U, B, R o G.')
        return value