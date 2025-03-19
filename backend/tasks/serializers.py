from rest_framework import serializers
from .models import Task, TaskTag, Reminder

class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = ('id','title', 'description', 'start_date', 'end_date', 'status', 'user')

class TaskTagSerializer(serializers.ModelSerializer):
    tag = TagSerializer(read_only=True)
    
    class Meta:
        model = TaskTag
        fields = ('task', 'tag')

class ReminderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reminder
        fields = ('id','task', 'date', 'sent')

class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ('id','name', 'color')