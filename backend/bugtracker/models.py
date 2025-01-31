from django.db import models
from django.contrib.auth.models import User


class Language(models.Model):
    name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.name


class Profile(models.Model):
    USER = 'user'
    PROGRAMMER = 'programmer'
    SUPERVISOR = 'supervisor'
    USER_TYPES = (
        (USER, 'regular user'),
        (PROGRAMMER, 'programmer'),
        (SUPERVISOR, 'supervisor'),
    )

    user = models.OneToOneField(
        User, on_delete=models.CASCADE, primary_key=True
    )
    languages = models.ManyToManyField(Language)
    birth_date = models.DateField(null=True)
    position = models.CharField(
        max_length=20, choices=USER_TYPES, default=USER
    )

    def __str__(self):
        return self.user.username


class Module(models.Model):
    expert = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    languages = models.ManyToManyField(Language)
    name = models.CharField(max_length=50)
    description = models.TextField()

    def __str__(self):
        return self.name


class Severity(models.Model):
    level = models.AutoField(primary_key=True)
    name = models.CharField(max_length=50)
    description = models.TextField()
    color = models.CharField(max_length=10)

    def __str__(self):
        return self.name


class Patch(models.Model):
    STATUS_PROGRESS = 'in progress'
    STATUS_AWAIT = 'awaiting approval'
    STATUS_APPROVED = 'approved'
    STATUS_RELEASED = 'released'
    STATUS_CHOICES = (
        (STATUS_PROGRESS, 'in progress'),
        (STATUS_AWAIT, 'awaiting approval'),
        (STATUS_APPROVED, 'approved'),
        (STATUS_RELEASED, 'released')
    )

    name = models.CharField(max_length=50)
    author = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    status = models.CharField(
        max_length=20, choices=STATUS_CHOICES, default=STATUS_PROGRESS)
    date_created = models.DateTimeField(auto_now_add=True)
    date_released = models.DateTimeField(null=True)

    def __str__(self):
        return 'Patch: ' + self.name


class Bug(models.Model):
    author = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    created = models.DateTimeField(auto_now_add=True)
    severity = models.ForeignKey(
        Severity, on_delete=models.SET_NULL, null=True
    )
    module = models.ForeignKey(
        Module, related_name='bugs', on_delete=models.SET_NULL, null=True)
    patch = models.ForeignKey(
        Patch, related_name='bugs', on_delete=models.SET_NULL, null=True)
    vulnerability = models.BooleanField(default=False)
    title = models.CharField(max_length=100)
    description = models.TextField()

    def __str__(self):
        return self.title


class Ticket(models.Model):
    STATUS_NEW = 'new'
    STATUS_CLOSED = 'closed'
    STATUS_ASSIGNED = 'assigned'
    STATUS_DUPLICATE = 'duplicate'
    STATUS_CHOICES = (
        (STATUS_NEW, 'new'),
        (STATUS_CLOSED, 'closed'),
        (STATUS_ASSIGNED, 'assigned'),
        (STATUS_DUPLICATE, 'duplicate'),
    )

    expert = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True,
        related_name='tickets_assigned'
    )
    author = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    bugs = models.ManyToManyField(Bug, related_name='tickets')
    duplicate = models.ForeignKey('self', on_delete=models.SET_NULL, null=True)
    title = models.CharField(max_length=100)
    description = models.TextField()
    status = models.CharField(
        max_length=20, choices=STATUS_CHOICES, default=STATUS_NEW
    )
    created = models.DateTimeField(auto_now_add=True)
    attachment = models.FileField(upload_to='tickets/%Y/%m/%d')
    reward = models.DecimalField(max_digits=6, decimal_places=2, default=0)

    def __str__(self):
        return self.title
