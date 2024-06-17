# Use an official Python runtime as a parent image
FROM python:3.11.4-slim-buster

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Set the working directory in the container
WORKDIR /usr/src/app

# Install system dependencies
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        gdal-bin \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY ./requirements.txt /usr/src/app/
RUN pip install --upgrade pip \
    && pip install -r requirements.txt

# Copy project files into the container
COPY . .

# Create the staticfiles directory and set permissions
RUN mkdir -p /usr/src/app/staticfiles
RUN chmod -R 755 /usr/src/app/staticfiles

# Run collectstatic during build
RUN python manage.py collectstatic --noinput

# Define the command to run your application
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
