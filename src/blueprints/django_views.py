# ========================================================
# Django REST Framework Views for Unpad Merch Hub (Python)
# ========================================================

from django.db import models
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import uuid

# 1. Models Blueprint (models.py)
class UserProfile(models.Model):
    ROLE_CHOICES = [
        ('customer', 'Customer'),
        ('staff', 'Staff Admin'),
    ]
    id = models.CharField(primary_key=True, max_length=50)
    full_name = models.CharField(max_length=150)
    email = models.EmailField(unique=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='customer')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'users'


# 2. Login View (views.py)
class UserLoginAPIView(APIView):
    def post(self, request):
        email = request.data.get('email', '').strip().lower()
        role = request.data.get('role', '')

        if not email or not role:
            return Response({
                'status': 'error',
                'message': 'Mohon berikan email dan role!'
            }, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = UserProfile.objects.get(email=email, role=role)
            return Response({
                'status': 'success',
                'user': {
                    'id': user.id,
                    'fullName': user.full_name,
                    'email': user.email,
                    'role': user.role
                }
            }, status=status.HTTP_200_OK)
        except UserProfile.DoesNotExist:
            return Response({
                'status': 'error',
                'message': 'Email salah atau peranan (role) Anda tidak sesuai!'
            }, status=status.HTTP_401_UNAUTHORIZED)


# 3. Register View (views.py)
class UserRegisterAPIView(APIView):
    def post(self, request):
        full_name = request.data.get('fullName', '').strip()
        email = request.data.get('email', '').strip().lower()
        role = request.data.get('role', '')

        if not full_name or not email or not role:
            return Response({
                'status': 'error',
                'message': 'Mohon isi semua kolom data!'
            }, status=status.HTTP_400_BAD_REQUEST)

        if UserProfile.objects.filter(email=email).exists():
            return Response({
                'status': 'error',
                'message': 'Email tersebut sudah terdaftar!'
            }, status=status.HTTP_400_BAD_REQUEST)

        new_user_id = f"USR-{uuid.uuid4().hex[:10].upper()}"
        user = UserProfile.objects.create(
            id=new_user_id,
            full_name=full_name,
            email=email,
            role=role
        )

        return Response({
            'status': 'success',
            'user': {
                'id': user.id,
                'fullName': user.full_name,
                'email': user.email,
                'role': user.role
            }
        }, status=status.HTTP_201_CREATED)
