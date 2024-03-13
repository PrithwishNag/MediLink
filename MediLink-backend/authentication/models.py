from django.db import models
from django.contrib.auth.models import User
import uuid

User._meta.get_field('email').blank = False
User._meta.get_field('email')._unique = True

class Patient(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(to=User, on_delete=models.CASCADE)
    address = models.TextField()
    mobile_number = models.CharField(max_length=15)
    primary_contact_name = models.CharField(max_length=100)
    primary_contact_number = models.CharField(max_length=15)
    disease_name= models.CharField(max_length=20)
    inception=models.CharField(max_length=20)
    doctor_name=models.CharField(max_length=30)
    doctor_communication=models.CharField(max_length=30)
    hospital_name=models.CharField(max_length=20)
    precautions= models.CharField(max_length=500)
    reports=models.CharField(max_length=1000, blank=True, null=True)
    
    class Meta:
        db_table = 'Patient'

    def __str__(self):
        return self.email
    
    def get_address(self):
        return self.address
    
    def get_name(self):
        return self.primary_contact_name
    
class Hospital(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(to=User, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    specialty = models.CharField(max_length=255)
    address = models.TextField()

    class Meta:
        db_table = 'Hospital'

    def __str__(self):
        return self.name
    
class InsuranceCompany(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(to=User, on_delete=models.CASCADE)
    name = models.CharField(max_length=255, unique=True)
    details = models.TextField()

    class Meta:
        db_table = 'InsuranceCompanies'

    def __str__(self):
        return self.name
