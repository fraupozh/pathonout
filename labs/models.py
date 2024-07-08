from django.contrib.gis.db import models
from django.contrib.gis.geos import Point


class Marker(models.Model):
    name = models.CharField(max_length=255)
    location = models.PointField()

    def __str__(self):
        return self.name

class Isolate(models.Model):
    marker = models.ForeignKey(Marker, related_name='isolates', on_delete=models.CASCADE)
    species = models.CharField(max_length=255)
    ID = models.CharField(max_length=50)
    isolation_source = models.CharField(max_length=255)
    host_organism_environment = models.CharField(max_length=255)
    acquisition_date = models.DateField()
    analysis_date = models.DateField()
    collection_location = models.PointField() # random Leipzig coordinates =)

    def __str__(self):
        return f"{self.species} - {self.ID} ({self.marker.name})"