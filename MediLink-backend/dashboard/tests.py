from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from django.contrib.auth.models import User
from authentication.models import Patient, InsuranceCompany
from dashboard.models import Claim, PastReports

class DashboardViewsTestCase(TestCase):
     def setUp(self):
          self.client = APIClient()

          # Create a test user using user_data
          self.user_data = {
               "first_name": "John",
               "last_name": "Doe",
               "username": "john@example.com",
               "email": "john@example.com",
               "password": "xjkhfjsh@#432",
          }

          # Create a test patient using patient_data
          self.patient_data = {
               "address": "123 Main St",
               "mobile_number": "555-555-5555",
               "primary_contact_name": "Jane Doe",
               "primary_contact_number": "555-555-5556",
          #   "disease_name": "ExampleDisease",
          #   "inception": "2023-01-01",
          #   "doctor_name": "Dr. Smith",
          #   "doctor_communication": "Email",
          #   "hospital_name": "Example Hospital",
          #   "precautions": "Example precautions text, make sure it is sufficiently long to test the field properly.",
          #   "reports": {}  # Assuming an empty JSON object for demonstration; adjust as needed
          }

          # Create a test user
          self.user = User.objects.create_user(**self.user_data)
          self.client.force_authenticate(user=self.user)

          self.patient = Patient.objects.create(user=self.user, **self.patient_data)

          # Create a test insurance company
          self.insurance_company = InsuranceCompany.objects.create(user=self.user, name='Test Insurance', details='Test Details')

          # Create a test claim
          self.claim_pending = Claim.objects.create(insurance_company_id=self.insurance_company.id, patient_id=self.patient.id,
                                             claim_description='Test Claim', status='Pending', terminal_status=None)
          # Create a test claim
          self.claim_completed = Claim.objects.create(insurance_company_id=self.insurance_company.id, patient_id=self.patient.id,
                                             claim_description='Test Claim', status='Completed', terminal_status='Accepted')

          # Create a test past report
          self.past_report = PastReports.objects.create(patient_id=self.patient.id, report='Test Report.pdf')

     def test_patient_view(self):
          response = self.client.get('/api/dashboard/patient')
          self.assertEqual(response.status_code, status.HTTP_200_OK)
          self.assertEqual(response.data['user'], self.user.id)
          self.assertIsNotNone(response.data['data'])
          self.assertEqual(response.data['data']['first_name'], self.user_data['first_name'])
          self.assertEqual(response.data['data']['last_name'], self.user_data['last_name'])

     def test_insurance_company_view(self):
          response = self.client.get('/api/dashboard/insuranceCompany')
          self.assertEqual(response.status_code, status.HTTP_200_OK)
          self.assertEqual(response.data['user'], self.user.id)

     def test_claim_view_get_with_status(self):
          response = self.client.get('/api/dashboard/claim', **{'QUERY_STRING': 'status=Pending'})
          self.assertEqual(response.status_code, status.HTTP_200_OK)
          self.assertEqual(len(response.data), 1)
          response = self.client.get('/api/dashboard/claim', **{'QUERY_STRING': 'status=Completed'})
          self.assertEqual(response.status_code, status.HTTP_200_OK)
          self.assertEqual(len(response.data), 1)

     def test_claim_view_get_without_status_or_claimid(self):
          response = self.client.get('/api/dashboard/claim')
          self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

     def test_claim_view_post(self):
          import tempfile
          tmp_file = tempfile.NamedTemporaryFile(suffix='.pdf')
          tmp_file.write(b'fkenfkenfs')
          tmp_file.seek(0)
          data = {'insurance_company_name': 'Test Insurance', 'claim_description': 'Test Claim', 'document': tmp_file}
          response = self.client.post('/api/dashboard/claim', data, format='multipart')
          tmp_file.close() 
          self.assertEqual(response.status_code, status.HTTP_201_CREATED)

     def test_claim_view_put(self):
          response = self.client.put('/api/dashboard/claim', **{'QUERY_STRING': 
          'claimId=' + str(self.claim_pending.id) + '&terminalStatus=Accepted'}, format='multipart')
          self.assertEqual(response.status_code, status.HTTP_200_OK)
          claim = Claim.objects.get(id=str(self.claim_pending.id))
          self.assertEqual(claim.terminal_status, 'Accepted')

     def test_create_past_report(self):
          import tempfile
          tmp_file = tempfile.NamedTemporaryFile(suffix='.pdf')
          tmp_file.write(b'fkenfkenfs')
          tmp_file.seek(0)
          data = {
               'report': tmp_file
          }

          # Send the POST request to create a new past report
          response = self.client.post('/api/dashboard/pastReports', data, format='multipart')

          # Check that the request was successful and a new past report was created
          self.assertEqual(response.status_code, status.HTTP_201_CREATED)
          self.assertTrue('report' in response.data)
