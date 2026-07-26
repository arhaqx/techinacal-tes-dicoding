import { test, expect } from '@playwright/test';

const mockVacancies = [
  {
    id: '11111111-1111-1111-1111-111111111111',
    title: 'Frontend Developer',
    company_name: 'Dicoding Indonesia',
    location: 'Bandung',
    job_type: 'Full-time',
    description: 'Build web applications using Next.js and React.',
    created_at: '2026-07-25T12:00:00Z',
  },
  {
    id: '22222222-2222-2222-2222-222222222222',
    title: 'Backend Engineer',
    company_name: 'Tech Corp',
    location: 'Remote',
    job_type: 'Remote',
    description: 'Build REST APIs using Django REST Framework.',
    created_at: '2026-07-25T13:00:00Z',
  },
];

test.describe('Vacancies E2E Testing', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/vacancies/**', async (route) => {
      const url = new URL(route.request().url());
      const searchParam = url.searchParams.get('search');
      const pathname = url.pathname;

      const detailMatch = pathname.match(/\/api\/vacancies\/([^\/]+)\/?$/);
      if (detailMatch && detailMatch[1] && detailMatch[1] !== 'vacancies') {
        const id = detailMatch[1];
        const item = mockVacancies.find((v) => v.id === id) || mockVacancies[0];
        return route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(item),
        });
      }

      if (searchParam) {
        const filtered = mockVacancies.filter(
          (v) =>
            v.title.toLowerCase().includes(searchParam.toLowerCase()) ||
            v.company_name.toLowerCase().includes(searchParam.toLowerCase())
        );
        return route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(filtered),
        });
      }

      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockVacancies),
      });
    });
  });

  test('User opens vacancies list page', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByText('Temukan Lowongan Kerja')).toBeVisible();
    await expect(page.getByText('Frontend Developer')).toBeVisible();
    await expect(page.getByText('Backend Engineer')).toBeVisible();
    await expect(page.getByText('Dicoding Indonesia')).toBeVisible();
  });

  test('User searches a job by title', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByText('Frontend Developer')).toBeVisible();

    const searchInput = page.getByPlaceholder('Cari berdasarkan judul lowongan...');
    await searchInput.fill('Frontend');
    await page.getByRole('button', { name: 'Cari Lowongan' }).click();

    await expect(page.getByText('Hasil pencarian untuk "Frontend"')).toBeVisible();
    await expect(page.getByText('Frontend Developer')).toBeVisible();
    await expect(page.getByText('Backend Engineer')).not.toBeVisible();
  });

  test('User views vacancy details', async ({ page }) => {
    await page.goto('/');

    const detailButton = page.getByRole('link', { name: 'Lihat Detail' }).first();
    await detailButton.click();

    await expect(page).toHaveURL(/\/vacancies\/[a-f0-9-]+/);
    await expect(page.getByText('Kembali ke Daftar Lowongan')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Lamar Sekarang' })).toBeVisible();
  });
});
