import SearchBar from './components/SearchBar';
import { getProducts, Product } from './lib/api';
import Link from 'next/link';
import Image from 'next/image';

const ITEMS_PER_PAGE = 8;

export default async function Page(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedSearchParams = await props.searchParams;
  const q = (typeof resolvedSearchParams.q === 'string' ? resolvedSearchParams.q : '').toLowerCase();
  const currentPage = Number(resolvedSearchParams.page) || 1;

  // Fetch all products (server-side fetching)
  // In a real app with search API, we'd pass query params here.
  let allProducts: Product[] = [];
  try {
    allProducts = await getProducts();
  } catch (error) {
    // Let the error boundary handle it, or show empty state
    throw error;
  }

  // Filter products based on search query
  const filteredProducts = allProducts.filter((product) =>
    product.title.toLowerCase().includes(q) ||
    product.description.toLowerCase().includes(q)
  );

  // Pagination Logic
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4 sm:mb-0">Product List</h1>
        <div className="w-full sm:w-1/3">
          <SearchBar />
        </div>
      </div>

      {paginatedProducts.length === 0 ? (
        <div className="text-center text-gray-500 py-12 flex flex-col items-center justify-center min-h-[50vh]">
          <p className="text-lg">No products found matching &quot;{q}&quot;.</p>
          <button className="mt-4 text-blue-600 underline">Clear Search</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
          {paginatedProducts.map((product) => (
            <a key={product.id} href="#" className="group">
              <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-white xl:aspect-h-8 xl:aspect-w-7 p-4 border border-gray-100 flex items-center justify-center h-64 relative">
                <Image
                  src={product.image}
                  alt={product.title}
                  fill
                  className="object-contain object-center group-hover:opacity-75 transition-opacity duration-300"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
              <h3 className="mt-4 text-sm text-gray-700 truncate">{product.title}</h3>
              <p className="mt-1 text-lg font-medium text-gray-900">${product.price}</p>
              <div className="flex items-center mt-1">
                 <div className="flex text-yellow-400">
                   {[...Array(5)].map((_, i) => (
                     <svg key={i} className={`w-4 h-4 ${i < Math.round(product.rating.rate) ? 'fill-current' : 'text-gray-300 fill-current'}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                   ))}
                 </div>
                 <span className="text-xs text-gray-500 ml-1">({product.rating.count})</span>
              </div>
            </a>
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="mt-12 flex items-center justify-center border-t border-gray-200 pt-8">
          <div className="flex gap-2">
            <Link
              href={{
                query: { ...resolvedSearchParams, page: currentPage > 1 ? String(currentPage - 1) : '1' },
              }}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                currentPage === 1
                  ? 'pointer-events-none text-gray-400 bg-gray-50'
                  : 'text-gray-700 hover:bg-gray-100 bg-white border border-gray-300'
              }`}
              aria-disabled={currentPage === 1}
            >
              Previous
            </Link>
            
            {/* Simple page indicator */}
            <span className="px-4 py-2 text-sm text-gray-700">
               Page {currentPage} of {totalPages}
            </span>

            <Link
              href={{
                query: { ...resolvedSearchParams, page: currentPage < totalPages ? String(currentPage + 1) : String(totalPages) },
              }}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                currentPage === totalPages
                  ? 'pointer-events-none text-gray-400 bg-gray-50'
                  : 'text-gray-700 hover:bg-gray-100 bg-white border border-gray-300'
              }`}
              aria-disabled={currentPage === totalPages}
            >
              Next
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
