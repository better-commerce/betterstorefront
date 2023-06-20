import type { GetStaticPropsContext } from 'next'
import { getAllCategories } from '@framework/category'
import Link from 'next/link'
import Image from 'next/image'
import { Layout } from '@components/common'
import {
  IMG_PLACEHOLDER,
  SHOP_BY_CATEGORY,
} from '@components/utils/textVariables'
import { generateUri } from '@commerce/utils/uri-util'
export default function CategoryList(props: any) {
  const css = { maxWidth: '100%', height: 'auto' }
  return (
    <main className="w-full px-4 mx-auto sm:px-0 md:w-4/5 lg:px-0">
      <section aria-labelledby="products-heading ">
        <h1 className="tracking-tight  mt-4 dark:text-gray-700">
          {SHOP_BY_CATEGORY}
        </h1>
        {props?.data.length > 0 && (
          <div className="flow-root mt-1 sm:mt-0 ">
            <div className="my-0">
              <div className="box-content relative px-0 mt-2">
                <div className="grid gap-x-3 gap-y-3 grid-cols-2 md:grid-cols-4 lg:grid-cols-4 my-2 mb-6 sm:my-4">
                  {props?.data?.map((category: any, key: number) => (
                    <div key={key} className="bg-gray-100 border border-gray-300 hover:border-gray-400 ">
                      <div className="relative group">
                        <Link key={key} href={`/${category.link}`}>
                          {category?.image ? (
                            <div className=" relative overflow-hidden bg-gray-100 aspect-w-1 aspect-h-1 group-hover:bg-gray-200 ">
                              <Image
                                src={
                                  `${category?.image}?fm=webp&h=800&w=400` ||
                                  IMG_PLACEHOLDER
                                }
                                alt={category.name}
                                className="object-cover object-center w-full h-full sm:h-full"
                                layout="responsive"
                                width={600}
                                height={900}
                              ></Image>
                            </div>
                          ) : (
                            <div className=" relative overflow-hidden bg-gray-100 aspect-w-1 aspect-h-1 group-hover:bg-gray-200 ">
                              <Image
                                src={IMG_PLACEHOLDER}
                                alt={category.name}
                                className="object-cover object-center w-full h-full sm:h-full"
                                layout="responsive"
                                width={600}
                                height={900}
                              ></Image>
                            </div>
                          )}
                          <span
                            aria-hidden="true"
                            className="absolute inset-x-0 bottom-4 h-1/3 opacity-40"
                          />
                          <h2 className="relative w-full flex justify-center items-center lg:mt-auto  text-sm text-center text-gray-700 capitalize sm:text-lg py-3 bg-white tracking-wide bg-opacity-70 bg-nav dark:text-gray-700">
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
    revalidate: 200,
  }
}
