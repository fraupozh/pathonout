# Generated by Django 5.0.6 on 2024-07-07 16:25

import django.contrib.gis.db.models.fields
import django.contrib.gis.geos.point
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("labs", "0003_isolate_delete_isolateorigin"),
    ]

    operations = [
        migrations.AddField(
            model_name="isolate",
            name="collection_location",
            field=django.contrib.gis.db.models.fields.PointField(
                default=django.contrib.gis.geos.point.Point(
                    12.29930390893049, 51.2893266723523
                ),
                srid=4326,
            ),
        ),
    ]
