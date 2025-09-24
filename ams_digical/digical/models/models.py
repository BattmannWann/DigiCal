from django.db import models
from django.utils import timezone
from .staff_models import Staff
     
class Machine(models.Model):
    machine_name = models.CharField(max_length=128, unique=False)
    
    last_maintenance = models.DateField()
    status = models.CharField(max_length=128)
    description = models.TextField(blank=True)
    batches_processed = models.IntegerField()
    
    def __str__(self):
        return self.machine_name


class SubmitterLab(models.Model):
    name = models.CharField(max_length=128)
    description = models.TextField(max_length=1024, blank=True)
    def __str__(self):
        return self.name
    
class Radionuclide(models.Model):
    name = models.CharField(max_length=128)
    description = models.TextField(max_length=1024, blank=True)
    def __str__(self):
        return self.name

class Batch(models.Model):
    title = models.CharField(max_length=128, unique=False)
    full_name = models.CharField(max_length=256, unique=False, blank=True)
    whiteboard_name = models.CharField(max_length=128, unique=False, blank=True)
    
    date_batch_submitted = models.DateField(auto_now_add=True)
    scheduled_start = models.DateField(blank=True, null=True)
    report_sent = models.DateField(blank=True, null=True)
    
    submitter_lab = models.ForeignKey(SubmitterLab, on_delete=models.CASCADE)
    number_of_samples = models.IntegerField()
    radionuclide = models.ForeignKey(Radionuclide, on_delete=models.CASCADE)
    source = models.ForeignKey(Machine, on_delete=models.CASCADE, blank=True, null=True)

    comment = models.TextField(max_length=1024, unique=False, blank=True)
    approved_by = models.ForeignKey(Staff, on_delete=models.CASCADE, blank=True, null=True)
    
    class Meta:
        verbose_name_plural = 'Batches'
    
    def __str__(self):
        return self.title