import { useEffect, useState } from 'react'
import withDataLayer, { PAGE_TYPES } from '@components/withDataLayer'
import { useUI } from '@components/ui/context'
import withAuth from '@components/utils/withAuth'
import { isB2BUser } from '@framework/utils/app-util'
import { useTranslation } from '@commerce/utils/use-translation'
import LayoutAccount from '@components/Layout/LayoutAccount'
import { SaveRFQForm } from '@components/account/RFQComponents/SaveRFQForm'
import { useRouter } from 'next/router'
import { NEXT_SAVE_RFQ } from '@components/utils/constants'
import axios from 'axios'

function SaveRFQ() {
  const router = useRouter()
  const { user, changeMyAccountTab, cartItems, setAlert  } = useUI()
  const basketId = router?.query?.basketId?.[0]
  const translate = useTranslation()

  useEffect(() => {
    changeMyAccountTab(translate('label.myAccount.myCompanyMenus.requestQuote'))
  }, [])

  const calculateValidDays = (validUntilDate :any) => {
    const today:any = new Date();
    const validUntil:any = new Date(validUntilDate);
    const msPerDay = 24 * 60 * 60 * 1000; 
    return Math.ceil((validUntil - today) / msPerDay);
  };
  

  // Function to convert date to ISO 8601 format
  const formatToISO8601 = (dateStr:any) => new Date(dateStr).toISOString();


  const handleFormSubmit = async (data: any) => {
    const { products, ...values} = data
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
    const result = await axios.post(NEXT_SAVE_RFQ, {data : sanitizedData})
    if (!result?.data) {
      setAlert({ type: 'error', msg: "Something went wrong" })
      return
    }
    else{
      setAlert({ type: 'success', msg: result?.data?.message })
      const rfqId = result?.data?.recordId
      router.push('/my-account/requests-for-quote/rfq/' + rfqId)
    }
    
  }
  
  useEffect(() => {
    if (!isB2BUser(user)) {
      router.push('/')
    } 
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <SaveRFQForm handleFormSubmit={handleFormSubmit} cartItems={cartItems} basketId={basketId} />
  )
}

SaveRFQ.LayoutAccount = LayoutAccount
export default withDataLayer(withAuth(SaveRFQ), PAGE_TYPES.RequestQuote, true, LayoutAccount)
