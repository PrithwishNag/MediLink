from django.contrib.auth.models import User
from .enums.user_type import UserType
from .models import Patient, InsuranceCompany

def findUserType(user_id):
    userType = None
    if(Patient.objects.filter(user=user_id).exists()):
        userType = UserType.Patient.name
    elif(InsuranceCompany.objects.filter(user=user_id).exists()):
        userType = UserType.InsuranceCompany.name
    else:
        raise User.DoesNotExist
    return userType