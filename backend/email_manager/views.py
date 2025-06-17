from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from .models import Department, Email
from .serializer import DepartementSerializer, EmailSerializer
from .tasks import check_for_new_emails

class DepartmentListView(APIView):
    queryset = Department.objects.all()
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        """Returns departments with their email counts."""
        departments = Department.objects.all()

        department_data = [
            {
                "id": str(dept.id),
                "name": dept.name,
                "email": dept.department_email,
                "totalEmails": Email.objects.filter(forwarded_to=dept).count(),
                "color": "blue"  # This can be dynamic based on your needs
            }
            for dept in departments
        ]

        return Response(department_data, status=status.HTTP_200_OK)
    

class DepartmentEmailsView(APIView):
    queryset = Department.objects.all()
    permission_classes = [IsAuthenticated]

    def get(self, request, id, *args, **kwargs):
        """Fetch department details along with its emails."""
        try:
            # Fetch the department by its ID
            department = Department.objects.get(id=id)
        except Department.DoesNotExist:
            return Response({"error": "Department not found"}, status=status.HTTP_404_NOT_FOUND)
        
        # Fetch emails associated with the department
        emails = Email.objects.filter(forwarded_to=department)
        
        # Prepare the department data and emails
        department_data = {
            "id": department.id,
            "name": department.name,
            "email": department.department_email,
            "emails": [
                {
                    "id": email.id,
                    "subject": email.subject,
                    "sender": email.sender,
                    "received_at": email.received_at,
                    "body": email.body
                }
                for email in emails
            ]
        }
        
        return Response(department_data, status=status.HTTP_200_OK)
    

class EmailStatisticsView(APIView):
    queryset = Department.objects.all()
    permission_classes = [IsAuthenticated]

    def get(self, request):
        total_emails = Email.objects.count()
        total_forwarded = Email.objects.exclude(forwarded_to=None).count()

        department_counts = [
            { 
                "name": dep.name, 
                "count": Email.objects.filter(forwarded_to=dep).count()
            }
            for dep in Department.objects.all()
        ]

        return Response({
            "totalEmails": total_emails,
            "totalForwarded": total_forwarded,
            "departments": list(department_counts),
        })



class EmailListView(generics.ListAPIView):
    queryset = Email.objects.all()
    permission_classes = [IsAuthenticated]
    serializer_class = EmailSerializer


class DepartmentCreateView(generics.CreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = DepartementSerializer
    queryset = Department.objects.all()

class DepartmentRetrieveView(generics.RetrieveAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = DepartementSerializer
    queryset = Department.objects.all()
    lookup_url_kwarg = "id"

class DepartmentUpdateView(generics.UpdateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = DepartementSerializer
    queryset = Department.objects.all()
    lookup_url_kwarg = "id"

class EmailRetrieveView(generics.RetrieveAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = EmailSerializer
    queryset = Email.objects.all()
    lookup_url_kwarg = "id"