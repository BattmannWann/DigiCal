from django.db import models
from django.conf import settings
from phonenumber_field.modelfields import PhoneNumberField

class Staff(models.Model):
    class Post(models.TextChoices):
        MANAGER = "Manager"
        STAFF = "Staff"
        INTERN = "Temporary Staff/Intern"
        CONTRACTOR = "Contractor"
    
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete = models.CASCADE, 
                                related_name = 'profile', null = True)
    
    phone = PhoneNumberField(blank=True)
    staff_name = models.CharField(max_length = 128, unique = False, default = "")
    post = models.CharField(max_length=128, default=Post.STAFF, unique=False)
    status = models.CharField(max_length=128, default="In Office", unique=False)
    
    class Meta:
        verbose_name_plural = "Staff Members"

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
    
    def __str__(self):
        return self.user.username
    

def create_or_update_user_profile(sender, instance, created, **kwargs):

    if created:
        Staff.objects.create(user = instance)

    instance.profile.save()