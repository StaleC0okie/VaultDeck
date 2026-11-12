from rest_framework import serializers

from .models import CartaMazo, Mazo

FORMATOS_VALIDOS = ['commander']


class CartaMazoSerializer(serializers.ModelSerializer):
    class Meta:
        model = CartaMazo
        fields = ['id', 'scryfall_id', 'nombre', 'imagen', 'cantidad']

    def validate_cantidad(self, value):
        if value < 1:
            raise serializers.ValidationError(
                'La cantidad debe ser al menos 1.')
        return value


class MazoSerializer(serializers.ModelSerializer):
    cartas = CartaMazoSerializer(many=True, read_only=True)

    class Meta:
        model = Mazo
        fields = ['id', 'nombre', 'formato', 'descripcion', 'creado', 'cartas']
        read_only_fields = ['id', 'creado']

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