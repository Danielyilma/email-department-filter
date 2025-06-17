from rest_framework import serializers
from .models import Department, Email

class DepartementSerializer(serializers.ModelSerializer):

    class Meta:
        model = Department
        fields = "__all__"

class EmailSerializer(serializers.ModelSerializer):
    # department = serializers.CharField(source="forwarded_to.name", default="Unassigned")

    class Meta:
        model = Email
        fields = "__all__"