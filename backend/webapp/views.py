from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
import os
from rest_framework import generics, status
from rest_framework.response import Response
from .models import UploadedImage
from .serializers import ImageSerializer
from django.http import FileResponse
from django.conf import settings

from .predictions import predict_leaf

# Create your views here.

def test(request):
    if request.method == 'GET':
        data = {
            'message' : 'ok so backend works good job g',
        }
        return JsonResponse(data)

class ImageUploadView(generics.CreateAPIView):
    queryset = UploadedImage.objects.all()
    serializer_class = ImageSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            # Save the uploaded image
            instance = serializer.save()
            
            # Get the full URL to the uploaded image
            image_url = request.build_absolute_uri(instance.image.url)

            colorPred = predict_leaf(image_url, "color")
            shapePred = predict_leaf(image_url, "shape")
            texturePred = predict_leaf(image_url, "texture")

            prediction = {"color" : colorPred, "shape": shapePred, "texture": texturePred}

            print(prediction)

            return Response({
                'status': 'success',
                'image_url': image_url,
                'prediction' : prediction,
                'message': 'Image uploaded successfully'
            }, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ImageListView(generics.ListAPIView):
    queryset = UploadedImage.objects.all()
    serializer_class = ImageSerializer
