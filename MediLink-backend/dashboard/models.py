from django.db import models
from django.contrib.auth.models import User
import uuid

def user_claims_path(instance, filename):
    return "files/user_{0}/medical_claims/{1}".format(instance.patient_id, filename)

class Claim(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    insurance_company_id = models.UUIDField()
    patient_id = models.UUIDField()
    claim_description = models.TextField()
    status = models.CharField(max_length=32)
    terminal_status = models.CharField(max_length=32, null=True)
    document = models.FileField(upload_to=user_claims_path)

    class Meta:
        db_table = 'Claim'

    def __str__(self):
        return self.claim_description
    
    def get_status(self):
        return self.status

def user_reports_path(instance, filename):
    return "files/user_{0}/reports/{1}".format(instance.patient_id, filename)

class PastReports(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    patient_id = models.UUIDField()
    report = models.FileField(upload_to=user_reports_path)

    class Meta:
        db_table = 'PastReports'

    def __str__(self):
        return self.report.name
    
class MedicineTable(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(to=User, on_delete=models.CASCADE)
    medicine= models.CharField(max_length=50)
    morning=models.CharField(max_length=3)
    afternoon=models.CharField(max_length=3)
    evening=models.CharField(max_length=3)
    sos=models.CharField(max_length=3)

    class Meta:
        db_table = 'MedicineTable'

    def __str__(self):
        return self.name
