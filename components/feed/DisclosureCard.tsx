import type { Disclosure } from '@/types/dart';
import { DISCLOSURE_TYPE_LABEL, DISCLOSURE_TYPE_COLOR } from '@/types/dart';
import { getDartViewerUrl } from '@/lib/dart';
import { cn, formatDate } from '@/lib/utils';
import Link from 'next/link';

interface DisclosureCardProps {
  disclosure: Disclosure;
  showCorpName?: boolean;
}

export function DisclosureCard({ disclosure, showCorpName = true }: DisclosureCardProps) {
  const viewerUrl = getDartViewerUrl(disclosure.rcept_no);

  return (
    <div className="flex items-start gap-3 border-b border-gray-100 py-3 last:border-0">
      <span className="w-20 shrink-0 pt-0.5 text-right text-xs text-gray-400">
        {formatDate(disclosure.rcept_dt)}
      </span>

      <span
        className={cn(
          'mt-0.5 shrink-0 rounded px-1.5 py-0.5 text-xs font-medium',
          DISCLOSURE_TYPE_COLOR[disclosure.pblntf_ty],
        )}
      >
        {DISCLOSURE_TYPE_LABEL[disclosure.pblntf_ty]}
      </span>

      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <Link
          href={viewerUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="truncate text-sm text-gray-900 hover:text-blue-600 hover:underline"
        >
          {disclosure.report_nm}
        </Link>
        <div className="flex items-center gap-2">
          {showCorpName && (
            <Link
              href={`/company/${disclosure.corp_code}`}
              className="text-xs font-medium text-blue-600 hover:underline"
            >
              {disclosure.corp_name}
            </Link>
          )}
          {disclosure.last_reprt_at === 'Y' && (
            <span className="rounded bg-green-50 px-1 py-0.5 text-xs text-green-600">
              최종
            </span>
          )}
          {disclosure.rm && (
            <span className="truncate text-xs text-gray-400">{disclosure.rm}</span>
          )}
        </div>
      </div>
    </div>
  );
}
