import os
from celery import Celery
from celery.schedules import crontab
from django.conf import settings


os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'email_automation.settings')

app = Celery('email_automation')


app.config_from_object('django.conf:settings', namespace='CELERY')
app.autodiscover_tasks()


app.conf.beat_schedule = {
    "check-emails-every-5-minutes": {
        "task": "email_manager.tasks.check_for_new_emails",
        "schedule": crontab(minute="*/2"),
    },
}

@app.task(bind=True)
def debug_task(self):
    print(f'Request: {self.request!r}')
