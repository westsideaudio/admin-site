'use client';

export default function ProductListSkeleton() {
  return (
    <div className="w-full">
      {/* Filters Skeleton */}
      <div className="p-4 border-b border-border flex flex-col md:flex-row justify-between items-center gap-4 bg-card rounded-t-lg">
        <div className="w-full md:w-auto flex flex-col sm:flex-row gap-2 items-center">
          <div className="h-10 w-full md:w-48 bg-muted rounded-md animate-pulse"></div>
          <div className="h-10 w-full md:w-48 bg-muted rounded-md animate-pulse"></div>
        </div>
        <div className="h-5 w-32 bg-muted rounded animate-pulse"></div>
      </div>

      {/* Desktop Table Skeleton */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-muted-foreground uppercase bg-muted/50">
            <tr>
              <th className="py-3 px-4 font-medium">Product</th>
              <th className="py-3 px-4 font-medium">Category</th>
              <th className="py-3 px-4 font-medium">Price</th>
              <th className="py-3 px-4 font-medium">Stock</th>
              <th className="py-3 px-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {[...Array(5)].map((_, index) => (
              <tr key={index} className="animate-pulse">
                <td className="py-3 px-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-muted rounded-md"></div>
                    <div className="h-4 bg-muted rounded w-40"></div>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="h-4 bg-muted rounded w-24"></div>
                </td>
                <td className="py-3 px-4">
                  <div className="h-4 bg-muted rounded w-16"></div>
                </td>
                <td className="py-3 px-4">
                  <div className="h-4 bg-muted rounded w-12"></div>
                </td>
                <td className="py-3 px-4">
                  <div className="flex justify-end items-center space-x-2">
                    <div className="w-8 h-8 bg-muted rounded-md"></div>
                    <div className="w-8 h-8 bg-muted rounded-md"></div>
                    <div className="w-8 h-8 bg-muted rounded-md"></div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards Skeleton */}
      <div className="md:hidden p-4 space-y-4 bg-muted/10">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="bg-card border border-border rounded-lg shadow-sm p-4 animate-pulse">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 bg-muted rounded-md"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded w-32"></div>
                  <div className="h-3 bg-muted rounded w-20"></div>
                </div>
              </div>
              <div className="text-right space-y-2">
                <div className="h-5 bg-muted rounded w-16"></div>
                <div className="h-3 bg-muted rounded w-20"></div>
              </div>
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-border mt-3">
              <div className="h-8 bg-muted rounded w-24"></div>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-muted rounded-md"></div>
                <div className="w-10 h-10 bg-muted rounded-md"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}