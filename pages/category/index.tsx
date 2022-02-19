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

        <div className="py-10 grid grid-cols-1 gap-y-10 sm:grid-cols-2 gap-x-6 lg:grid-cols-3 xl:gap-x-8">
          {props.data.map((category: any) => (
            <Link href={`/category/${category.slug}`}>
              <a
                key={category.id}
                href={`/category/${category.slug}`}
                className="group"
              >
                <div className="relative w-full aspect-w-1 aspect-h-1 rounded-lg overflow-hidden sm:aspect-w-2 sm:aspect-h-3">
                  <img
                    src={
                      category.image ||
                      'https://tailwindui.com/img/ecommerce-images/category-page-01-image-card-01.jpg'
                    }
                    // alt={category.imageAlt}
                    className="w-full h-full object-center object-cover group-hover:opacity-75"
                  />
                  <h1
                    style={{
                      backgroundColor: 'rgba(255,255,255,0.4',
                      paddingLeft: '5%',
                      top: '90%',
                    }}
                    className="w-8/10 px-2 absolute text-gray-900 font-bold text-xl"
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
