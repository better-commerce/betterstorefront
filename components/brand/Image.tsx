import { generateUri } from "@commerce/utils/uri-util";
import { IMG_PLACEHOLDER } from "@components/utils/textVariables";

export default function Image({ name, heading }: any) {
  return (
    <div className="w-full flex flex-col justify-center items-center py-y">
      <h1 className="text-gray-900 text-center font-bold text-4xl py-5 ">
        {heading}
      </h1>
      <div className="w-full bg-gray-200 rounded-md overflow-hidden aspect-w-1 aspect-h-1">
        <img
          src={generateUri(name,'h=200&fm=webp')||IMG_PLACEHOLDER}
          alt={name||'product-image'}
          className="w-full h-full object-center object-cover group-hover:opacity-75"
          height={200}
          width={220}
        />
      </div>
    </div>
  )
}
