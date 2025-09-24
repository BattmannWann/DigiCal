from django import forms
from digical.models.staff_models import *
from digical.models.event_models import *
from digical.models.models import *
from phonenumber_field.formfields import PhoneNumberField
from django.contrib.auth.models import User
from datetime import timedelta


class UserForm(forms.ModelForm):

    password = forms.CharField(widget = forms.PasswordInput())

    class Meta:
        model = User
        fields = ('first_name', 'last_name', 'email', 'password')

class StaffForm(forms.ModelForm):

    staff_name = forms.CharField(max_length=128, help_text="Title_Name")
    phone = PhoneNumberField(region="GB", help_text="Phone number", required=False)
    
    class Meta:
        model = Staff
        fields=('staff_name', 'phone',)


class StaffCreationForm(forms.Form):
    # Embed fields from UserForm
    first_name = forms.CharField(max_length=30, help_text = "Firstname")
    last_name = forms.CharField(max_length=30, help_text = "Surname")
    username = forms.CharField(max_length=150, help_text = "Username")
    email = forms.EmailField(help_text = "Email Address")
    password = forms.CharField(widget=forms.PasswordInput())

    # Embed fields from StaffForm
    staff_name = forms.CharField(max_length=128, help_text="Preferred Name")
    phone = PhoneNumberField(region="GB", help_text="Phone number", required=False)
    post = forms.CharField(max_length = 30, help_text = "Staff Role")


class EditProfileForm(forms.ModelForm):
    
    first_name = forms.CharField(max_length=30, help_text="First Name")
    last_name = forms.CharField(max_length=30, help_text="Last Name")
    username = forms.CharField(max_length=128, help_text="Username")
    email = forms.EmailField(help_text="Email address")
    
    password = forms.CharField(
        widget=forms.PasswordInput(),
        required=False,  # Allow the user to leave this blank
        help_text="Leave blank to keep the current password",
    )

    # Fields for the Staff model
    staff_name = forms.CharField(max_length=128, help_text="Preferred Name")
    phone = PhoneNumberField(region="GB", help_text="Phone Number", required=False)
    post = forms.CharField(max_length=30, help_text="Post")
    status = forms.CharField(max_length=30, help_text="Staff Status")

    class Meta:
        model = Staff
        fields = ("staff_name", "phone", "status")

    def __init__(self, *args, **kwargs):
        self.user = kwargs.pop("user", None)  
        super().__init__(*args, **kwargs)

        
        if self.user:
            self.fields["first_name"].initial = self.user.first_name
            self.fields["last_name"].initial = self.user.last_name
            self.fields["email"].initial = self.user.email
            self.fields["username"].initial = self.user.username
            

    def save(self, commit=True):
        
        staff = super().save(commit=False)

        
        if self.user:
            self.user.first_name = self.cleaned_data["first_name"]
            self.user.last_name = self.cleaned_data["last_name"]
            self.user.email = self.cleaned_data["email"]
            self.user.username = self.cleaned_data["username"]

            new_password = self.cleaned_data.get("password")
            if new_password:  
                self.user.set_password(new_password)

            if commit:
                self.user.save()

        if commit:
            staff.save()

        return staff

    
    
class DigicalLoginForm(forms.ModelForm):
    
    email = forms.CharField(max_length = 128, help_text = "Email")
    password = password = forms.CharField(widget = forms.PasswordInput(), help_text = "Password")
    
    class Meta:
        model = User
        fields = ('email', 'password')
