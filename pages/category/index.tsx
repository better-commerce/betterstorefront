import type { GetStaticPropsContext } from 'next'
import { getAllCategories } from '@framework/category'
import Link from 'next/link'
import { Layout } from '@components/common'

export default function CategoryList(props: any) {
  console.log(props.data)
  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:max-w-7xl lg:px-8">
      <section aria-labelledby="products-heading" className="mt-8">
        <h2 className="text-gray-900 font-bold text-center text-2xl m-8">
          Categories
        </h2>

        <div className="py-2 grid grid-cols-1 gap-y-5 sm:grid-cols-3 gap-x-6 lg:grid-cols-5 xl:gap-x-5">
          {props.data.map((category: any, key: number) => (
            <Link key={key} href={`/${category.link}`}>
              <a
                key={category.id}
                href={`/${category.link}`}
                className="group"
              >
                <div className="relative w-full aspect-w-1 bg-gray-200 aspect-h-1 rounded-lg overflow-hidden sm:aspect-w-3 sm:aspect-h-3">
                  <img
                    src={
                      category.image ||
                      '/noimagefound.png'
                    }
                    // alt={category.imageAlt}
                    className="w-full h-full object-center object-cover group-hover:opacity-75"
                  />
                  <h1
                    style={{
                      backgroundColor: 'rgba(255,255,255,0.6',
                      paddingLeft: '5%',
                      top: '85%',
                    }}
                    className="w-8/10 px-2 absolute uppercase text-gray-900 font-semibold text-md"
                  >
                    {category.name}
                  </h1>
                </div>
              </a>
            </Link>
          ))}
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
