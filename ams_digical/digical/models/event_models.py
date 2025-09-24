from django.db import models
from .staff_models import Staff
from .models import Machine, Batch
from datetime import time, timedelta
from django.utils.timezone import make_aware
import pytz
from colorfield.fields import ColorField
from polymorphic.models import PolymorphicModel, PolymorphicManager

    
class Event(PolymorphicModel):
    title = models.CharField(max_length =128, unique=False)
    description = models.TextField(max_length=1024, blank=True, null=True)
     
    responsible_staff = models.ForeignKey(Staff, on_delete=models.CASCADE, null=True)
     
    start = models.DateField(null = True, blank = True)
    end = models.DateField(null = True, blank = True)
    
    color = ColorField(format='hex', default=None, null=True)
    
    objects = PolymorphicManager() 
    next_event = models.ForeignKey('self', on_delete=models.SET_DEFAULT, null=True, blank=True, default=None)
     
    def __str__(self):
        return self.title
    
    def save(self, *args, **kwargs):
        if self.color is None or self.color=="":  # Only set color if it's not already set
            self.color = '#ef848e'

        super().save(*args, **kwargs)
        
class GenericEvent(Event):
    class Meta:
        proxy = False

class BatchProcessingEvent(Event):
    asso_batch = models.ForeignKey(Batch, on_delete=models.CASCADE, null=True, blank=True)
        
    def save(self, *args, **kwargs):
        if self.color is None or self.color =="":
            self.color = '#47a3ff'
        super().save(*args, **kwargs)
   

class StaffAwayEvent(Event):
    away_type = models.CharField(max_length=128, default="OFFICE")
   
class MaintenanceEvent(Event):
    class MaintenanceStatus(models.TextChoices):    
        PENDING = "Pending"
        IN_PROGRESS = "In Progress"
        FINISHED = "Finished"
        
    area = models.CharField(max_length=128, unique=False)
    asso_machine = models.ForeignKey(Machine, on_delete=models.CASCADE, null=True)
    
    report_by = models.ForeignKey(Staff, on_delete=models.CASCADE, null=True, default=1)
    report_date = models.DateField(blank=True, null=True)
    status = models.CharField(max_length=128, choices=MaintenanceStatus.choices, default=MaintenanceStatus.PENDING)
    
    def save(self, *args, **kwargs):
        if not self.color or self.color=="":
            self.color = '#444444'
        super().save(*args, **kwargs)