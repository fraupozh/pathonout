## Overview

This application leverages Django for the backend and the Leaflet JS library for interactive maps on the frontend. It relies on the Django geographical module GeoDjango, requiring GDAL for operation. PostGIS, the PostgreSQL spatial extension, is also necessary.

## Setup Instructions

### Local Setup on Linux

To set up the application locally on a Linux machine:

1. Clone the repository to your local machine.
2. Every developer needs to create a `.env` file in the root directory of the project. This file should contain the following environmental variables:

    ```env
    SECRET_KEY=your_secret_key
    DB_NAME=your_database_name
    DB_USER=your_database_user
    DB_PASSWORD=your_database_password
    DB_HOST=your_database_host
    DB_PORT=your_database_port
    DATABASE_URL=your_database_url
    DEBUG=boolean_value
    ALLOWED_HOSTS=your_allowed_hosts
    ```

### Database Setup with Docker

To set up the database using Docker:

1. Start the Docker container for the database using `docker-compose`:

    ```bash
    docker-compose up -d
    ```

2. Ensure that the PostGIS extension is enabled in the database:

    ```bash
    docker-compose exec db psql -U $DB_USER -d $DB_NAME
    ```

3. In the PostgreSQL prompt, run the following commands:

    ```sql
    CREATE EXTENSION postgis;
    \dx
    ```

### Run the App Locally

To run the app locally using Gunicorn with UvicornWorker:

```bash
python -m gunicorn pathonout.asgi:application -k uvicorn.workers.UvicornWorker
```

### Frontend Development

For frontend developers who need to download JSON data, you can access the JSON file provided by the backend by running the application and navigating to the following URL:

[http://127.0.0.1:8000/api/markers/](http://127.0.0.1:8000/api/markers/)

This URL returns the JSON data that the backend sends to the frontend.


## Branches Overview

- **main:** This branch is used for local development and contains the latest stable version of the application.
  
- **render-stable:** Changes pushed to this branch are automatically deployed to render.com. It represents the stable version of the application available at [https://pathonout.onrender.com/labs/map/](https://pathonout.onrender.com/labs/map/).

