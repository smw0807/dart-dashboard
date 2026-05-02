interface ChartCardProps {
  title: string;
  isLoading: boolean;
  skeletonHeight?: string;
  children: React.ReactNode;
}

export function ChartCard({ title, isLoading, skeletonHeight = 'h-48', children }: ChartCardProps) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-5">
      <h2 className="mb-4 text-sm font-semibold text-gray-700">{title}</h2>
      {isLoading ? (
        <div className={`${skeletonHeight} animate-pulse rounded bg-gray-100`} />
      ) : (
        children
      )}
    </div>
  );
}
