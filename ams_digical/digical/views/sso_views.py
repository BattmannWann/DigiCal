from urllib.parse import urlencode
from django.shortcuts import redirect
import requests
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.models import User
from digical.forms import StaffCreationForm, EditProfileForm, DigicalLoginForm
from django.conf import settings
from django.contrib.auth import authenticate, login, logout, get_user_model
from django.views.decorators.csrf import csrf_exempt
from digical.models.staff_models import Staff
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.authtoken.models import Token 
from rest_framework.authentication import TokenAuthentication

from ..serializers.staff_serializer import StaffSerializer

from rest_framework.views import APIView

# Load environment variables
CLIENT_ID = settings.CLIENT_ID
CLIENT_SECRET = settings.CLIENT_SECRET
TENANT_ID = settings.TENANT_ID
MICROSOFT_REDIRECT_URI = settings.MICROSOFT_REDIRECT_URI

TOKEN_URL = settings.TOKEN_URL
AUTHORIZATION_URL = settings.AUTHORIZATION_URL
GRAPH_API_URL = settings.GRAPH_API_URL
SCOPES = settings.SCOPES

User = get_user_model()

class RegisterView(APIView):
    def post(self, request):
        form = StaffCreationForm(request.data)

        if form.is_valid():
            email = form.cleaned_data["email"]

            try:
                
                # user = User.objects.get(email=email)
                user = User.objects.get(email = email)

                user.username = form.cleaned_data["username"]
                user.first_name = form.cleaned_data["first_name"]
                user.last_name = form.cleaned_data["last_name"]
                
                user.set_password(form.cleaned_data["password"])   
                user.save()

                staff, created = Staff.objects.get_or_create(user=user, defaults={
                    "staff_name": form.cleaned_data["staff_name"],
                    "phone": form.cleaned_data["phone"],
                    "post": form.cleaned_data["post"]
                })

               
                if not created:
                    staff.staff_name = form.cleaned_data["staff_name"]
                    staff.phone = form.cleaned_data["phone"]
                    staff.post = form.cleaned_data["post"]
                    staff.save()

                
                login(request, user)

                return Response({"message": "Registration successful."}, status=status.HTTP_200_OK)

            except User.DoesNotExist:
                
                return Response({"error": "No existing user found. Please log in again."}, status=status.HTTP_400_BAD_REQUEST)

        return Response({"errors": form.errors}, status=status.HTTP_400_BAD_REQUEST)




class OAuth2LoginView(APIView):
    """
    Redirects user to Microsoft Entra ID login page.
    """

    def get(self, request):
        params = {
            "client_id": CLIENT_ID,
            "response_type": "code",
            "redirect_uri": MICROSOFT_REDIRECT_URI,
            "response_mode": "query",
            "scope": SCOPES,
        }
        login_url = f"{AUTHORIZATION_URL}?{urlencode(params)}"
        return redirect(login_url)


class OAuth2CallbackView(APIView):
    """
    Handles OAuth2 callback: exchanges code for token and authenticates user.
    """
    
    @csrf_exempt
    def get(self, request):
        auth_code = request.GET.get("code")

        if not auth_code:
            return Response({"error": "No authorization code provided"}, status=status.HTTP_400_BAD_REQUEST)
   
        payload = {
            "client_id": CLIENT_ID,
            "client_secret": CLIENT_SECRET,
            "grant_type": "authorization_code",
            "code": auth_code,
            "redirect_uri": MICROSOFT_REDIRECT_URI,
            "scope": SCOPES,
        }
        headers = {"Content-Type": "application/x-www-form-urlencoded"}

        token_response = requests.post(TOKEN_URL, data=payload, headers=headers)
        token_data = token_response.json()

        if "access_token" not in token_data:
            return Response({"error": "Failed to get access token", "details": token_data}, status=status.HTTP_400_BAD_REQUEST)

        access_token = token_data["access_token"]
        
        headers = {"Authorization": f"Bearer {access_token}"}
        user_response = requests.get(GRAPH_API_URL, headers=headers)
        user_data = user_response.json()

        email = user_data.get("mail") or user_data.get("userPrincipalName")
        name = user_data.get("displayName", "New User")

        if not email:
            return Response({"error": "No email found"}, status=status.HTTP_400_BAD_REQUEST)

        user, created = User.objects.get_or_create(
            email=email, defaults={"username": email, "first_name": name}
        )
       
        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)
        refresh_token = str(refresh)
    
        frontend_url = "http://localhost:3000/oauth2/callback"
        params = urlencode({"access": access_token, "refresh": refresh_token, "new_user": "true" if created else "false"})
        
        login(request, user)
        return redirect(f"{frontend_url}?{params}")
        
        
