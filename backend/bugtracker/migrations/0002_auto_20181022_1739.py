# Generated by Django 2.1.2 on 2018-10-22 17:39

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('bugtracker', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='bug',
            name='module',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='bugtracker.Module'),
        ),
        migrations.AlterField(
            model_name='module',
            name='expert',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterField(
            model_name='patch',
            name='author',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterField(
            model_name='patch',
            name='date_applied',
            field=models.DateField(null=True),
        ),
        migrations.AlterField(
            model_name='patch',
            name='date_released',
            field=models.DateField(null=True),
        ),
        migrations.AlterField(
            model_name='ticket',
            name='author',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterField(
            model_name='ticket',
            name='expert',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='tickets_under_supervision', to=settings.AUTH_USER_MODEL),
        ),
    ]
