import { useEffect, useState } from 'react'
import withDataLayer, { PAGE_TYPES } from '@components/withDataLayer'
import { useUI } from '@components/ui/context'
import withAuth from '@components/utils/withAuth'
import { isB2BUser } from '@framework/utils/app-util'
import { useTranslation } from '@commerce/utils/use-translation'
import { SaveRFQForm } from '@components/account/RequestForQuote/Form'
import { useRouter } from 'next/router'
import { NEXT_SAVE_RFQ } from '@components/utils/constants'
import axios from 'axios'
import LayoutAccountWithoutNav from '@components/Layout/LayoutAccountWithoutNav'
import Link from 'next/link'
import { ChevronRightIcon } from '@heroicons/react/24/solid'

function SaveRFQ() {
  const router = useRouter()
  const { user, changeMyAccountTab, cartItems, setAlert } = useUI()
  const basketId = router?.query?.basketId?.[0]
  const translate = useTranslation()

  useEffect(() => {
    changeMyAccountTab(translate('label.myAccount.myCompanyMenus.requestQuote'))
  }, [])

  const calculateValidDays = (validUntilDate: any) => {
    const today: any = new Date();
    const validUntil: any = new Date(validUntilDate);
    const msPerDay = 24 * 60 * 60 * 1000;
    return Math.ceil((validUntil - today) / msPerDay);
  };


  // Function to convert date to ISO 8601 format
  const formatToISO8601 = (dateStr: any) => new Date(dateStr).toISOString();


  const handleFormSubmit = async (data: any) => {
    const { products, ...values } = data
    const validUntilISO = formatToISO8601(values.validUntil);
    const validDays = calculateValidDays(values.validUntil);

    const sanitizedData = {
      ...values,
      BasketId: basketId,
      UserId: user?.userId,
      validDays: validDays,
      validUntil: validUntilISO,
      status: "Submitted",
    };
    const result = await axios.post(NEXT_SAVE_RFQ, { data: sanitizedData })
    if (!result?.data) {
      setAlert({ type: 'error', msg: "Something went wrong" })
      return
    }
    else {
      setAlert({ type: 'success', msg: result?.data?.message })
      const rfqId = result?.data?.recordId
      router.push('/my-account/request-for-quote/rfq/' + rfqId)
    }

  }

  useEffect(() => {
    if (!isB2BUser(user)) {
      router.push('/')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className='flex flex-col'>
      <ol role="list" className="flex items-center space-x-0 sm:space-x-0 sm:mb-4 sm:px-0 md:px-0 lg:px-0 2xl:px-0" >
        <li className='flex items-center text-10-mob sm:text-sm'>
          <Link href="/my-account/my-company/shopping-list" passHref>
            <span className="font-light hover:text-gray-900 dark:text-slate-500 text-slate-500" > Shopping List </span>
          </Link>
        </li>
        <li className='flex items-center text-10-mob sm:text-sm'>
          <span className="inline-block mx-1 font-normal hover:text-gray-900 dark:text-black" >
            <ChevronRightIcon className='w-3 h-3'></ChevronRightIcon>
          </span>
        </li>
        <li className="flex items-center text-10-mob sm:text-sm" >
          <span className={`font-semibold hover:text-gray-900 capitalize dark:text-black`} >
            Request For Quote
          </span>
        </li>
      </ol>
      <SaveRFQForm handleFormSubmit={handleFormSubmit} cartItems={cartItems} basketId={basketId} />
    </div>
  )
}

SaveRFQ.LayoutAccountWithoutNav = LayoutAccountWithoutNav
export default withDataLayer(withAuth(SaveRFQ), PAGE_TYPES.RequestQuote, true, LayoutAccountWithoutNav)
