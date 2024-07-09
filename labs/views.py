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
    marker_name = request.GET.get('marker')  # Get the marker from the query parameters
    url = f"http://127.0.0.1:8000/api/markers/"  # Replace with your API endpoint URL
    
    # Make a GET request to fetch the markers data
    try:
        response = requests.get(url)
        if response.status_code == 200:
            data = response.json()
            # Find the marker with the matching name
            marker = next((feature for feature in data['features'] if feature['properties']['name'] == marker_name), None)
            if marker:
                samples = marker['properties']['samples']
                context = {'marker': marker_name, 'samples': samples}
                return render(request, 'marker_detail.html', context)
            else:
                return render(request, 'marker_detail.html', {'marker': marker_name, 'samples': []})
        else:
            return render(request, 'marker_detail.html', {'marker': marker_name, 'samples': []})
    except requests.RequestException as e:
        print(f"Error fetching data: {e}")
        return render(request, 'marker_detail.html', {'marker': marker_name, 'samples': []})
    
def sample_detail_view(request, sample_id):
    sample_id = request.GET.get('sampleId')
    url = f"http://127.0.0.1:8000/api/samples/"
    
    try:
        response = requests.get(url)
        if response.status_code == 200:
            data = response.json()
            sample = next((samp for samp in data if samp['ID'] == sample_id), None)
            if sample:
                context = {'sample': sample}
                return render(request, 'sample_detail.html', context)
            else:
                return render(request, 'sample_detail.html', {'sample': None})
        else:
            return render(request, 'sample_detail.html', {'sample': None})
    except requests.RequestException as e:
        print(f"Error fetching data: {e}")
        return render(request, 'sample_detail.html', {'sample': None})