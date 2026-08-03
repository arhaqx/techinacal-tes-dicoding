import axios from 'axios';

export interface Vacancy {
  id: string;
  title: string;
  company_name: string;
  location: string;
  job_type: string;
  description: string;
  created_at: string;
}

export interface CreateVacancyInput {
  title: string;
  company_name: string;
  location: string;
  job_type: string;
  description: string;
}

const getBaseUrl = (): string => {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL.endsWith('/')
      ? process.env.NEXT_PUBLIC_API_URL
      : `${process.env.NEXT_PUBLIC_API_URL}/`;
  }
  if (typeof window !== 'undefined') {
    return '/api/vacancies/';
  }
  return 'http://127.0.0.1:8000/api/vacancies/';
};

const apiClient = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  config.baseURL = getBaseUrl();
  return config;
});

export const getVacancies = async (searchQuery?: string): Promise<Vacancy[]> => {
  const response = await apiClient.get<Vacancy[]>('', {
    params: searchQuery ? { search: searchQuery } : undefined,
  });
  return response.data;
};

export const getVacancyById = async (id: string): Promise<Vacancy> => {
  const response = await apiClient.get<Vacancy>(`${id}/`);
  return response.data;
};

export const createVacancy = async (data: CreateVacancyInput): Promise<Vacancy> => {
  const response = await apiClient.post<Vacancy>('', data);
  return response.data;
};

export const updateVacancy = async (id: string, data: Partial<CreateVacancyInput>): Promise<Vacancy> => {
  const response = await apiClient.put<Vacancy>(`${id}/`, data);
  return response.data;
};

export const deleteVacancy = async (id: string): Promise<void> => {
  await apiClient.delete(`${id}/`);
};
