from rest_framework import serializers
from rest_polymorphic.serializers import PolymorphicSerializer
from ..models.staff_models import Staff
from ..models.event_models import *
from .serializers import BatchSerializer 
        
class EventSerializer(serializers.ModelSerializer):
    responsible_staff = serializers.PrimaryKeyRelatedField(queryset=Staff.objects.all())
    responsible_staff_name = serializers.SlugRelatedField(slug_field='staff_name', source="responsible_staff",read_only=True)
    
    class Meta:
        model = Event
        fields = ["id","title", "description", "color", "responsible_staff", "responsible_staff_name", "start", "end"]
        
    def to_representation(self, instance):
        data = super().to_representation(instance)
            
        data["extendedProps"] = {"color": instance.color.lstrip("#")}
        return data
        
class GenericEventSerializer(EventSerializer):
    class Meta:
        model = GenericEvent
        fields = EventSerializer.Meta.fields

class BatchProcessSerializer(EventSerializer):
    asso_batch = serializers.PrimaryKeyRelatedField(queryset=Batch.objects.all())
    asso_batch_details = BatchSerializer(read_only=True)
    class Meta:
        model = BatchProcessingEvent
        fields = EventSerializer.Meta.fields + ["asso_batch", "asso_batch_details"]
        
        
class StaffAwaySerializer(EventSerializer):
    class Meta:
        model = StaffAwayEvent
        fields = EventSerializer.Meta.fields + ["away_type"]
        
class MaintenanceSerializer(EventSerializer):
    responsible_staff = serializers.PrimaryKeyRelatedField(queryset=Staff.objects.all(), allow_null=True)
    asso_machine = serializers.PrimaryKeyRelatedField(queryset=Machine.objects.all(), allow_null=True)
    asso_machine_name = serializers.SlugRelatedField(slug_field="machine_name", source="asso_machine", read_only=True)
    report_by_name = serializers.SlugRelatedField(slug_field="staff_name", source="report_by", read_only=True)
    
    start = serializers.DateField(allow_null=True)
    end = serializers.DateField(allow_null=True)
    class Meta:
        model = MaintenanceEvent
        fields = EventSerializer.Meta.fields + ["area", "report_date", "report_by", "report_by_name", "asso_machine", "asso_machine_name", "status"]
        
class EventPolymorphicSerializer(PolymorphicSerializer):
    model_serializer_mapping = {
        Event: EventSerializer,
        GenericEvent: GenericEventSerializer,
        BatchProcessingEvent: BatchProcessSerializer,
        StaffAwayEvent: StaffAwaySerializer,
        MaintenanceEvent: MaintenanceSerializer,
    }