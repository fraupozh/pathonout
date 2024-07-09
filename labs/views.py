# labs/views.py
import os
import json

from django.shortcuts import render
from django.views.generic import TemplateView
from django.http import JsonResponse
import requests


class MarkersMapView(TemplateView):
    template_name = "map.html"


def marker_detail_view(request):
    supplier = request.GET.get('supplier')  # Get the supplier from the query parameters
    url = f"http://127.0.0.1:8000/api/markers/"  # Replace with your API endpoint URL
    
    # Make a GET request to fetch the markers data
    try:
        response = requests.get(url)
        if response.status_code == 200:
            data = response.json()
            # Find the marker with the matching supplier name
            marker = next((feature for feature in data['features'] if feature['properties']['name'] == supplier), None)
            if marker:
                isolates = marker['properties']['isolates']
                context = {'supplier': supplier, 'isolates': isolates}
                return render(request, 'marker_detail.html', context)
            else:
                return render(request, 'marker_detail.html', {'supplier': supplier, 'isolates': []})
        else:
            return render(request, 'marker_detail.html', {'supplier': supplier, 'isolates': []})
    except requests.RequestException as e:
        print(f"Error fetching data: {e}")
        return render(request, 'marker_detail.html', {'supplier': supplier, 'isolates': []})
    
def isolate_detail_view(request, isolate_id):
    isolate_id = request.GET.get('isolateId')
    url = f"http://127.0.0.1:8000/api/isolates/"
    
    try:
        response = requests.get(url)
        if response.status_code == 200:
            data = response.json()
            isolate = next((iso for iso in data if iso['ID'] == isolate_id), None)
            if isolate:
                context = {'isolate': isolate}
                return render(request, 'isolate_detail.html', context)
            else:
                return render(request, 'isolate_detail.html', {'isolate': None})
        else:
            return render(request, 'isolate_detail.html', {'isolate': None})
    except requests.RequestException as e:
        print(f"Error fetching data: {e}")
        return render(request, 'isolate_detail.html', {'isolate': None})
