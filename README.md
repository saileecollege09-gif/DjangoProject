# Django Project for Render Deployment

A production-ready Django project configured for free deployment on [Render](https://render.com).

## Features

- Python 3.11
- Django 5.x (latest)
- Gunicorn as WSGI server
- WhiteNoise for static files
- Production-ready settings
- Simple "Hello World" homepage

## Project Structure

```
django_render_deploy/
├── mysite/                 # Django project directory
│   ├── __init__.py
│   ├── settings.py        # Production settings
│   ├── urls.py            # URL routing
│   └── wsgi.py           # WSGI configuration
├── myapp/                 # Django application
│   ├── __init__.py
│   ├── views.py          # Hello World view
│   └── urls.py           # App URL patterns
├── templates/
│   └── home.html         # Homepage template
├── manage.py             # Django management script
├── requirements.txt      # Python dependencies
├── Procfile              # Render deployment command
├── runtime.txt           # Python version
└── README.md            # This file
```

---

## Commands

### 1. Create the Django Project (From Scratch)

If you need to create a new project from scratch, run:

```bash
# Navigate to your workspace
cd C:/Users/ADMIN/Desktop

# Create virtual environment (recommended)
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On Mac/Linux:
source venv/bin/activate

# Install Django
pip install django

# Create new Django project
django-admin startproject mysite

# Create new app
cd mysite
python manage.py startapp myapp

# Test locally
python manage.py runserver
```

### 2. Run Locally

```bash
# Activate virtual environment
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run migrations (if you have models)
python manage.py migrate

# Run the development server
python manage.py runserver

# Or run with production-like settings
DEBUG=True ALLOWED_HOSTS=localhost,127.0.0.1 python manage.py runserver
```

The app will be available at: http://127.0.0.1:8000

### 3. Push to GitHub

```bash
# Initialize git repository (if not already initialized)
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Django project for Render deployment"

# Create a new repository on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### 4. Deploy on Render

#### Option A: Deploy via GitHub (Recommended)

1. **Push your code to GitHub** ( above)

2. **Create a Render Account**
   - Go tosee step 3 [render.com](https://render.com)
   - Sign up with GitHub

3. **Create a New Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Configure the following:
     - **Name**: your-app-name
     - **Environment**: Python
     - **Build Command**: `pip install -r requirements.txt`
     - **Start Command**: `gunicorn mysite.wsgi --bind 0.0.0.0:$PORT`

4. **Environment Variables**
   - Add the following environment variables:
     - `PYTHON_VERSION`: `3.11.0`
     - `DEBUG`: `False`
     - `ALLOWED_HOSTS`: `your-app-name.onrender.com`

5. **Deploy**
   - Click "Create Web Service"
   - Wait for build to complete
   - Your app will be live at `https://your-app-name.onrender.com`

#### Option B: Deploy via render.yaml

Create a `render.yaml` file:

```yaml
services:
  - type: web
    name: django-app
    env: python
    buildCommand: pip install -r requirements.txt
    startCommand: gunicorn mysite.wsgi --bind 0.0.0.0:$PORT
    envVars:
      - key: PYTHON_VERSION
        value: 3.11.0
      - key: DEBUG
        value: False
```

Then deploy from Render dashboard using this YAML file.

---

## Configuration Details

### settings.py

Key production settings configured:

- **DEBUG**: Set to `False` in production via environment variable
- **ALLOWED_HOSTS**: Configurable via `ALLOWED_HOSTS` environment variable
- **Static Files**: Using WhiteNoise for efficient static file serving
- **STATIC_ROOT**: Points to `staticfiles` directory for `collectstatic`

### Procfile

```
web: gunicorn mysite.wsgi --bind 0.0.0.0:$PORT
```

- Uses Gunicorn as the WSGI server
- Binds to all interfaces (`0.0.0.0`)
- Uses Render's `$PORT` environment variable

### requirements.txt

```
Django>=5.0,<6.0
gunicorn>=23.0.0
whitenoise>=6.0.0
```

---

## Troubleshooting

### Debug Mode

To test with production settings locally:

```bash
DEBUG=False ALLOWED_HOSTS=localhost,127.0.0.1 gunicorn mysite.wsgi --bind 0.0.0.0:8000
```

### Static Files

Collect static files:

```bash
python manage.py collectstatic
```

### Database Issues

If using SQLite, ensure the database file is created:

```bash
python manage.py migrate
python manage.py createsuperuser  # For admin access
```

### Common Errors

1. **ModuleNotFoundError**: Ensure all dependencies are installed (`pip install -r requirements.txt`)

2. **Bad Request (400)**: Check ALLOWED_HOSTS includes your domain

3. **Static files not loading**: Run `python manage.py collectstatic`

---

## License

MIT License

