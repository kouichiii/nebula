export default function ArticlesLoading() {
  return (
    <div className="max-w-4xl mx-auto animate-pulse">
      <h1 className="text-3xl font-bold text-purple-800 mb-8 bg-purple-100 h-10 w-1/3 rounded" />
      <div className="space-y-6">
        {[...Array(3)].map((_, i) => (
          <article
            key={i}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <div className="h-6 w-2/3 bg-purple-100 rounded mb-4" />
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-full bg-purple-100 mr-3" />
              <div>
                <div className="h-4 w-24 bg-purple-100 rounded mb-1" />
                <div className="h-3 w-40 bg-gray-100 rounded" />
              </div>
            </div>
            <div className="h-4 w-full bg-gray-100 rounded mb-4" />
            <div className="flex items-center justify-between text-sm text-gray-300 mb-2">
              <div className="h-3 w-20 bg-gray-100 rounded" />
              <div className="h-3 w-16 bg-purple-100 rounded" />
            </div>
            <div className="flex flex-wrap gap-2 mb-2">
              <div className="h-5 w-14 bg-purple-50 rounded-full" />
              <div className="h-5 w-10 bg-purple-50 rounded-full" />
            </div>
          </article>
        ))}
      </div>
    </div>
  );
} 