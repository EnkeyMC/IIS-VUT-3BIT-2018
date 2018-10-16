# Generated by Django 2.1.2 on 2018-10-16 12:09

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Language',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=50, unique=True)),
            ],
        ),
        migrations.CreateModel(
            name='Module',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=50)),
                ('description', models.TextField()),
                ('languages', models.ManyToManyField(to='bugtracker.Language')),
            ],
        ),
        migrations.CreateModel(
            name='Patch',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('status', models.CharField(max_length=50)),
                ('date_released', models.DateField()),
                ('date_applied', models.DateField()),
            ],
        ),
        migrations.CreateModel(
            name='Profile',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('first_name', models.CharField(max_length=50)),
                ('last_name', models.CharField(max_length=50)),
                ('email', models.EmailField(max_length=254)),
                ('birth_date', models.DateField()),
                ('is_programmer', models.BooleanField()),
                ('languages', models.ManyToManyField(to='bugtracker.Language')),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Severity',
            fields=[
                ('level', models.AutoField(primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=50)),
                ('description', models.TextField()),
            ],
        ),
        migrations.CreateModel(
            name='Ticket',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=100)),
                ('description', models.TextField()),
                ('status', models.CharField(max_length=50)),
                ('vulnerability', models.CharField(max_length=50)),
                ('reward', models.DecimalField(decimal_places=2, max_digits=8, null=True)),
                ('attachment', models.FileField(upload_to='')),
                ('author', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='bugtracker.Profile')),
                ('duplicate', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='bugtracker.Ticket')),
                ('module', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='bugtracker.Module')),
                ('patch', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='bugtracker.Patch')),
                ('severity', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='bugtracker.Severity')),
            ],
        ),
        migrations.AddField(
            model_name='patch',
            name='author',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='bugtracker.Profile'),
        ),
        migrations.AddField(
            model_name='module',
            name='person',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='bugtracker.Profile'),
        ),
    ]
