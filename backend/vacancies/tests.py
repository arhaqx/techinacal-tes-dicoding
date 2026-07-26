from django.test import TestCase
from rest_framework import status
from rest_framework.test import APITestCase
from .models import Vacancy


class VacancyModelTestCase(TestCase):
    def setUp(self):
        self.vacancy = Vacancy.objects.create(
            title="Frontend Developer",
            company_name="Dicoding",
            location="Bandung",
            job_type="Full-time",
            description="Build Next.js web applications.",
        )

    def test_str_representation(self):
        self.assertEqual(str(self.vacancy), "Frontend Developer at Dicoding")

    def test_vacancy_fields(self):
        self.assertIsNotNone(self.vacancy.id)
        self.assertEqual(self.vacancy.title, "Frontend Developer")
        self.assertEqual(self.vacancy.company_name, "Dicoding")
        self.assertEqual(self.vacancy.location, "Bandung")
        self.assertEqual(self.vacancy.job_type, "Full-time")
        self.assertEqual(self.vacancy.description, "Build Next.js web applications.")
        self.assertIsNotNone(self.vacancy.created_at)


class VacancyAPITestCase(APITestCase):
    def setUp(self):
        self.vacancy1 = Vacancy.objects.create(
            title="Frontend Developer",
            company_name="Dicoding",
            location="Bandung",
            job_type="Full-time",
            description="Build Next.js web applications.",
        )
        self.vacancy2 = Vacancy.objects.create(
            title="Backend Engineer",
            company_name="Tech Corp",
            location="Remote",
            job_type="Remote",
            description="Build Django REST Framework APIs.",
        )

    def test_create_vacancy(self):
        data = {
            "title": "Fullstack Developer",
            "company_name": "Dicoding Jobs",
            "location": "Jakarta",
            "job_type": "Full-time",
            "description": "Develop fullstack apps with Next.js and Django",
        }
        response = self.client.post("/api/vacancies/", data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Vacancy.objects.count(), 3)
        self.assertEqual(response.data["title"], "Fullstack Developer")

    def test_create_vacancy_validation(self):
        response = self.client.post(
            "/api/vacancies/",
            {
                "title": "",
                "company_name": "Dicoding",
                "location": "Bandung",
                "job_type": "Full-time",
                "description": "Description",
            },
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("title", response.data)

        response = self.client.post(
            "/api/vacancies/",
            {
                "title": "Title",
                "company_name": "   ",
                "location": "Bandung",
                "job_type": "Full-time",
                "description": "Description",
            },
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("company_name", response.data)

        response = self.client.post(
            "/api/vacancies/",
            {
                "title": "Title",
                "company_name": "Company",
                "location": "Bandung",
                "job_type": "Full-time",
                "description": "",
            },
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("description", response.data)

    def test_get_vacancies_list(self):
        response = self.client.get("/api/vacancies/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)

    def test_search_vacancies_by_title(self):
        response = self.client.get("/api/vacancies/?search=Frontend")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["title"], "Frontend Developer")

    def test_get_vacancy_detail(self):
        response = self.client.get(f"/api/vacancies/{self.vacancy1.id}/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["id"], str(self.vacancy1.id))
        self.assertEqual(response.data["title"], "Frontend Developer")

    def test_update_vacancy(self):
        data = {
            "title": "Senior Frontend Developer",
            "company_name": "Dicoding",
            "location": "Bandung",
            "job_type": "Full-time",
            "description": "Build Next.js web applications with React",
        }
        response = self.client.put(f"/api/vacancies/{self.vacancy1.id}/", data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.vacancy1.refresh_from_db()
        self.assertEqual(self.vacancy1.title, "Senior Frontend Developer")

    def test_delete_vacancy(self):
        response = self.client.delete(f"/api/vacancies/{self.vacancy1.id}/")
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Vacancy.objects.count(), 1)
