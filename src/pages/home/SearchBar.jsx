export function SearchBar() {
  return (
    <div className="flex w-full max-w-md gap-2">
      <div className="relative flex grow">
        <input
          type="text"
          className="block w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-3 leading-5 placeholder-gray-500 focus:border-gray-800 focus:placeholder-gray-500500 focus:placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-800 sm:text-sm"
          placeholder="Search loans..."
        />
      </div>
      <button
        type="button"
        className="inline-flex items-center rounded-lg border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
      >
        Search
      </button>
    </div>
  );
}