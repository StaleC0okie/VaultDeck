from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .models import CartaMazo, Mazo
from .serializers import CartaMazoSerializer, MazoSerializer


@api_view(['GET', 'POST'])
def mazos_lista(request):
    if request.method == 'GET':
        mazos = Mazo.objects.filter(usuario=request.user).order_by('-creado')
        return Response(MazoSerializer(mazos, many=True).data)

    serializer = MazoSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(usuario=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'PATCH', 'DELETE'])
def mazo_detalle(request, pk):
    mazo = get_object_or_404(Mazo, pk=pk, usuario=request.user)

    if request.method == 'GET':
        return Response(MazoSerializer(mazo).data)

    if request.method == 'DELETE':
        mazo.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    serializer = MazoSerializer(
        mazo, data=request.data, partial=(request.method == 'PATCH'))
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def mazo_cartas(request, pk):
    mazo = get_object_or_404(Mazo, pk=pk, usuario=request.user)
    serializer = CartaMazoSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    scryfall_id = serializer.validated_data['scryfall_id']
    if mazo.cartas.filter(scryfall_id=scryfall_id).exists():
        return Response({'detail': 'Esa carta ya está en el mazo.'},
                        status=status.HTTP_400_BAD_REQUEST)

    serializer.save(mazo=mazo)
    return Response(serializer.data, status=status.HTTP_201_CREATED)


@api_view(['DELETE'])
def mazo_carta_detalle(request, pk, carta_pk):
    carta = get_object_or_404(
        CartaMazo, pk=carta_pk, mazo__pk=pk, mazo__usuario=request.user)
    carta.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)