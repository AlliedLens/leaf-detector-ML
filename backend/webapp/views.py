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
import cv2

# Create your views here.

storedData = {}

def test(request):
    if request.method == 'GET':
        data = {
            'message' : 'ok so backend works good job g',
        }
        return JsonResponse(data)
    
def getimageurl(request):
    if request.method == 'GET':
        data = {
            'imgurl' : f"{storedData['imgurl']}"
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
            
            # Store the URL in your storedData if needed
            global storedData
            storedData['imgurl'] = image_url
            
            return Response({
                'status': 'success',
                'image_url': image_url,
                'message': 'Image uploaded successfully'
            }, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ImageListView(generics.ListAPIView):
    queryset = UploadedImage.objects.all()
    serializer_class = ImageSerializer

@csrf_exempt
def sendimageurl(request):
    global storedData
    if request.method == 'POST':
        try:
                
            data = json.loads(request.body)
            imgurl = data.get('imgurl')
            storedData['imgurl'] = imgurl
            print(f"Received image path: {imgurl}")
            
            return JsonResponse({
                "message": f"Received {imgurl}",
                "received_path": imgurl
            }, status=200)
        
        except Exception as e:
            return JsonResponse({"msg": f"Server error: {str(e)}"}, status=500)
   