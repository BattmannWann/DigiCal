from django.utils import timezone
from rest_framework.response import Response
from rest_framework import viewsets
from rest_framework import status

from rest_framework.filters import SearchFilter

from ..serializers import event_serializers

from ..models import event_models
from django_filters.rest_framework import DjangoFilterBackend
from django.shortcuts import get_object_or_404

class EventView(viewsets.ModelViewSet):
    queryset = event_models.Event.objects.order_by('start')
    serializer_class = event_serializers.EventPolymorphicSerializer
    def get_queryset(self):
        queryset = super().get_queryset()
        upcoming = self.request.query_params.get('upcoming', None)

        if upcoming and upcoming.lower() == 'true':
            queryset = queryset.filter(end__gte=timezone.now())
        
        return queryset
    
    def destroy(self,request, pk=None):
        event = get_object_or_404(event_models.Event, pk=pk)
        event.delete()
        return Response() 
    
class GenericEventView(viewsets.ModelViewSet):
    serializer_class = event_serializers.GenericEventSerializer
    queryset = event_models.GenericEvent.objects.all()
        
class StaffAwayView(viewsets.ModelViewSet):
    serializer_class = event_serializers.StaffAwaySerializer
    queryset = event_models.StaffAwayEvent.objects.all()
    
class BatchProcessView(viewsets.ModelViewSet):
    serializer_class = event_serializers.BatchProcessSerializer
    queryset = event_models.BatchProcessingEvent.objects.all()
    
    filter_backends = [DjangoFilterBackend, SearchFilter]
    filterset_fields = ["id"]
    
    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        data =[
            {
                "id": batch.id,
                "source_id": batch.asso_batch.source.id,
                "batch_id": batch.asso_batch.id,
                "batch_name": batch.asso_batch.whiteboard_name,
                "start": batch.start,
                "end": batch.end,
            }
            for batch in queryset
        ]
        return Response(data)
    
class MaintenanceView(viewsets.ModelViewSet):
    serializer_class = event_serializers.MaintenanceSerializer
    queryset = event_models.MaintenanceEvent.objects.all()
    
    def get_queryset(self):
        queryset = event_models.MaintenanceEvent.objects.select_related("event_ptr")
        now = timezone.now().date()
        for event in queryset:
            parent_event = event.event_ptr
            if parent_event.end and parent_event.end < now:
                event.status = "Finished"
            elif parent_event.start and parent_event.start < now:
                event.status = "In Progress"
            else:
                event.status = "Pending"

            event.save(update_fields=["status"])
                

        return queryset