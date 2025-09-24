from django.contrib import admin
from digical.models.staff_models import Staff
from digical.models.event_models import Event, BatchProcessingEvent, MaintenanceEvent, StaffAwayEvent, GenericEvent
from digical.models.models import Machine, Batch, SubmitterLab, Radionuclide

admin.site.register(Staff)
admin.site.register(Event)
admin.site.register(BatchProcessingEvent)
admin.site.register(StaffAwayEvent)
admin.site.register(GenericEvent)
#admin.site.register(Event_Type_Helper)
admin.site.register(MaintenanceEvent)
admin.site.register(Machine)
admin.site.register(Batch)
admin.site.register(SubmitterLab)
admin.site.register(Radionuclide)