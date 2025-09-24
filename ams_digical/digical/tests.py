from django.test import TestCase
from django.contrib.auth import get_user_model
from django.contrib.auth.models import User
from django.utils import timezone
from django.db.models.signals import post_save
from django.dispatch import receiver
from phonenumber_field.modelfields import PhoneNumber
from datetime import date, timedelta
from .models.models import *
from .models.event_models import *
from .models.staff_models import *
from .forms import UserForm, StaffForm, StaffCreationForm, EditProfileForm, DigicalLoginForm
from django.urls import reverse
from .views.views import *


# Create your tests here.

class TestMachine(TestCase):
    def test_model_machine(self):
        machine = Machine(
            machine_name="Test machine",
            last_maintenance=date(2025, 2, 25),
            status="Operational",
            batches_processed=100
        )
        self.assertEqual(machine.machine_name, "Test machine")
        self.assertEqual(machine.status, "Operational")
        self.assertEqual(machine.batches_processed, 100)
    
    def test_machine_str(self):
        machine = Machine(
            machine_name="Test machine",
            last_maintenance=date(2025, 2, 25),
            status="Operational",
            batches_processed=100
        )
        self.assertEqual(str(machine), "Test machine")

class TestSubmitterLab(TestCase):
    def test_model_submitter_lab(self):
        submitterLab= SubmitterLab(
            name="Test Submitter Lab",
            description="Description of test submitter lab"
        )
        self.assertEqual(submitterLab.name, "Test Submitter Lab")
        self.assertEqual(submitterLab.description, "Description of test submitter lab")

    def test_submitter_lab_str(self):
        submitterLab= SubmitterLab(
            name="Test Submitter Lab",
            description="Description of test submitter lab"
        )
        self.assertEqual(str(submitterLab), "Test Submitter Lab")

class TestRadionuclide(TestCase):
    def test_radionuclide(self):
        radionuclide = Radionuclide(
            name="Test Radionuclide",
            description="Description of test radionuclide"
        )
        self.assertEqual(radionuclide.name, "Test Radionuclide")
        self.assertEqual(radionuclide.description, "Description of test radionuclide")

    def test_radionuclide_str(self):
        radionuclide = Radionuclide(
            name="Test Radionuclide",
            description="Description of test radionuclide"
        )
        self.assertEqual(str(radionuclide), "Test Radionuclide")


class TestStaff(TestCase):
    def setUp(self):
        self.staff = Staff(
            phone="01234567891",
            staff_name="Test Name",
            post="Manager",
            status="In Office",
            user = User.objects.create(username="test username", first_name="test", last_name="")
        )
        
    def test_staff(self):
        staff = self.staff
        self.assertEqual(staff.staff_name, "Test Name")
        self.assertEqual(staff.post, "Manager")
        self.assertEqual(staff.status, "In Office")

    def test_save(self):
        self.staff.save()

    def test_staff_str(self):
        self.assertEqual(str(self.staff), "test username")



class TestBatch(TestCase):
    def setUp(self):
        self.batch = Batch(
            title="Test title",
            full_name="Test full name",
            whiteboard_name="Test whiteboard name",
            scheduled_start=timezone.now().date() + timedelta(days=1),
            report_sent=timezone.now().date() + timedelta(days=2),
            date_batch_submitted=timezone.now().date(),
            submitter_lab=SubmitterLab(name="Test Submitter Lab", description="Description of test submitter lab"),
            number_of_samples=10,
            radionuclide= Radionuclide(name="Test Radionuclide", description="Description of test radionuclide"),
            source= Machine(machine_name="Test machine", last_maintenance=date(2025, 2, 25), status="Operational", batches_processed=100),
            comment="Test comment",
            approved_by= Staff(phone="01234567891", staff_name="Test Name", post="Manager", status="In Office")
            )

    def test_batch(self):
        batch = self.batch
        self.assertEqual(batch.title, "Test title")
        self.assertEqual(batch.full_name, "Test full name")
        self.assertEqual(batch.whiteboard_name, "Test whiteboard name")
        
        self.assertEqual(batch.approved_by.phone, "01234567891")
        self.assertEqual(batch.approved_by.staff_name, "Test Name")
        self.assertEqual(batch.approved_by.post, "Manager")
        self.assertEqual(batch.approved_by.status, "In Office")
        
        self.assertEqual(batch.submitter_lab.name, "Test Submitter Lab")
        self.assertEqual(batch.submitter_lab.description, "Description of test submitter lab")
        
        self.assertEqual(batch.radionuclide.name, "Test Radionuclide")
        self.assertEqual(batch.radionuclide.description, "Description of test radionuclide")

        self.assertEqual(batch.source.machine_name, "Test machine")
        self.assertEqual(batch.source.last_maintenance, date(2025, 2, 25))
        self.assertEqual(batch.source.status, "Operational")
        self.assertEqual(batch.source.batches_processed, 100)


        self.assertEqual(batch.number_of_samples, 10)
        self.assertEqual(batch.comment, "Test comment")

    def test_batch_str(self):
        self.assertEqual(str(self.batch), "Test title")


