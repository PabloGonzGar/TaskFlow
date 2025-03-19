from rest_framework import serializers
from .models import User, Stats

class UserSerializer(serializers.ModelSerializer):

    #CLASS META SE USA PARA DEFINIR REGLAS DE COMO DEBE SER LA SERIALIZACION DE LA CLASE
    class Meta: 

        #SE LE PASA EL MODELO QUE SE SERA SERIALIZADO
        model = User    

        #SE LE PASAN LOS CAMPOSFIELDS QUE PUEDEN SER SERIALIZADOS
        fields = ('id','email', 'name', 'is_staff', 'is_superuser')


class StatsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Stats
        fields = ('id','completed_tasks', 'pending_tasks', 'urgent_tasks')