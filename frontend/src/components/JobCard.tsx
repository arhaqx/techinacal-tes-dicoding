import React from 'react';
import Link from 'next/link';
import { Building2, MapPin, Briefcase, ChevronRight, Clock } from 'lucide-react';
import { Vacancy } from '@/services/api';

interface JobCardProps {
  vacancy: Vacancy;
}

const JOB_TYPE_STYLES: Record<string, string> = {
  remote: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'full-time': 'bg-blue-50 text-blue-700 border-blue-200',
  'full time': 'bg-blue-50 text-blue-700 border-blue-200',
  'part-time': 'bg-purple-50 text-purple-700 border-purple-200',
  contract: 'bg-amber-50 text-amber-700 border-amber-200',
  internship: 'bg-teal-50 text-teal-700 border-teal-200',
};

const resolveBadgeStyle = (jobType: string): string => {
  const normalizedKey = jobType.toLowerCase().trim();
  return (
    JOB_TYPE_STYLES[normalizedKey] ||
    'bg-slate-50 text-slate-700 border-slate-200'
  );
};

const formatPublishedDate = (dateIsoString: string): string => {
  try {
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(new Date(dateIsoString));
  } catch {
    return dateIsoString;
  }
};

export default function JobCard({ vacancy }: JobCardProps) {
  const companyInitial = vacancy.company_name
    ? vacancy.company_name.charAt(0).toUpperCase()
    : 'J';

  return (
    <article className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-xs transition-all hover:shadow-md hover:border-slate-300">
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-700 font-bold text-base border border-slate-200">
              {companyInitial}
            </div>
            <div>
              <span className="flex items-center gap-1.5 text-xs font-medium text-slate-600">
                <Building2 className="h-3.5 w-3.5 text-slate-400" />
                {vacancy.company_name}
              </span>
            </div>
          </div>
          <span
            className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${resolveBadgeStyle(
              vacancy.job_type
            )}`}
          >
            <Briefcase className="mr-1 h-3 w-3" />
            {vacancy.job_type}
          </span>
        </div>

        <h3 className="text-base font-bold text-slate-900 line-clamp-1">
          {vacancy.title}
        </h3>

        <p className="mt-2 text-xs text-slate-600 line-clamp-2 leading-relaxed">
          {vacancy.description}
        </p>
      </div>

      <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
        <div className="flex flex-col gap-1 text-[11px] text-slate-500">
          <span className="flex items-center gap-1">
            <MapPin className="h-3 w-3 text-slate-400" />
            {vacancy.location}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3 text-slate-400" />
            {formatPublishedDate(vacancy.created_at)}
          </span>
        </div>

        <Link
          href={`/vacancies/${vacancy.id}`}
          className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 transition-colors"
        >
          Lihat Detail
          <ChevronRight className="ml-1 h-3.5 w-3.5" />
        </Link>
      </div>
    </article>
  );
}
