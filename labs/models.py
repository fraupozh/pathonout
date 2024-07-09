from django.contrib.gis.db import models
from django.contrib.gis.geos import Point


class Marker(models.Model):
    name = models.CharField(max_length=255)
    location = models.PointField()

    def __str__(self):
        return self.name

class Sample(models.Model):
    marker = models.ForeignKey(Marker, related_name='samples', on_delete=models.CASCADE)
    #species = models.CharField(max_length=255)
    ID = models.CharField(max_length=50)
    sample_type = models.CharField(max_length=255)
    #host_organism_environment = models.CharField(max_length=255)
    acquisition_date = models.DateField()
    sampling_date = models.DateField()
    collection_location = models.PointField(8.4374112043276952, 49.473407465381484) # random Europe coordinates =)

    def __str__(self):
        return f"{self.sample_type} - {self.ID} ({self.marker.name})"
