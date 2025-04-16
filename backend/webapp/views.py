from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
import os
from rest_framework import generics
from .models import UploadedImage
from .serializers import ImageSerializer
from django.http import FileResponse
from django.conf import settings
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
   