class MicrosoftUserInfoView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        try:
            staff = Staff.objects.get(user = user)
            serialiser = StaffSerializer(staff, many = False)
            return Response({
                "name": user.first_name,
                "email": user.email,
                "post": staff.post,
                "model": serialiser.data
            })
        
        except Staff.DoesNotExist:

            return Response({
                "name": user.first_name,
                "email": user.email,
                "post": "Staff"
            })
            
            
class DigicalUserInfoView(APIView):
    authentication_classes = [TokenAuthentication]  # Ensure token authentication is enabled
    permission_classes = [IsAuthenticated]

    def get(self, request):
        auth_header = request.headers.get("Authorization")
        
        if not auth_header:
            return Response({"error": "No token provided"}, status=401)
        
        try:
            token_key = auth_header.split(" ")[1]
            token = Token.objects.get(key=token_key)
            user = token.user

            try:
                staff = Staff.objects.get(user=user)
                serialiser = StaffSerializer(staff, many=False)

                return Response({
                    "name": user.first_name,
                    "email": user.email,
                    "post": staff.post,
                    "model": serialiser.data
                })

            except Staff.DoesNotExist:
                return Response({
                    "name": user.first_name,
                    "email": user.email,
                    "post": "Staff"
                })
        
        except Token.DoesNotExist:
            return Response({"error": "Invalid token"}, status=401)

class LoginView(APIView):
    
    def post(self, request):
        
        form = DigicalLoginForm(request.data)  
        
        if form.is_valid():
            
            username = form.cleaned_data["email"]
            password = form.cleaned_data["password"]
            

            user = authenticate(username = username, password = password)  

            if user:
                
                if user.is_active:
                    
                    login(request, user)
                    token, created = Token.objects.get_or_create(user = user)
                    
                    return Response({"message": f"Login successful, token was created: {created}", "token": token.key}, status=status.HTTP_200_OK)
                
                else:
                    return Response({"error": "Account is disabled, contact administration"}, status=status.HTTP_403_FORBIDDEN)
            
            return Response({"error": "Invalid credentials"}, status=status.HTTP_400_BAD_REQUEST)
        
        
        return Response({"error": form.errors}, status=status.HTTP_400_BAD_REQUEST)
    

class LogoutView(APIView):

    def post(self, request):

        logout(request)
        return Response({"message": "Logout successful"}, status=status.HTTP_200_OK)
    

class EditProfileView(APIView):

    def post(self, request):
        print(request.data)
        form = EditProfileForm(request.data)

        if form.is_valid():
            username = form.cleaned_data["username"]

            try:

                user = User.objects.get(username = username)

                user.first_name = form.cleaned_data["first_name"]
                user.last_name = form.cleaned_data["last_name"]
                user.save()

                staff = Staff.objects.get(user = user)
                staff.staff_name = form.cleaned_data["staff_name"]
                
                staff.phone = form.cleaned_data["phone"]
                staff.post = form.cleaned_data["post"]
                staff.status = form.cleaned_data["status"]
                staff.save()

                return Response({"message": "Profile updated successfully."}, status = status.HTTP_200_OK)

            except User.DoesNotExist:

                return Response({"error": "No existing user has been found, please log in again"}, status = status.HTTP_400_BAD_REQUEST)

        return Response({"errors": form.errors}, status = status.HTTP_400_BAD_REQUEST)