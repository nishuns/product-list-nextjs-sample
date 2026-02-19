'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex h-screen flex-col items-center justify-center p-6 text-center">
      <h2 className="mb-4 text-xl font-bold text-red-600">Something went wrong!</h2>
      <p className="mb-6 text-gray-600">{error.message}</p>
      <button
        className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        onClick={() => reset()}
      >
        Try again
      </button>
    </div>
  );
}
