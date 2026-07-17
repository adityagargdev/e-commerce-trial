import Link from "next/link";

export default function OfflinePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 text-center">
      <div className="text-6xl mb-6">📡</div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">You&apos;re offline</h1>
      <p className="text-gray-500 mb-8 max-w-sm">
        It looks like you lost your internet connection. Check your connection and try again.
      </p>
      <Link
        href="/"
        className="px-6 py-3 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700 transition-colors"
      >
        Try Again
      </Link>
    </div>
  );
}
