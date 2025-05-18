from django.core.management.base import BaseCommand, CommandError
from tasks.models import Task
from tasks.views import send_reminder_email
import datetime
from django.utils.timezone import make_aware, is_naive
from datetime import timedelta
from django.utils import timezone

class Command(BaseCommand):
    help = 'Sends task reminder emails'
    
    def handle(self, *args, **options):
        now = timezone.now()
        due_date = now + timedelta(days=1)
        tasks = Task.objects.filter(end_date__lte=due_date)
        for task in tasks:
            send_reminder_email(task)
            print(f"Reminder email sent for task {task.title}")

        self.stdout.write(self.style.SUCCESS(f"Reminder emails sent for {len(tasks)} tasks"))