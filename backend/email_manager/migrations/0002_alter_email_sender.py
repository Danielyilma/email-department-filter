# Generated by Django 5.1.6 on 2025-02-13 08:03

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('email_manager', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='email',
            name='sender',
            field=models.TextField(),
        ),
    ]
