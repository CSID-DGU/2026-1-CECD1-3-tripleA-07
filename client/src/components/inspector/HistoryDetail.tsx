export default function HistoryDetail({ id }: { id: number }) {
  return (
    <div className="h-full p-8 bg-gray-50/50">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">이력 상세 (임시)</h2>
      <p className="text-sm text-gray-600">선택된 이력 ID: {id}</p>
      <p className="text-sm text-gray-400 mt-2">실제 데이터는 추후 연결 예정</p>
    </div>
  );
}
