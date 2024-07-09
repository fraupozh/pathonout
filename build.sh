#!/usr/bin/env bash
set -o errexit

# Install dependencies
pip install -r requirements.txt

# Create superuser if needed
if [[ $CREATE_SUPERUSER ]]; then
    python world_champ_2022/manage.py createsuperuser --no-input
fi

# Collect static files
python manage.py collectstatic --no-input

# Apply migrations explicitly
python manage.py migrate --no-input

# Restart services if needed (optional, depends on your deployment platform)
# systemctl restart your_application_service

# Additional commands as needed
# ...

# Exit successfully
exit 0
