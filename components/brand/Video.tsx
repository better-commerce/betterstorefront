export default function Video({ heading, name }: any) {
  return (
    <div>
      <h1 className="text-gray-900 font-bold text-xl">{heading}</h1>
      <iframe
        width="560"
        height="315"
        src={name}
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  )
}
