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

# Copy project files into the working directory
COPY . /usr/src/app/

# Run migrations and collect static files (if necessary)
# RUN python manage.py migrate
# RUN python manage.py collectstatic --no-input

# Expose port 8000 to the outside world
EXPOSE 8000

# Command to run the application
CMD ["gunicorn", "pathonout.asgi:application", "-k", "uvicorn.workers.UvicornWorker"]

