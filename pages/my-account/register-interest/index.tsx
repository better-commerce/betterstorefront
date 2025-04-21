import { useState, useEffect } from 'react'
import withDataLayer, { PAGE_TYPES } from '@components/withDataLayer'
import withAuth from '@components/utils/withAuth'
import { useRouter } from 'next/router'
import { EVENTS_MAP } from '@components/services/analytics/constants'
import useAnalytics from '@components/services/analytics/useAnalytics'
import { useUI } from '@components/ui/context'
import React from 'react'
import { useTranslation } from '@commerce/utils/use-translation'
import LayoutAccount from '@components/Layout/LayoutAccount'
import { IPagePropsProvider } from '@framework/contracts/page-props/IPagePropsProvider'
import { getPagePropType, PagePropType } from '@framework/page-props'
import { AnalyticsEventType } from '@components/services/analytics'
import { NEXT_DELETE_CUSTOMER_PRODUCT_INTEREST, NEXT_GET_CUSTOMER_PRODUCT_INTEREST } from '@components/utils/constants'
import axios from 'axios'
import { generateUri } from '@commerce/utils/uri-util'
import { IMG_PLACEHOLDER } from '@components/utils/textVariables'
import Link from 'next/link'
import { sanitizeRelativeUrl } from '@framework/utils/app-util'
import { TrashIcon } from '@heroicons/react/24/outline'
import productInterestHandler from '../../../components/services/product-interest'

function InterestProducts() {
  const [interestProducts, setInterestProducts] = useState([])
  const { user, isGuestUser, changeMyAccountTab, setAlert } = useUI()
  const router = useRouter()
  const { Customer } = EVENTS_MAP.ENTITY_TYPES
  const { removeFromProductInterest } = productInterestHandler()
  const removeProductInterest = async (productId: any) => {
    removeFromProductInterest(
      user?.userId,
      productId,
      () => {
        setAlert({
          type: 'success',
          msg: 'Product interest removed successfully'
        })
        getUserInterestProducts() // Refresh the list
      },
      (error) => {
        setAlert({
          type: 'error',
          msg: error?.response?.data?.message || 'Failed to remove product interest'
        })
      }
    )
  }
  const getUserInterestProducts = async () => {
    try {
      const response = await axios.post(NEXT_GET_CUSTOMER_PRODUCT_INTEREST, {
        id: user?.userId,
      })
      setInterestProducts(response.data)
    } catch (error) {
      console.log(error, 'error')
    }
  }

  useEffect(() => {
    getUserInterestProducts()
    if (isGuestUser) {
      router.push('/')
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  let loggedInEventData: any = { eventType: AnalyticsEventType.CUSTOMER_PROFILE_VIEWED, entityType: Customer, }

  if (user && user.userId) {
    loggedInEventData = { ...loggedInEventData, ...user, }
  }
  useEffect(() => {
    changeMyAccountTab("I'm Interested In")
  }, [])
  useAnalytics(AnalyticsEventType.CUSTOMER_PROFILE_VIEWED, loggedInEventData)

  return (
    <>
      <h1 className='text-xl font-normal sm:text-2xl dark:text-black'>I'm Interested In</h1>
      <div className='grid grid-cols-4 gap-4 my-2 bg-white dark:bg-transparent sm:my-6'>
        {interestProducts ? (
          <>
            {interestProducts?.map((product: any, index: number) => (
              <div className='relative flex flex-col p-3 border border-gray-200 rounded group hover:shadow hover:border-gray-300' key={index}>
                <Link href={sanitizeRelativeUrl(product?.slug)} passHref>
                  <div className="relative flex w-full h-0 aspect-w-11 aspect-h-12 product-card__image">
                    <img src={generateUri(product?.image, 'h=400&fm=webp') || IMG_PLACEHOLDER} className={`object-contain object-top w-full h-full`} alt={product?.name} />
                  </div>
                </Link>
                <span className='absolute opacity-0 -top-2 -right-2 group-hover:opacity-100 z-9'>
                  <TrashIcon className='w-8 h-8 p-2 text-red-500 bg-gray-200 rounded-full cursor-pointer' onClick={() => removeProductInterest(product?.recordId)} />
                </span>
                <span className="absolute justify-start flex-1 px-3 py-2 font-normal text-center text-white uppercase bg-orange-500 rounded-full text-x-small left-2 top-2 z-8">Pre Launch</span>
                <div className='flex flex-col justify-start w-full gap-2 mt-2'>
                  <h2 className="text-base text-left product-card-title font-semibold transition-colors dark:text-black min-h-[60px] nc-ProductCard__title product-card__brand">{product?.name}</h2>
                </div>
              </div>
            ))}
          </>
        ) : (
          <>
            <div className="flex flex-col w-full px-4 py-12 max-acc-container sm:px-0">
              <h1 className="my-2 text-2xl font-semibold text-black dark:text-white">No Product Found</h1>
              <div className="flex mt-5 w-60 sm:flex-col">
                <Link legacyBehavior passHref href="/">
                  <a className="w-full flex items-center justify-center px-4 py-3 -mr-0.5 rounded-sm sm:px-6 link-button btn-primary">Start Shopping</a>
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  )
}

InterestProducts.LayoutAccount = LayoutAccount

const PAGE_TYPE = PAGE_TYPES.MyAccount

export async function getServerSideProps(context: any) {
  const { locale } = context
  const props: IPagePropsProvider = getPagePropType({ type: PagePropType.COMMON })
  const pageProps = await props.getPageProps({ cookies: context?.req?.cookies })

  return {
    props: {
      ...pageProps,
    }, // will be passed to the page component as props
  }
}

export default withDataLayer(withAuth(InterestProducts), PAGE_TYPE, true, LayoutAccount)
