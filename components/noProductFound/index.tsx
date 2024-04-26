export default function NoProductFound() {
  return (
    <div className="flex flex-col items-center mt-10 justify-">
      <div className="bg-gray-400 w-12 h-12 flex items-center justify-center transform rotate-45">
        <span className="text-white font-bold -rotate-45">!</span>
      </div>
      <p className="text-gray-600 font-medium text-center text-lg mt-6">
        Sorry! We couldn't find any matching items.
      </p>
      <p className="text-gray-500 text-center text-sm mt-4">
        Don't give up - check the spelling, Filters or try less specific search
        terms
      </p>
    </div>
  )
}
