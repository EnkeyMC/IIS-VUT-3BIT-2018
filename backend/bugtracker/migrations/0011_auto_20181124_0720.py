# Generated by Django 2.1.2 on 2018-11-24 06:20

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('bugtracker', '0010_auto_20181123_2126'),
    ]

    operations = [
        migrations.AlterField(
            model_name='bug',
            name='created',
            field=models.DateTimeField(auto_now_add=True),
        ),
        migrations.AlterField(
            model_name='patch',
            name='date_applied',
            field=models.DateTimeField(null=True),
        ),
        migrations.AlterField(
            model_name='patch',
            name='date_released',
            field=models.DateTimeField(auto_now_add=True),
        ),
        migrations.AlterField(
            model_name='ticket',
            name='created',
            field=models.DateTimeField(auto_now_add=True),
        ),
    ]
