import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-paper px-6">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-mist-500">
        404 Not Found
      </p>
      <h1 className="mt-4 font-serif text-3xl font-bold text-ink">
        お探しのページが見つかりません
      </h1>
      <p className="mt-3 text-sm text-mist-600">
        URLが変更されたか、削除された可能性があります。
      </p>
      <Link
        href="/"
        className="mt-8 border-b border-ink pb-0.5 text-sm font-semibold text-ink hover:opacity-70"
      >
        トップページへ戻る
      </Link>
    </div>
  );
}
