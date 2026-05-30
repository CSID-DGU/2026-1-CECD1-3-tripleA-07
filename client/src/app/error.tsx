"use client";

import { useEffect } from "react";

export default function Error({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error("App Error:", error);
  }, [error]);

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-white p-4 text-center">
      <h2 className="mb-4 text-2xl font-bold text-red-600">데이터를 불러오는 중 문제가 발생했습니다.</h2>
      <p className="mb-6 text-gray-600">{error.message || "알 수 없는 에러가 발생했습니다."}</p>
      <button
        onClick={() => unstable_retry()}
        className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition-colors"
      >
        다시 시도하기
      </button>
    </div>
  );
}
