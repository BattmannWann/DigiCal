# import serializers from the REST framework
from rest_framework import serializers
from ..models.models import Machine, Batch, SubmitterLab, Radionuclide
from ..models.staff_models import Staff
from ..models import event_models

# create a serializer class
class MachineSerializer(serializers.ModelSerializer):
    class Meta:
        model = Machine
        fields =  ["id",'machine_name','last_maintenance','status', 'description','batches_processed']  
        
        
class BatchSerializer(serializers.ModelSerializer):
    radionuclide = serializers.PrimaryKeyRelatedField(queryset=Radionuclide.objects.all())
    radionuclide_name = serializers.SlugRelatedField(slug_field="name", source="radionuclide", read_only=True)
    
    submitter_lab = serializers.PrimaryKeyRelatedField(queryset=SubmitterLab.objects.all())
    submitter_lab_name = serializers.SlugRelatedField(slug_field="name", source="submitter_lab", read_only=True)
    
    source = serializers.PrimaryKeyRelatedField(queryset=Machine.objects.all(), required=False, allow_null=True)
    source_name = serializers.SlugRelatedField(slug_field="machine_name", source="source", read_only=True)
    
    approved_by = serializers.PrimaryKeyRelatedField(queryset=Staff.objects.all())
    approved_by_name = serializers.SlugRelatedField(slug_field="staff_name", source="approved_by", read_only=True)
    
    class Meta:
        model = Batch
        fields = ["id",'title', 'full_name', 'whiteboard_name','date_batch_submitted','scheduled_start',
                  'report_sent','submitter_lab', 'submitter_lab_name','number_of_samples',
                  'radionuclide', 'radionuclide_name','source', 'source_name','comment', 'approved_by', 
                  'approved_by_name']

        

class SubmitterLabSerializer(serializers.ModelSerializer):
    class Meta:
        model = SubmitterLab
        fields = ["id",'name', 'description']
        
        
class RadionuclideLabSerializer(serializers.ModelSerializer):
    class Meta:
        model = Radionuclide
        fields =["id",'name', 'description']
        
        