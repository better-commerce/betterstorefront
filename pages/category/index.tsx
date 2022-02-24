import type { GetStaticPropsContext } from 'next'
import { getAllCategories } from '@framework/category'
import Link from 'next/link'
import { Layout } from '@components/common'

export default function CategoryList(props: any) {
  console.log(props.data)
  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:max-w-7xl lg:px-8">
      <section aria-labelledby="products-heading" className="mt-8">
        <h2 className="text-2xl font-extrabold tracking-tight text-gray-900">
          Shop by Category
        </h2>

        <div className="mt-4 flow-root">
          <div className="my-2">
            <div className="box-content py-2 relative">
              <div className="min-w-screen-xl px-4 flex space-x-8 sm:px-6 lg:px-8 xl:relative xl:px-0 xl:space-x-0 xl:grid xl:grid-cols-5 xl:gap-8">
                {props.data.map((category: any, key: number) => (
                  <Link key={key} href={`/${category.link}`}>
                      <a
                        key={category.id}
                        href={`/${category.link}`}
                        className="relative w-56 h-80 rounded-lg p-6 flex flex-col overflow-hidden hover:opacity-75 xl:w-auto"
                      >
                        <span
                      aria-hidden="true"
                      className="absolute inset-x-0 top-0 h-full bg-gradient-to-b from-gray-100 opacity-90"
                    />
                    <span aria-hidden="true" className="absolute inset-0">
                      <img src={category.image || 'https://tailwindui.com/img/ecommerce-images/category-page-01-image-card-11.jpg' } alt="" className="object-center object-cover" />
                    </span>
                    <span
                      aria-hidden="true"
                      className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-gray-900 opacity-40"
                    />
                    <span className="relative mt-auto text-center text-xl font-bold text-white">{category.name}</span>
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
      data,
    },
    revalidate: 200,
  }
}
