# Generated by Django 2.1.2 on 2018-11-05 07:28

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('bugtracker', '0003_ticket_created'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='profile',
            name='position',
        ),
        migrations.AddField(
            model_name='profile',
            name='user_type',
            field=models.CharField(choices=[('user', 'regular user'), ('programmer', 'programmer'), ('supervisor', 'supervisor')], default='user', max_length=20),
        ),
        migrations.AlterField(
            model_name='ticket',
            name='expert',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='tickets_assigned', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterField(
            model_name='ticket',
            name='status',
            field=models.CharField(choices=[('open', 'open'), ('closed', 'closed'), ('feedback', 'feedback')], default='open', max_length=20),
        ),
    ]
