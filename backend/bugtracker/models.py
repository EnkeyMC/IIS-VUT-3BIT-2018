from django.db import models
from django.contrib.auth.models import User


class Language(models.Model):
    name = models.CharField(max_length=50, unique=True)


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    languages = models.ManyToManyField(Language)
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    email = models.EmailField()
    birth_date = models.DateField()
    is_programmer = models.BooleanField()


class Module(models.Model):
    person = models.ForeignKey(Profile, on_delete=models.SET_NULL, null=True)
    languages = models.ManyToManyField(Language)
    name = models.CharField(max_length=50)
    description = models.TextField()


class Severity(models.Model):
    level = models.AutoField(primary_key=True)
    name = models.CharField(max_length=50)
    description = models.TextField()


class Patch(models.Model):
    author = models.ForeignKey(Profile, on_delete=models.PROTECT)
    status = models.CharField(max_length=50)
    date_released = models.DateField()
    date_applied = models.DateField()


class Ticket(models.Model):
    author = models.ForeignKey(Profile, on_delete=models.PROTECT)
    severity = models.ForeignKey(Severity, on_delete=models.SET_NULL, null=True)
    duplicate = models.ForeignKey('self', on_delete=models.SET_NULL, null=True)
    module = models.ForeignKey(Module, on_delete=models.PROTECT)
    patch = models.ForeignKey(Patch, on_delete=models.SET_NULL, null=True)
    title = models.CharField(max_length=100)
    description = models.TextField()
    status = models.CharField(max_length=50)
    vulnerability = models.CharField(max_length=50)
    reward = models.DecimalField(max_digits=8, decimal_places=2, null=True)
    attachment = models.FileField()
