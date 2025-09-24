from rest_framework import serializers
from ..models.staff_models import Staff
from django.contrib.auth.models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id",'username', 'email', 'first_name', 'last_name' ]

class StaffSerializer(serializers.ModelSerializer):
    
    user = UserSerializer()
    
    class Meta:
        model = Staff
        fields = ["id",'user', 'phone', 'staff_name', 'post', 'status']
        
    def create(self, validated_data):
        user_data = validated_data.pop('user')
        user = User.objects.create(**user_data)
        staff = Staff.objects.create(user=user, **validated_data)
        return staff

    def update(self, instance, validated_data):
        user_data = validated_data.pop('user')
        user = instance.user

        for attr, value in user_data.items():
            setattr(user, attr, value)
        user.save()

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance