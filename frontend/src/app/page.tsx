'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getVacancies } from '@/services/api';
import JobCard from '@/components/JobCard';
import AddVacancyModal from '@/components/AddVacancyModal';
import { Search, Plus, Briefcase, RefreshCw, SearchX } from 'lucide-react';

const SKELETON_ITEMS = ['sk-1', 'sk-2', 'sk-3', 'sk-4', 'sk-5', 'sk-6'];

export default function Home() {
  const [searchInput, setSearchInput] = useState('');
  const [activeQuery, setActiveQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    data: jobVacancies = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['vacancies', activeQuery],
    queryFn: () => getVacancies(activeQuery),
  });

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveQuery(searchInput.trim());
  };

  const handleResetSearch = () => {
    setSearchInput('');
    setActiveQuery('');
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20" suppressHydrationWarning>
      <header className="border-b border-slate-200 bg-white sticky top-0 z-30">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white font-bold">
              <Briefcase className="h-5 w-5" />
            </div>
            <div className="flex items-center gap-1 text-xl font-bold tracking-tight text-slate-900">
              <span>Dicoding</span>
              <span className="text-blue-600">Jobs</span>
            </div>
          </div>

          <button
            suppressHydrationWarning
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Tambah Lowongan</span>
          </button>
        </div>
      </header>

      <section className="bg-slate-900 text-white py-12 px-4 sm:px-6">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-2xl sm:text-4xl font-bold tracking-tight">
            Temukan Lowongan Kerja di Dicoding Jobs
          </h1>
          <p className="mt-2 text-sm text-slate-300 max-w-xl mx-auto">
            Cari dan lamar berbagai posisi lowongan kerja developer & teknologi terkini.
          </p>

          <form
            onSubmit={handleSearchSubmit}
            className="mt-6 mx-auto max-w-xl flex items-center gap-2 rounded-xl bg-white p-2 shadow-lg"
          >
            <div className="relative flex-1 flex items-center pl-3">
              <Search className="h-4 w-4 text-slate-400" />
              <input
                suppressHydrationWarning
                type="text"
                placeholder="Cari berdasarkan judul lowongan..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full bg-transparent px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none"
              />
            </div>
            <button
              suppressHydrationWarning
              type="submit"
              className="rounded-lg bg-blue-600 px-5 py-2.5 text-xs font-semibold text-white hover:bg-blue-700 transition-colors shrink-0"
            >
              Cari Lowongan
            </button>
          </form>
        </div>
      </section>

      <main className="mx-auto max-w-6xl px-4 sm:px-6 mt-8">
        <div className="flex items-center justify-between mb-6 pb-3 border-b border-slate-200">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Daftar Lowongan Kerja</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {activeQuery ? (
                <>
                  Hasil pencarian untuk <span className="font-semibold text-slate-700">"{activeQuery}"</span> ({jobVacancies.length} ditemukan)
                </>
              ) : (
                `Menampilkan ${jobVacancies.length} lowongan tersedia`
              )}
            </p>
          </div>

          {activeQuery && (
            <button
              suppressHydrationWarning
              onClick={handleResetSearch}
              className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Reset
            </button>
          )}
        </div>

        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {SKELETON_ITEMS.map((skeletonId) => (
              <div key={skeletonId} className="h-44 rounded-xl border border-slate-200 bg-white p-5 animate-pulse">
                <div className="h-5 w-2/3 bg-slate-200 rounded mb-3"></div>
                <div className="h-4 w-1/3 bg-slate-200 rounded mb-6"></div>
                <div className="h-10 w-full bg-slate-200 rounded"></div>
              </div>
            ))}
          </div>
        )}

        {isError && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center max-w-md mx-auto my-8">
            <p className="text-xs font-medium text-red-600">
              Gagal mengambil data lowongan. Pastikan server backend Django telah berjalan.
            </p>
            <button
              suppressHydrationWarning
              onClick={() => refetch()}
              className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-red-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-red-700"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Coba Lagi
            </button>
          </div>
        )}

        {!isLoading && !isError && jobVacancies.length === 0 && (
          <div className="rounded-xl border border-slate-200 bg-white p-10 text-center max-w-md mx-auto my-8">
            <SearchX className="mx-auto h-10 w-10 text-slate-300 mb-2" />
            <h3 className="text-sm font-bold text-slate-800">Lowongan Tidak Ditemukan</h3>
            <p className="mt-1 text-xs text-slate-500">
              {activeQuery
                ? `Tidak ada hasil untuk kata kunci "${activeQuery}".`
                : 'Belum ada data lowongan kerja saat ini.'}
            </p>
            {activeQuery && (
              <button
                suppressHydrationWarning
                onClick={handleResetSearch}
                className="mt-4 rounded-lg bg-slate-100 px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-200"
              >
                Tampilkan Semua
              </button>
            )}
          </div>
        )}

        {!isLoading && !isError && jobVacancies.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {jobVacancies.map((vacancy) => (
              <JobCard key={vacancy.id} vacancy={vacancy} />
            ))}
          </div>
        )}
      </main>

      <AddVacancyModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
