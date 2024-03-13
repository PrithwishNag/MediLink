from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from .serializers import PatientSerializer
from rest_framework.parsers import MultiPartParser, FormParser
from authentication.models import Patient, InsuranceCompany
from .models import Claim, PastReports
from .serializers import InitiateClaimSerializer, ClaimViewSerializer, PatientSerializer, PastReportsCreateSerializer, InsuranceCompanySerializer
from django.http import JsonResponse, Http404, FileResponse
from .enums.claim_status_enum import ClaimStatusEnum
from .enums.claim_terminal_status_enum import ClaimTerminalStatusEnum
import os
from ast import literal_eval

class PatientView(APIView):
    def get(self, request):
        data = Patient.objects.get(user=request.user.id)
        serializer = PatientSerializer(data, many = False)
        serialized_data = serializer.data
        reportsDict = serialized_data['reports']
        if reportsDict is not None:
            safe_str = reportsDict.replace("OrderedDict(", "").replace(")", "")
            data = literal_eval(safe_str)
            serialized_data['reports'] = data
        response = {
            "user": request.user.id,
            "status": status.HTTP_200_OK,
            "message": "success",
            "data": serialized_data
        }
        return Response(response, status = status.HTTP_200_OK)
    
class InsuranceCompanyView(APIView):
    def get(self, request):
        data = InsuranceCompany.objects.get(user=request.user.id)
        serializer = InsuranceCompanySerializer(data, many = False)
        response = {
            "user": request.user.id,
            "status": status.HTTP_200_OK,
            "message": "success",
            "data": serializer.data
        }
        return Response(response, status = status.HTTP_200_OK)
    
class InsuranceCompaniesView(APIView):
    def get(self, _):
        companies = InsuranceCompany.objects.all()
        response = []
        for company in companies:
            response.append(company.name)
        return Response(response, status = status.HTTP_200_OK)
    
class ClaimView(APIView):
    parser_classes = (MultiPartParser, FormParser)

    def get(self, request):
        claimId = request.query_params.get('claimId', None)
        claimStatus = request.query_params.get('status', None)
        if claimStatus is not None:
            patient = Patient.objects.filter(user=request.user.id)
            insurance_company = InsuranceCompany.objects.filter(user=request.user.id)
            claims = None
            if(patient.exists()):
                claims = Claim.objects.filter(patient_id=patient[0].id, status=claimStatus)
            else:
                claims = Claim.objects.filter(insurance_company_id=insurance_company[0].id, status=claimStatus)

            serializer = ClaimViewSerializer(claims, many=True)
            return Response(serializer.data)
        elif claimId is not None:
            claim = Claim.objects.filter(id=claimId)
            if not claim.exists():
                raise Http404("Claim not found")
            pdf_path = os.path.join(claim[0].document.name)
            if os.path.exists(pdf_path):
                return FileResponse(open(pdf_path, 'rb'), content_type='application/pdf')
            else:
                raise Http404("PDF not found")
        return Response('Status or documentId parameter is required', status=status.HTTP_400_BAD_REQUEST)

    def post(self, request):
        serializer = InitiateClaimSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        print(serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def put(self, request):
        claimId = request.query_params.get('claimId', None)
        terminalStatus = request.query_params.get('terminalStatus', None)
        if not claimId or not terminalStatus:
            raise Http404("Claim not found")
        claim = Claim.objects.get(id=claimId)

        claim.status = ClaimStatusEnum.Completed.name
        if terminalStatus not in ClaimTerminalStatusEnum._member_names_:
            raise Http404("Invalid claim terminal status")
        claim.terminal_status = terminalStatus
        claim.save()
        return Response('Claim ' + terminalStatus + ' sucessfully', status=status.HTTP_200_OK)
    
class PastReportsView(APIView):
    parser_classes = (MultiPartParser, FormParser)

    def get(self, request):
        patient = Patient.objects.get(user=request.user.id)
        pastReports = list(PastReports.objects.filter(patient_id=patient.id))
        reportId = request.query_params.get('reportId', None)
        if reportId is None:
            return JsonResponse({"reports": list(map(lambda pastReport: {'id': pastReport.id, 'report': pastReport.report.name}, pastReports))})
        else:
            filteredPastReports = list(filter(lambda pastReport: str(pastReport.id) == reportId, pastReports))
            if filteredPastReports:
                filename = filteredPastReports[0].report.name
            else:
                raise Http404("PDF not found.")
            pdf_path = os.path.join(filename)
            if os.path.exists(pdf_path):
                return FileResponse(open(pdf_path, 'rb'), content_type='application/pdf')
            else:
                raise Http404("PDF not found.")

    def post(self, request):
        serializer = PastReportsCreateSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        print(serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)