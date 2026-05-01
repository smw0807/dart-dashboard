import type { SurgeAlert } from '@/types/dart';
import Link from 'next/link';

interface AlertBannerProps {
  alerts: SurgeAlert[];
}

export function AlertBanner({ alerts }: AlertBannerProps) {
  if (alerts.length === 0) return null;

  return (
    <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
      <div className="mb-2 flex items-center gap-2">
        <span className="text-sm font-semibold text-amber-800">⚠️ 공시 급증 알림</span>
        <span className="text-xs text-amber-600">최근 7일 기준 3배 이상 급증</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {alerts.map((alert) => (
          <Link
            key={alert.corp_code}
            href={`/company/${alert.corp_code}`}
            className="flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs text-amber-800 transition-colors hover:bg-amber-200"
          >
            <span className="font-medium">{alert.corp_name}</span>
            <span className="text-amber-600">
              {alert.recent7}건 ({alert.ratio.toFixed(1)}x)
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
