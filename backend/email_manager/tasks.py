from UserAccountManager.models import User
from mail import MailService
from ai_tools.main import AI
from celery import shared_task
from .models import Email, Department
from .serializer import EmailSerializer


@shared_task
def check_for_new_emails():
    try:
        users = User.objects.all()

        for user in users:
            token = user.google_access_token

            mail = MailService(token)
            message_content = mail.fetch_unread_messages()


            if not message_content:
                continue

            department_name = AI.get_departement(message_content)

            if not department_name:
                department_name = ""

            department = Department.objects.filter(name__icontains=department_name.strip()).first()
            print(message_content, department, department_name)

            serializer = EmailSerializer(data=message_content)
            serializer.is_valid(raise_exception=True)
            email = serializer.save()
     
            if department:
                mail.forward_department_email(message_content['id'], department.department_email)
                email.forwarded_to = department
                email.save()

        print("check successfull")
    except Exception as err:
        print(f"error while checking for new message{err}")

