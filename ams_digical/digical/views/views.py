from django.shortcuts import get_object_or_404

from rest_framework import viewsets, status

from ..serializers import serializers, event_serializers, staff_serializer

from ..models.models import *
from ..models.event_models import *
from ..models.staff_models import *

from rest_framework.response import Response

class MachineView(viewsets.ModelViewSet):
    serializer_class = serializers.MachineSerializer
    queryset = Machine.objects.all()
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            print("Serializer Errors:", serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return super().create(request, *args, **kwargs)
    
    def destroy(self, request, pk):
        machine = get_object_or_404(Machine, pk=pk)
        machine.delete()
        return Response()
    
class StaffView(viewsets.ModelViewSet):
    serializer_class = staff_serializer.StaffSerializer
    queryset = Staff.objects.all()
    
    def destroy(self, request, pk):
        staff = get_object_or_404(Staff, pk=pk)
        staff.delete()
        return Response()
    
class BatchView(viewsets.ModelViewSet):
    serializer_class = serializers.BatchSerializer
    def get_queryset(self):
        return Batch.objects.select_related("submitter_lab","radionuclide","source","approved_by")
    
    def list(self, request, *args, **kwargs):
        response = super().list(request, *args, **kwargs)
        batches = response.data

        for batch in batches:
            batch_obj = Batch.objects.get(id=batch["id"])
            event = BatchProcessingEvent.objects.filter(asso_batch=batch_obj).select_related("responsible_staff").first()

            batch["start"] = event.start.isoformat() if event else None
            batch["end"] = event.end.isoformat() if event and event.end else None  # Keep full datetime
            batch["staff_assigned"] = event.responsible_staff.staff_name if event and event.responsible_staff else None

        return Response(batches)
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            print("Serializer Errors:", serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return super().create(request, *args, **kwargs)
    
    def destroy(self, request, pk=None):
        batch = get_object_or_404(Batch, pk=pk)
        batch.delete()
        return Response()

class SubmitterLabView(viewsets.ModelViewSet):
    serializer_class = serializers.SubmitterLabSerializer
    queryset = SubmitterLab.objects.all()
    
    def destroy(self, request, pk=None):
        submitter = get_object_or_404(SubmitterLab, pk=pk)
        submitter.delete()
        return Response()
    
class RadionuclideView(viewsets.ModelViewSet):
    serializer_class = serializers.RadionuclideLabSerializer
    queryset = Radionuclide.objects.all()

    def destroy(self, request, pk=None):
        radionuclide = get_object_or_404(Radionuclide, pk=pk)
        radionuclide.delete()
        return Response()



       