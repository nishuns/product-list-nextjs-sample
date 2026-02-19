export default function Loading() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 p-6">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="animate-pulse rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <div className="mb-4 h-48 rounded bg-gray-200"></div>
          <div className="mb-2 h-4 w-3/4 rounded bg-gray-200"></div>
          <div className="h-4 w-1/2 rounded bg-gray-200"></div>
        </div>
      ))}
    </div>
  );
}
