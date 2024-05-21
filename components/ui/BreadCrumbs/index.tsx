import Link from 'next/link'
import { ChevronRightIcon } from '@heroicons/react/24/outline'
import { useTranslation } from '@commerce/utils/use-translation'
interface Props {
  items: []
  currentProduct: any
}

export default function BreadCrumbs({ items = [], currentProduct }: Props) {
  const translate = useTranslation()
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

  const flattenedItems = createBreadcrumbs(items)
  return (
    <ol role="list" className="flex items-center space-x-0 truncate sm:space-x-0 sm:mb-4 sm:px-0 md:px-0 lg:px-0 2xl:px-0 dark:bg-white" >
      <li className='flex items-center text-10-mob sm:text-sm'>
        <Link href="/" passHref>
          <span className="font-light hover:text-gray-900 dark:text-slate-500 text-slate-500" > {translate('common.label.homeText')} </span>
        </Link>
      </li>
      <li className='flex items-center text-10-mob sm:text-sm'>
        <span className="inline-block mx-1 font-normal hover:text-gray-900 dark:text-black" >
          <ChevronRightIcon className='w-3 h-3'></ChevronRightIcon>
        </span>
      </li>
      {flattenedItems.map((breadcrumb: any, breadcrumbIdx: number) => (
        <li key={breadcrumbIdx} className={`flex items-center text-10-mob sm:text-sm ${breadcrumbIdx === flattenedItems.length - 1 ? 'truncate' : ''}`} >
          <Link href={`/${breadcrumb.slug}`} className={`${breadcrumbIdx === flattenedItems.length - 1 ? 'truncate' : ''}`} passHref>
            <span className={`font-light hover:text-gray-900 capitalize  ${breadcrumb.isCurrent ? ' font-medium text-black dark:text-black' : 'text-slate-500 dark:text-slate-500'}`} >
              {breadcrumb?.title?.toLowerCase()}
            </span>
          </Link>
          {breadcrumbIdx !== flattenedItems.length - 1 && (
            <ChevronRightIcon className='w-3 h-3 mx-1 dark:text-black'></ChevronRightIcon>
          )}
        </li>
      ))}
    </ol>
  )
}
