# Email Department Filter

This project automates the process of sorting and filtering company emails to their respective departments  using AI-powered classification — such as **Finance**, **Human Resources**, and others. It combines a **Django backend** with a **React frontend**, and uses **Celery** with **Redis** for asynchronous email processing.

---

## 🔧 Features

* 🔍 Automatically classifies incoming emails into departments
* 📨 Email fetching and display in the UI
* 📁 Filters by department: HR, Finance, etc.
* ⚙️ Django REST Framework for backend APIs
* 🌐 Modern React interface
* 🔁 Background processing via Celery & Redis

---

## 📸 UI Snapshots

```
![Inbox](assets/add-new-department.png)
![Filter Dropdown](assets/analytics-Dashboard.png)
![Email Detail](assets/Department.png)
![Email Detail](assets/email-view.png)
![Email Detail](assets/emails.png)

```

Make sure your `assets` folder contains the images.

---

## ⚙️ Tech Stack

* **Backend:** Django, Django REST Framework
* **Frontend:** React + Vite
* **Task Queue:** Celery
* **Broker:** Redis

---

## 🚀 Setup Instructions

### 1. Backend Setup (Django)

```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows

# backend working directory
cd backend

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Start Redis server (in another terminal)
redis-server

# Start Celery worker (in another terminal)
celery -A backend worker --loglevel=info

# Run Django server
python manage.py runserver
```

### 2. Frontend Setup (React)

```bash
cd frontend
npm install
npm run dev
```

Your React app should now be running on `http://localhost:5173`

---

## 📂 Project Structure

```
email-department-filter/
├── backend/              # Django project
│   ├── email_automation/ # Email filter API logic
│   ├── ai_tools          # Django settings
│   └── ...
├── frontend/             # React application
│   ├── src/
│   └── ...
└── assets/               # UI screenshots for README


---

## 🛡️ Environment Variables

You should create a `.env` file in the backend directory to include the following:

```env
SOCIAL_AUTH_GOOGLE_OAUTH2_KEY=google client key
SOCIAL_AUTH_GOOGLE_OAUTH2_SECRET = google secret key

GEMINI_API_KEY = gemeni api key

```

Do **not** commit this file to version control.

---

---

## 🤝 Contributions

PRs and issues are welcome! If you'd like to contribute, please fork the repo and submit a pull request.

---