class  TestEvents(TestCase):
    def setUp(self):
        self.event = Event(
            title="Test event",
            description="Test description",
            responsible_staff=Staff(phone="01234567891", staff_name="Test Name", post="Manager", status="In Office"),
            start=timezone.now().date(),
            color=None
        )

    def test_event_save(self):
        self.event.responsible_staff.save()
        self.event.save()

    def test_batch_str(self):
        self.assertEqual(str(self.event), "Test event")

class FormTests(TestCase):

    def setUp(self):
        self.user_data = {
            'first_name': 'Test',
            'last_name': 'Name',
            'email': 'testname@testing.com',
            'password': 'password123',
        }
        self.staff_data = {
            'staff_name': 'Test Name',
            'phone': PhoneNumber.from_string('+447123412345'),
            'post': 'Researcher',
        }
        self.user = User.objects.create_user(username='Testname',**self.user_data)

    def test_user_form(self):
        form = UserForm(data=self.user_data)
        self.assertTrue(form.is_valid())

    def test_staff_form_valid(self):
        form = StaffForm(data=self.staff_data)
        self.assertTrue(form.is_valid())

    def test_invalid_staff_form(self):
        invalid_data = self.staff_data.copy()
        invalid_data['phone'] = 'invalid_phone'
        form = StaffForm(data=invalid_data)
        self.assertFalse(form.is_valid())

class EditProfileFormTest(TestCase):

    def setUp(self):
        self.user = User.objects.create_user(
            username="testuser", 
            first_name="Test", 
            last_name="User", 
            email="testuser@testing.com",
            password="password123"
        )
        
        self.staff = Staff.objects.create(
            staff_name="Test User", 
            phone=PhoneNumber.from_string("+447123412345"), 
            post="Researcher", 
            status="Active", 
            user=self.user
        )
        
        self.form_data = {
            'first_name': 'Test',
            'last_name': 'User',
            'username': 'testuser',
            'email': 'testuser@testing.com',
            'password': 'newpassword123',
            'staff_name': 'Test User',
            'phone': '+447123412345',
            'post': 'Researcher',
            'status': 'Active'
        }

    def test_form_initialization_with_user(self):
        form = EditProfileForm(user=self.user)
        self.assertEqual(form.fields['first_name'].initial, 'Test')
        self.assertEqual(form.fields['last_name'].initial, 'User')
        self.assertEqual(form.fields['email'].initial, 'testuser@testing.com')
        self.assertEqual(form.fields['username'].initial, 'testuser')

    def test_save_form_with_valid_data(self):
        form = EditProfileForm(data=self.form_data, user=self.user)
        staff_before_save = self.staff

        staff = form.save()

        self.user.refresh_from_db()
        self.assertEqual(self.user.first_name, 'Test')
        self.assertEqual(self.user.last_name, 'User')
        self.assertEqual(self.user.username, 'testuser')
        self.assertEqual(self.user.email, 'testuser@testing.com')

        self.staff.refresh_from_db()
        self.assertEqual(self.staff.staff_name, 'Test User')
        self.assertEqual(self.staff.phone, PhoneNumber.from_string('+447123412345'))
        self.assertEqual(self.staff.post, 'Researcher')
        self.assertEqual(self.staff.status, 'Active')

        self.assertTrue(self.user.check_password('newpassword123'))