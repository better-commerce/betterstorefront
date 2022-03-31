import type { GetStaticPropsContext } from 'next'
import { getAllCategories } from '@framework/category'
import Link from 'next/link'
import Image from 'next/image'
import { Layout } from '@components/common'
import {
  IMG_PLACEHOLDER,
  SHOP_BY_CATEGORY,
} from '@components/utils/textVariables'
export default function CategoryList(props: any) {
  console.log(props.data)
  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:max-w-7xl lg:px-8">
      <section aria-labelledby="products-heading" className="mt-8">
        <h2 className="text-2xl font-extrabold tracking-tight text-gray-900">
          {SHOP_BY_CATEGORY}
        </h2>

        <div className="sm:mt-4 mt-8 flow-root">
          <div className="my-0">
            <div className="box-content relative">
              <div className="sm:py-6 py-1 grid grid-cols-2 sm:gap-y-8 gap-y-6 sm:grid-cols-4 gap-x-6 lg:grid-cols-5 xl:gap-x-8">
                {props.data.map((category: any, key: number) => (
                  <Link key={key} href={`/${category.link}`}>
                    <a
                      key={category.id}
                      href={`/${category.link}`}
                      className="relative sm:w-56 sm:h-80 h-60 w-full rounded-lg p-6 flex flex-col overflow-hidden hover:opacity-75 xl:w-auto"
                    >
                      <span
                        aria-hidden="true"
                        className="absolute inset-x-0 top-0 h-full bg-gradient-to-b from-gray-100 opacity-90"
                      />
                      <span aria-hidden="true" className="absolute inset-0">
                        <div className="image-container">
                          <Image
                            src={category.image || IMG_PLACEHOLDER}
                            alt={category.name}
                            className="w-full h-full object-center object-cover group-hover:opacity-75 image"
                            layout="fill"
                          ></Image>
                        </div>
                      </span>
                      <span
                        aria-hidden="true"
                        className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-gray-900 opacity-40"
                      />
                      <span className="relative mt-auto text-center sm:text-xl text-sm font-bold text-white">
                        {category.name}
                      </span>
                    </a>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
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
      data: data || [],
    },
    revalidate: 200,
  }
}
