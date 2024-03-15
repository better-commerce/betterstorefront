import { generateUri } from '@commerce/utils/uri-util'
import { IMG_PLACEHOLDER } from '@components/utils/textVariables'
import Link from 'next/link'
import { useTranslation } from '@commerce/utils/use-translation'

export default function Collections({ data }: any) {
  const translate = useTranslation()
  const css = { maxWidth: '100%', minHeight: '350px' }
  return (
    <div className="grid lg:grid-cols-3 md:grid-cols-3 grid-cols-1 gap-4 sm:grid-cols-3 lg:px-6 2xl:px-0">
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
              <img
                src={
                  generateUri(
                    collection?.collectionlist_image,
                    'h=300&fm=webp'
                  ) || IMG_PLACEHOLDER
                }
                className="object-cover object-center cursor-pointer"
                alt={collection?.collectionlist_title || "collection-image"}
                width={500}
                height={300}
                style={css}
              />
            </Link>
          </div>
          <div className="flex flex-col w-full px-0 py-2 text-left h-full">
            <div className="mt-3 mb-2 font-bold text-black">
              {collection?.collectionlist_title}
            </div>
            <div
              dangerouslySetInnerHTML={{
                __html: collection.collectionlist_shortdescription,
              }}
              className="h-auto mb-3 font-normal text-gray-600 min-height-65"
            />
            <Link
              href={collection?.collectionlist_link}
              title={translate('common.label.shopNowText')}
              passHref
              legacyBehavior
            >
              <a className="btn border btn-default">
                {translate('common.label.shopNowText')}
              </a>
            </Link>
          </div>
        </div>
      ))}
    </div>
  )
}