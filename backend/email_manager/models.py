from django.db import models
from datetime import datetime

class Department(models.Model):
    """Stores department details, including email addresses."""
    name = models.CharField(max_length=50, unique=True)
    department_email = models.EmailField(unique=True)

    def __str__(self):
        return self.name

class Email(models.Model):
    """Stores incoming emails."""
    sender = models.TextField()
    subject = models.CharField(max_length=255)
    body = models.TextField()
    received_at = models.DateTimeField(auto_now_add=True)
    category = models.CharField(max_length=50, blank=True, null=True)  # Auto-classified
    forwarded_to = models.ForeignKey(Department, on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        return f"{self.subject} from {self.sender}"

class ForwardingLog(models.Model):
    """Logs email forwarding activities."""
    forward_email = models.ForeignKey(Email, on_delete=models.CASCADE)
    department = models.ForeignKey(Department, on_delete=models.CASCADE)
    forwarded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Email {self.email.id} forwarded to {self.department.name}"

class AutoResponse(models.Model):
    """Stores predefined responses for common emails."""
    category = models.CharField(max_length=50, unique=True)
    response = models.TextField()

    def __str__(self):
        return f"Response for {self.category}"
