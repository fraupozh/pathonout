# Generated by Django 5.0.6 on 2024-07-07 13:32

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('labs', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Isolate',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('species', models.CharField(max_length=255)),
                ('ID', models.CharField(max_length=50)),
                ('isolation_source', models.CharField(max_length=255)),
                ('host_organism_environment', models.CharField(max_length=255)),
                ('supplier', models.CharField(max_length=255)),
                ('acquisition_date', models.DateField()),
                ('analysis_date', models.DateField()),
                ('marker', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='isolates', to='labs.marker')),
            ],
        ),
    ]
