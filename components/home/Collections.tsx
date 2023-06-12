import Image from 'next/image'
import Link from 'next/link'

export default function Collections({ data }: any) {
  const css = { maxWidth: '100%', minHeight: '350px' }
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {data?.map((collection: any, colId: number) => (
        <div
          className="relative flex flex-col sm:col-span-1"
          key={`collection-${colId}`}
        >
          <div className="shadow image-continer group-hover:shadow-md">
            <Link
              href={collection?.collectionlist_link}
              title={collection?.collectionlist_title}
              passHref
              legacyBehavior
            >
              <Image
                src={collection?.collectionlist_image}
                className="object-cover object-center cursor-pointer"
                alt={collection?.collectionlist_title}
                width={600}
                height={800}
                style={css}
              />
            </Link>
          </div>
          <div className="flex flex-col w-full px-0 py-2 text-left">
            <h4 className="mt-3 mb-2 font-bold text-black">
              {collection?.collectionlist_title}
            </h4>
            <div
              dangerouslySetInnerHTML={{
                __html: collection.collectionlist_shortdescription,
              }}
              className="mb-3 font-normal text-gray-600 h-14"
            />
            <Link
              href={collection?.collectionlist_link}
              title="Shop Now"
              passHref
              legacyBehavior
            >
              <a className="px-4 py-2 text-lg font-medium text-center border btn-default">
                Shop Now
              </a>
            </Link>
          </div>
        </div>
      ))}
    </div>
  )
}
