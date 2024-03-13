from rest_framework import serializers
from rest_framework import serializers
from authentication.models import Patient, InsuranceCompany
from django.contrib.auth.models import User
from .models import Claim, PastReports
from .enums.claim_status_enum import ClaimStatusEnum

class PatientSerializer(serializers.ModelSerializer):
    first_name = serializers.SerializerMethodField()
    last_name = serializers.SerializerMethodField()

    def get_first_name(self, obj):
        return User.objects.get(id=obj.user_id).first_name

    def get_last_name(self, obj):
        return User.objects.get(id=obj.user_id).last_name

    class Meta:
        model = Patient
        fields = "__all__"
        extra_fields = ['first_name', 'last_name']

class InsuranceCompanySerializer(serializers.ModelSerializer):
    first_name = serializers.SerializerMethodField()
    last_name = serializers.SerializerMethodField()

    def get_first_name(self, obj):
        return User.objects.get(id=obj.user_id).first_name

    def get_last_name(self, obj):
        return User.objects.get(id=obj.user_id).last_name

    class Meta:
        model = InsuranceCompany
        fields = "__all__"
        extra_fields = ['first_name', 'last_name']

class InitiateClaimSerializer(serializers.Serializer):
    insurance_company_name = serializers.CharField(required=True)
    claim_description = serializers.CharField(required=True)
    document = serializers.FileField(required=True)

    def create(self, validated_data):
        insurance_company = InsuranceCompany.objects.get(name=validated_data['insurance_company_name'])
        patient = Patient.objects.get(user=self.context['request'].user.id)
        claim = Claim( insurance_company_id = insurance_company.id,
                        patient_id = patient.id,
                        claim_description = validated_data['claim_description'],
                        status = ClaimStatusEnum.Pending.name,
                        document = validated_data['document'],)
        claim.save()
        return validated_data

class ClaimViewSerializer(serializers.ModelSerializer):
    insurance_company_name = serializers.SerializerMethodField()
    patient_first_name = serializers.SerializerMethodField()
    patient_last_name = serializers.SerializerMethodField()

    class Meta:
        model = Claim
        fields = ['id', 'insurance_company_id', 'insurance_company_name', 'claim_description', 'document', 'status', 'patient_first_name', 'patient_last_name', 'terminal_status']

    def get_insurance_company_name(self, obj):
        return InsuranceCompany.objects.get(id=obj.insurance_company_id).name
        
    def get_patient_first_name(self, obj):
        patient = Patient.objects.get(id=obj.patient_id)
        return User.objects.get(username=patient.user).first_name

    def get_patient_last_name(self, obj):
        patient = Patient.objects.get(id=obj.patient_id)
        return User.objects.get(username=patient.user).last_name
        
class PastReportsCreateSerializer(serializers.ModelSerializer):
    def create(self, validated_data):
        user_id = self.context['request'].user.id
        patient = Patient.objects.get(user=user_id)
        pastReport = PastReports(patient_id=patient.id,
                                 report=validated_data['report'])
        pastReport.save()
        return pastReport;

    class Meta:
        model = PastReports
        fields = ("report",)

