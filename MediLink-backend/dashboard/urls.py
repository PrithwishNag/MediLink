from django.urls import path
from .views import PatientView, ClaimView, PastReportsView, InsuranceCompanyView, InsuranceCompaniesView

urlpatterns = [
    path('patient', PatientView.as_view(), name="patient"),
    path('claim', ClaimView.as_view(), name="claim"),
    path('pastReports', PastReportsView.as_view(), name="past reports"),
    path('insuranceCompany', InsuranceCompanyView.as_view(), name="insuranceCompany"),
    path('insuranceCompanies', InsuranceCompaniesView.as_view(), name="insuranceCompanies"),
]