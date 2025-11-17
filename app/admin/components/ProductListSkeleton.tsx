'use client';

export default function ProductListSkeleton() {
  return (
    <div className="overflow-x-auto w-full">
      <table className="min-w-full bg-white border border-gray-200">
        <thead className="hidden md:table-header-group">
          <tr>
            <th className="py-2 px-4 text-left">Product</th>
            <th className="py-2 px-4 text-left hidden md:table-cell">Category</th>
            <th className="py-2 px-4 text-left hidden md:table-cell w-24">Price</th>
            <th className="py-2 px-4 text-right md:text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {[...Array(5)].map((_, index) => (
            <tr key={index} className="grid grid-cols-1 md:table-row border-b border-gray-200 mb-4 md:mb-0 p-2 md:p-0 gap-2 animate-pulse">
              <td className="py-2 px-4 flex items-center md:table-cell col-span-1">
                <div className="flex items-center space-x-2">
                  <div className="h-12 w-12 bg-gray-300 rounded-md"></div>
                  <div className="h-6 bg-gray-300 rounded w-3/4"></div>
                </div>
              </td>
              <td className="py-2 px-4 hidden md:table-cell col-span-1">
                <div className="h-6 bg-gray-300 rounded w-1/2"></div>
              </td>
              <td className="py-2 px-4 hidden md:table-cell col-span-1">
                <div className="h-6 bg-gray-300 rounded w-1/4"></div>
              </td>
              <td className="py-2 px-4 flex justify-end md:justify-start items-center space-x-2 col-span-1">
                <div className="h-6 w-6 bg-gray-300 rounded-md"></div>
                <div className="h-6 w-6 bg-gray-300 rounded-md"></div>
                <div className="h-6 w-6 bg-gray-300 rounded-md"></div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}