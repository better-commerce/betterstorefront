export default function Video({ heading, name }: any) {
  return (
    <div className="w-full flex flex-col justify-center items-center max-h-44 md:max-h-full h-[60vh]  /py-y gap-x-2">
      <h1 className="text-gray-900 text-center font-bold text-4xl py-5 ">
        {heading}
      </h1>
      <iframe
        width="560"
        height="315"
        src={`https://www.youtube.com/embed/${name}`}
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="w-full h-full"
      />
    </div>
  )
}
