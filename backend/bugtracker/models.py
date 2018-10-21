from django.db import models
from django.contrib.auth.models import User


class Language(models.Model):
    name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.name


class Profile(models.Model):
    user = models.OneToOneField(
            User, on_delete=models.CASCADE, primary_key=True)
    languages = models.ManyToManyField(Language)
    birth_date = models.DateField(null=True)
    position = models.CharField(max_length=50, default='')

    def __str__(self):
        return self.user.username


class Module(models.Model):
    expert = models.ForeignKey(Profile, on_delete=models.SET_NULL, null=True)
    languages = models.ManyToManyField(Language)
    name = models.CharField(max_length=50)
    description = models.TextField()

    def __str__(self):
        return self.name


class Severity(models.Model):
    level = models.AutoField(primary_key=True)
    name = models.CharField(max_length=50)
    description = models.TextField()

    def __str__(self):
        return self.name


class Patch(models.Model):
    author = models.ForeignKey(Profile, on_delete=models.PROTECT)
    status = models.CharField(max_length=50)
    date_released = models.DateField()
    date_applied = models.DateField()

    def __str__(self):
        return '#' + self.id


class Bug(models.Model):
    severity = models.ForeignKey(
            Severity, on_delete=models.SET_NULL, null=True)
    module = models.ForeignKey(Module, on_delete=models.PROTECT)
    patch = models.ForeignKey(Patch, on_delete=models.SET_NULL, null=True)
    vulnerability = models.CharField(max_length=50)
    title = models.CharField(max_length=100)
    description = models.TextField()

    def __str__(self):
        return self.title


class Ticket(models.Model):
    expert = models.ForeignKey(
            Profile, on_delete=models.SET_NULL, null=True,
            related_name='tickets_under_supervision')
    author = models.ForeignKey(Profile, on_delete=models.PROTECT)
    bugs = models.ManyToManyField(Bug)
    duplicate = models.ForeignKey('self', on_delete=models.SET_NULL, null=True)
    title = models.CharField(max_length=100)
    description = models.TextField()
    status = models.CharField(max_length=50)
    attachment = models.FileField()

    def __str__(self):
        return self.title
