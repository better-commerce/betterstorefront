export default function PlainText(props: any) {
  return (
    <div className="text-gray-900">
      <h1 className="text-xl">{props.heading}</h1>
      <p className="text-lg">{props.name}</p>
      <button
        type="button"
        className={`max-w-xs flex-1 bg-indigo-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center font-medium text-white hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:bg-indigo-400 sm:w-full`}
      >
        {props.buttonLink}
      </button>
    </div>
  )
}
