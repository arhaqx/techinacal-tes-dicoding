from rest_framework import serializers
from .models import Vacancy


class VacancySerializer(serializers.ModelSerializer):
    class Meta:
        model = Vacancy
        fields = [
            'id',
            'title',
            'company_name',
            'location',
            'job_type',
            'description',
            'created_at',
        ]
        read_only_fields = ['id', 'created_at']

    def validate_title(self, value):
        if not value or not value.strip():
            raise serializers.ValidationError("Field title tidak boleh kosong.")
        return value.strip()

    def validate_company_name(self, value):
        if not value or not value.strip():
            raise serializers.ValidationError("Field company_name tidak boleh kosong.")
        return value.strip()

    def validate_description(self, value):
        if not value or not value.strip():
            raise serializers.ValidationError("Field description tidak boleh kosong.")
        return value.strip()
