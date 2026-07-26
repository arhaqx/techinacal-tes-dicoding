from rest_framework import viewsets, filters
from .models import Vacancy
from .serializers import VacancySerializer


class VacancyViewSet(viewsets.ModelViewSet):
    queryset = Vacancy.objects.all()
    serializer_class = VacancySerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['title', 'company_name', 'location', 'job_type', 'description']
