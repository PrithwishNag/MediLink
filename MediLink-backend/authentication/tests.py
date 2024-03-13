from django.test import TestCase
from authentication.models import Patient
from django.contrib.auth.models import User
from django.contrib.auth.models import User
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from django.test import TestCase
from .models import Patient

class UserAccountTests(TestCase):

    def setUp(self):
        self.client = APIClient()
        self.register_url = reverse('register')
        self.login_url = reverse('login')
        self.logout_url = reverse('logout')
        self.user_data = {
            "first_name": "John",
            "last_name": "Doe",
            "email": "john@example.com",
            "password": "xjkhfjsh@#432",
            "confirm_password": "xjkhfjsh@#432",
            "address": "123 Main St",
            "mobile_number": "555-555-5555",
            "primary_contact_name": "Jane Doe",
            "primary_contact_number": "555-555-5556",
            # "disease_name": "ExampleDisease",
            # "inception": "2023-01-01",
            # "doctor_name": "Dr. Smith",
            # "doctor_communication": "Email",
            # "hospital_name": "Example Hospital",
            # "precautions": "Example precautions text, make sure it is sufficiently long to test the field properly.",
            # "reports": {}  # Assuming an empty JSON object for demonstration; adjust as needed
        }

    def test_register_user_success(self):
        response = self.client.post(self.register_url, self.user_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(User.objects.count(), 1)
        self.assertEqual(Patient.objects.count(), 1)

    def test_login_user_success(self):
        self.client.post(self.register_url, self.user_data, format='json')
        response = self.client.post(self.login_url, {'email': 'john@example.com', 'password': 'xjkhfjsh@#432'}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue('token' in response.data)

    def test_login_user_fail_wrong_password(self):
        self.client.post(self.register_url, self.user_data, format='json')
        response = self.client.post(self.login_url, {'email': 'john@example.com', 'password': 'wrongpassword'}, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_logout_user_success(self):
        self.client.post(self.register_url, self.user_data, format='json')
        login_response = self.client.post(self.login_url, {'email': 'john@example.com', 'password': 'xjkhfjsh@#432'}, format='json')
        token = login_response.data['token']
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + token)
        response = self.client.post(self.logout_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_user_unauthenticated(self):
        response = self.client.get(self.login_url)
        self.assertNotEqual(response.data['user'], 'john@example.com') 
        self.assertEqual(response.status_code, status.HTTP_200_OK)
