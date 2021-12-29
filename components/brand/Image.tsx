export default function Image({ name }: any) {
  return (
    <div className="w-full bg-gray-200 rounded-md overflow-hidden aspect-w-1 aspect-h-1">
      <img
        src={name}
        alt={name}
        className="w-full h-full object-center object-cover group-hover:opacity-75"
      />
    </div>
  )
}
