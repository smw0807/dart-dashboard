export default function CompanyPage({ params }: { params: { code: string } }) {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">기업 공시 상세</h1>
      <p className="text-gray-500">고유번호: {params.code}</p>
    </div>
  );
}
