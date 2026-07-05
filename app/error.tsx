"use client";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-paper px-6">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-mist-500">
        Error
      </p>
      <h1 className="mt-4 font-serif text-3xl font-bold text-ink">
        問題が発生しました
      </h1>
      <p className="mt-3 text-sm text-mist-600">
        一時的なエラーの可能性があります。再読み込みをお試しください。
      </p>
      <button
        onClick={reset}
        className="mt-8 border border-ink px-6 py-2 text-sm font-semibold text-ink hover:bg-ink hover:text-paper"
      >
        再読み込み
      </button>
    </div>
  );
}
