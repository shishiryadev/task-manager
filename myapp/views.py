from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import Task
import json

def index(request):
    tasks = Task.objects.all()
    return render(request, 'myapp/index.html', {'tasks': tasks})

@csrf_exempt
def get_data(request):
    if request.method == 'GET':
        tasks = list(Task.objects.values())
        return JsonResponse({'tasks': tasks})
    
    elif request.method == 'POST':
        data = json.loads(request.body)
        task = Task.objects.create(
            title=data.get('title'),
            description=data.get('description', '')
        )
        return JsonResponse({
            'id': task.id,
            'title': task.title,
            'description': task.description,
            'completed': task.completed
        })
