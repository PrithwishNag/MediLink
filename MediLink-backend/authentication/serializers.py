from rest_framework import serializers
from django.contrib.auth.models import User
from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from django.contrib.auth.password_validation import validate_password
from .models import Patient

# Patient User Register
class UserRegisterSerializer(serializers.Serializer):
  first_name = serializers.CharField(required=True,)
  last_name = serializers.CharField(required=True,)
  email = serializers.EmailField(required=True, validators=[UniqueValidator(queryset=User.objects.all())])
  password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
  confirm_password = serializers.CharField(write_only=True, required=True)
  address = serializers.CharField(required=True)
  mobile_number = serializers.CharField(required=True)
  primary_contact_name = serializers.CharField(required=True)
  primary_contact_number = serializers.CharField(required=True)
  
  def validate(self, attrs):
    if attrs['password'] != attrs['confirm_password']:
      raise serializers.ValidationError(
        {"password": "Password fields didn't match."})
    return attrs
  
  def create(self, validated_data):
    # Saving user to auth model
    user = User.objects.create_user(email=validated_data['email'],
                                    username=validated_data['email'],
                                    first_name=validated_data['first_name'],
                                    last_name=validated_data['last_name'])
    user.set_password(validated_data['password'])
    user.save()
    # Saving other details in patient model
    patient = Patient(user=user,
                      address=validated_data['address'],
                      mobile_number=validated_data['mobile_number'], 
                      primary_contact_name=validated_data['primary_contact_name'], 
                      primary_contact_number=validated_data['primary_contact_number'],)
                      # disease_name=validated_data['disease_name'],
                      # inception=validated_data['inception'],
                      # doctor_name=validated_data['doctor_name'],
                      # doctor_communication=validated_data['doctor_communication'],
                      # hospital_name=validated_data['hospital_name'],
                      # precautions=validated_data['precautions'],
                      # reports=validated_data['reports'])

    patient.save()
    return validated_data
  
# Not used for now
class PatientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Patient
        fields = ("address", "mobile_number", "primary_contact_name", "primary_contact_number",)
    