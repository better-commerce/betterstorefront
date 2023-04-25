import Image from "next/image";
import Link from "next/link";

export default function Collections({ data }: any) {
  const css = { maxWidth: "100%", minHeight: "350px" }
  return (
    <div className='grid grid-cols-1 gap-4 sm:grid-cols-3'>
      {data?.map((collection: any, colId: number) => (
        <div className='sm:col-span-1' key={colId}>
          <div className='relative flex flex-col'>
            <div className='shadow image-continer group-hover:shadow-md'>
              <Link href={collection?.collectionlist_link} passHref legacyBehavior>
                <a>
                  <Image src={collection?.collectionlist_image} className='object-cover object-center' alt={collection?.collectionlist_title} width={600} height={800} style={css} />
                </a>
              </Link>
            </div>
            <div className='flex flex-col w-full px-0 py-2 text-left'>
              <h3 className='mt-3 mb-2 text-xl font-bold text-black'>{collection?.collectionlist_title}</h3>
              <div dangerouslySetInnerHTML={{
                __html: collection.collectionlist_shortdescription,
              }}
                className='mb-3 text-sm font-normal text-gray-600 h-14'
              />
              <Link href={collection?.collectionlist_link} passHref legacyBehavior>
                <a className='px-4 py-2 text-lg font-medium text-center text-black bg-transparent border border-black hover:bg-gray-100 hover:shadow-md hover:border-gray-400'>
                  Shop Now
                </a>
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}