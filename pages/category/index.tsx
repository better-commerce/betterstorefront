import type { GetStaticPropsContext } from 'next'
import { getAllCategories } from '@framework/category'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/router'
import NextHead from 'next/head'
import { Layout } from '@components/common'
import {
  IMG_PLACEHOLDER,
  SHOP_BY_CATEGORY,
} from '@components/utils/textVariables'
import { generateUri } from '@commerce/utils/uri-util'
import { SITE_NAME, SITE_ORIGIN_URL } from '@components/utils/constants'
import { STATIC_PAGE_CACHE_INVALIDATION_IN_200_SECONDS } from '@framework/utils/constants'
export default function CategoryList(props: any) {
  let absPath = ''
  if (typeof window !== 'undefined') {
    absPath = window?.location?.href
  }
  const router = useRouter()
  return (
    <>
      <NextHead>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=5"
        />
        <link rel="canonical" id="canonical" href={absPath} />
        <title>Category</title>
        <meta name="title" content="Category" />
        <meta name="description" content="Category" />
        <meta name="keywords" content="Category" />

        <meta property="og:image" content="" />
        <meta property="og:title" content="Category" key="ogtitle" />
        <meta property="og:description" content="Category" key="ogdesc" />
        <meta property="og:site_name" content={SITE_NAME} key="ogsitename" />
        <meta
          property="og:url"
          content={absPath || SITE_ORIGIN_URL + router.asPath}
          key="ogurl"
        />
      </NextHead>
      <main className="w-full px-4 mx-auto sm:px-6 2xl:w-4/5 lg:px-6 2xl:px-0">
        <section aria-labelledby="products-heading ">
          <h1 className="mt-4 tracking-tight pt-5 dark:text-gray-700">
            {SHOP_BY_CATEGORY}
          </h1>
          {props?.data.length > 0 && (
            <div className="flow-root mt-1 sm:mt-0 ">
              <div className="my-0">
                <div className="box-content relative px-0 mt-2">
                  <div className="grid grid-cols-2 my-2 mb-6 gap-x-3 gap-y-3 md:grid-cols-4 lg:grid-cols-4 sm:my-4">
                    {props?.data?.map((category: any, key: number) => (
                      <div
                        key={key}
                        className="bg-gray-100 border border-gray-300 hover:border-gray-400 "
                      >
                        <div className="relative group">
                          <Link key={key} href={`/${category.link}`}>
                            {category?.image ? (
                              <div className="relative overflow-hidden bg-gray-100 aspect-w-1 aspect-h-1 group-hover:bg-gray-200">
                                <Image
                                  src={
                                    `${category?.image}?fm=webp&h=800&w=400` ||
                                    IMG_PLACEHOLDER
                                  }
                                  alt={category.name}
                                  className="object-cover object-center w-full h-auto sm:h-full aspect-[4/3]"
                                  // layout="responsive"
                                  priority
                                  width={600}
                                  height={900}
                                ></Image>
                              </div>
                            ) : (
                              <div className="relative overflow-hidden bg-gray-100 aspect-[4/3] group-hover:bg-gray-200">
                                <Image
                                  src={IMG_PLACEHOLDER}
                                  alt={category.name}
                                  className="object-cover object-center w-full h-auto sm:h-full"
                                  // layout="responsive"
                                  priority
                                  width={600}
                                  height={900}
                                ></Image>
                              </div>
                            )}
                            <span
                              aria-hidden="true"
                              className="absolute inset-x-0 bottom-4 h-1/3 opacity-40"
                            />
                            <h2 className="relative flex items-center justify-center w-full py-3 text-sm tracking-wide text-center text-gray-700 capitalize bg-white lg:mt-auto sm:text-lg bg-opacity-70 bg-nav dark:text-gray-700">
                              {category.name}
                            </h2>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
          {props?.data.length == 0 && (
            <>
              <div className="flex flex-col py-32 text-center">
                <h1 className="w-full mx-auto text-4xl font-bold text-gray-200">
                  No Category Available
                </h1>
              </div>
            </>
          )}
        </section>
      </main>
    </>
  )
}

CategoryList.Layout = Layout

export async function getStaticProps({
  params,
  locale,
  locales,
  preview,
}: GetStaticPropsContext) {
  const data = await getAllCategories()
  return {
    props: {
      data,
    },
    revalidate: STATIC_PAGE_CACHE_INVALIDATION_IN_200_SECONDS
  }
}
