import Link from 'next/link'
import { ChevronRightIcon } from '@heroicons/react/24/outline'
interface Props {
  items: []
  currentProduct: any
}

export default function BreadCrumbs({ items = [], currentProduct }: Props) {
  const flattenBreadcrumbs = (breadcrumbs: any) => {
    let flattenedItems: [] = []
    const flatten = (items: any, key: string) => {
      items.reduce((acc: any, obj: any) => {
        acc.push(obj[key])
        if (obj[key] && obj[key].childSlug) {
          flatten([{ childSlug: obj[key].childSlug }], 'childSlug')
        }
        return acc
      }, flattenedItems)
    }
    flatten(breadcrumbs, 'slug')
    return flattenedItems
  }

  const createBreadcrumbs = (items: any = []) => {
    const map: any = flattenBreadcrumbs(items)
    const currentCrumb: any = {
      title: currentProduct.name,
      slug: '#',
      isCurrent: true,
    }
    map.push(currentCrumb)
    return map
  }

  //const [flattenedItems, setFlattenedItems] = useState(createBreadcrumbs(items))
  const flattenedItems = createBreadcrumbs(items)
  return (
    <ol
      role="list"
      className="flex items-center space-x-0 sm:space-x-0 sm:mb-4 sm:px-0 md:px-0 lg:px-0 2xl:px-0"
    >
      <li className='flex items-center text-10-mob sm:text-sm'>
        <Link href="/" passHref>
          <span
            className="font-normal hover:text-gray-900 dark:text-black"
          >
            Home
          </span>
        </Link>
      </li>
      <li className='flex items-center text-10-mob sm:text-sm'>
        <span
          className="font-normal hover:text-gray-900 mx-1 inline-block dark:text-black"
        >
          <ChevronRightIcon className='h-3 w-3'></ChevronRightIcon>
        </span>
      </li>
      {flattenedItems.map((breadcrumb: any, breadcrumbIdx: number) => (
        <li
          key={breadcrumbIdx}
          className="flex items-center text-10-mob sm:text-sm"
        >
          <Link href={`/${breadcrumb.slug}`} passHref>
            <span
              className={`font-normal hover:text-gray-900 ${breadcrumb.isCurrent ? 'text-black font-semibold' : 'text-black'
                }`}
            >
              {breadcrumb.title}
            </span>
          </Link>
          {breadcrumbIdx !== flattenedItems.length - 1 && (
            <svg
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              aria-hidden="true"
              className="flex-shrink-0 w-4 h-4 ml-0 text-gray-300 sm:ml-0"
            >
              <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
            </svg>
          )}
        </li>
      ))}
    </ol>
  )
}
