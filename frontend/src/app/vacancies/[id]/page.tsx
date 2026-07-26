'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getVacancyById, deleteVacancy } from '@/services/api';
import {
  ArrowLeft,
  Building2,
  MapPin,
  Briefcase,
  Clock,
  Send,
  Share2,
  AlertCircle,
  Trash2,
  Loader2,
  Check,
} from 'lucide-react';

export default function VacancyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const vacancyId = params?.id as string;

  const [isCopied, setIsCopied] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);

  const {
    data: targetVacancy,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['vacancy', vacancyId],
    queryFn: () => getVacancyById(vacancyId),
    enabled: Boolean(vacancyId),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteVacancy(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vacancies'] });
      router.push('/');
    },
    onError: () => {
      alert('Gagal menghapus lowongan kerja.');
    },
  });

  const handleDeleteVacancy = () => {
    if (confirm('Apakah Anda yakin ingin menghapus lowongan pekerjaan ini?')) {
      deleteMutation.mutate(vacancyId);
    }
  };

  const handleShareLink = () => {
    if (typeof window !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 3000);
    }
  };

  const handleApplyJob = () => {
    setHasApplied(true);
  };

  const formatPublishedDate = (dateIsoString?: string): string => {
    if (!dateIsoString) return '-';
    try {
      return new Intl.DateTimeFormat('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }).format(new Date(dateIsoString));
    } catch {
      return dateIsoString;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
      <header className="border-b border-slate-200 bg-white sticky top-0 z-30">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3.5 sm:px-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali ke Daftar Lowongan
          </Link>
          <span className="text-xs font-semibold text-slate-400">Dicoding Jobs</span>
        </div>
      </header>

      {isLoading && (
        <div className="mx-auto max-w-5xl px-4 sm:px-6 mt-8">
          <div className="animate-pulse space-y-6">
            <div className="h-40 rounded-xl bg-slate-200"></div>
            <div className="h-60 rounded-xl bg-slate-200"></div>
          </div>
        </div>
      )}

      {isError && (
        <div className="mx-auto max-w-md px-4 my-16 text-center">
          <div className="rounded-xl border border-red-200 bg-red-50 p-6">
            <AlertCircle className="mx-auto h-10 w-10 text-red-500 mb-2" />
            <h3 className="text-base font-bold text-slate-900">Lowongan Tidak Ditemukan</h3>
            <p className="mt-1 text-xs text-slate-600">
              Lowongan yang Anda cari tidak tersedia atau telah dihapus.
            </p>
            <Link
              href="/"
              className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-blue-700"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Kembali ke Beranda
            </Link>
          </div>
        </div>
      )}

      {targetVacancy && (
        <main className="mx-auto max-w-5xl px-4 sm:px-6 mt-8">
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white font-bold text-xl">
                  {targetVacancy.company_name ? targetVacancy.company_name.charAt(0).toUpperCase() : 'J'}
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
                    {targetVacancy.title}
                  </h1>

                  <div className="mt-2 flex flex-wrap items-center gap-y-2 gap-x-4 text-xs font-medium text-slate-600">
                    <span className="flex items-center gap-1 font-semibold text-slate-900">
                      <Building2 className="h-4 w-4 text-blue-600" />
                      {targetVacancy.company_name}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4 text-slate-400" />
                      {targetVacancy.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4 text-slate-400" />
                      Diposting pada {formatPublishedDate(targetVacancy.created_at)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="shrink-0">
                <span className="inline-flex items-center gap-1 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                  <Briefcase className="h-3.5 w-3.5" />
                  {targetVacancy.job_type}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
                <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
                  Deskripsi Pekerjaan
                </h2>
                <div className="mt-4 text-xs leading-relaxed text-slate-700 whitespace-pre-line">
                  {targetVacancy.description}
                </div>
              </div>
            </div>

            <div>
              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-3">
                <h3 className="text-xs font-bold text-slate-900">Aksi</h3>
                <button
                  onClick={handleApplyJob}
                  disabled={hasApplied}
                  className={`w-full inline-flex items-center justify-center gap-1.5 rounded-lg px-4 py-2.5 text-xs font-semibold transition-colors ${
                    hasApplied
                      ? 'bg-emerald-600 text-white cursor-default'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {hasApplied ? (
                    <>
                      <Check className="h-4 w-4" />
                      Lamaran Terkirim
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Lamar Sekarang
                    </>
                  )}
                </button>
                <button
                  onClick={handleShareLink}
                  className="w-full inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  {isCopied ? (
                    <>
                      <Check className="h-4 w-4 text-emerald-600" />
                      Link Tersalin!
                    </>
                  ) : (
                    <>
                      <Share2 className="h-4 w-4" />
                      Bagikan Link
                    </>
                  )}
                </button>

                <div className="pt-2 border-t border-slate-100">
                  <button
                    onClick={handleDeleteVacancy}
                    disabled={deleteMutation.isPending}
                    className="w-full inline-flex items-center justify-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-100 transition-colors disabled:opacity-50"
                  >
                    {deleteMutation.isPending ? (
                      <>
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        Menghapus...
                      </>
                    ) : (
                      <>
                        <Trash2 className="h-3.5 w-3.5" />
                        Hapus Lowongan
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      )}
    </div>
  );
}
