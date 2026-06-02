from django.test import TestCase, Client
from django.urls import reverse
from unittest.mock import patch, MagicMock
from .services import CognitoService

class CognitoIntegrationTest(TestCase):
    def setUp(self):
        self.client = Client()
        self.cognito_service = CognitoService()
    
    def test_login_redirect(self):
        """Test that login view redirects to Cognito."""
        response = self.client.get(reverse('login'))
        self.assertEqual(response.status_code, 302)
        self.assertIn('amazoncognito.com', response.url)
    
    @patch('authentication.services.CognitoService.exchange_code_for_tokens')
    @patch('authentication.services.CognitoService.verify_token')
    def test_callback_success(self, mock_verify, mock_exchange):
        """Test successful callback handling."""
        mock_exchange.return_value = {'access_token': 'test', 'id_token': 'test'}
        mock_verify.return_value = {
            'email': 'test@example.com',
            'cognito:username': 'testuser'
        }
        
        response = self.client.get(reverse('callback'), {'code': 'test_code'})
        self.assertEqual(response.status_code, 302)