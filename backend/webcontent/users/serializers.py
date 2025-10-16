from rest_framework import serializers
from .models import User 

class SetPasswordSerializer(serializers.Serializer):
    token = serializers.UUIDField()
    password = serializers.CharField(min_length=8, write_only=True)
    confirm_password = serializers.CharField(min_length=8, write_only=True)

    def validate(self, attr):
        if attr['password'] != attr['confirm_passowrd']:
            raise serializers.ValidationError("Passwords do not match")
        return attr