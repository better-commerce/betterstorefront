import { Fragment, useCallback, useState } from 'react'
import moment from 'moment'
import axios from 'axios'
import { useRouter } from 'next/router'

//
import { Button, Input, useUI } from '@components/ui'
import { EmptyGuid, EmptyString, NEXT_B2B_SAVE_QUOTE } from '@components/utils/constants'
import { isB2BUser, logError } from '@framework/utils/app-util'
import { AlertType } from '@framework/utils/enums'
import { useTranslation } from '@commerce/utils/use-translation'
import { QuoteStatus } from '@components/utils/constants'
import SaveQuoteSuccessModal from './SaveQuoteSuccessModal'

interface SaveB2BQuoteProps {
  basket: any
}

export default function SaveB2BQuote({ basket }: SaveB2BQuoteProps) {
  const [formValues, setFormValues] = useState({
    purchaseOrderNo: EmptyString,
  })
  const [isQuoteSaving, setIsQuoteSaving] = useState(false)
  const [isQuoteSuccessOpen, setIsQuoteSuccessOpen] = useState(false)
  const [quoteDetails, setQuoteDetails] = useState(undefined)
  const { user, setAlert, setOverlayLoaderState, hideOverlayLoaderState, setCartItems } = useUI()
  const translate = useTranslation()
  const router = useRouter()

  const onChange = (name: string, value: any) => {
    setFormValues((v) => ({ ...v, [name]: value }))
  }

  const onSaveQuote = useCallback(
    async (e: any) => {
      try {
        e.preventDefault()
        if (!basket?.id || basket?.id === EmptyGuid) return

        setOverlayLoaderState({ visible: true, message: translate('label.checkoutForm.pleaseWaitText') })
        setIsQuoteSaving(true)

        // generate formatted date for 'quoteName'
        const formattedDate = moment().format('YYMMDD')

        const payload = {
          ...formValues,
          id: basket?.id,
          quoteName: basket?.shippingAddress?.firstName ? [basket?.shippingAddress?.firstName, '_', formattedDate].join('') : EmptyString,
          email: basket?.userEmail,
          companyId: user?.companyId,
          shippingAddress: {
            ...(basket?.shippingAddress || {}),
            customerId: basket?.userId,
          },
          billingAddress: {
            ...(basket?.billingAddress || {}),
            customerId: basket?.userId,
          },
        }
        const { data } = await axios.post(NEXT_B2B_SAVE_QUOTE, {
          quote: payload,
        })
        setQuoteDetails(data)
        handleToggleOpenQuoteSuccess()
        setIsQuoteSaving(false)
        hideOverlayLoaderState()
        
        // redirect to home page
        router.push('/')
        
        // reset basket items
        setCartItems({ lineItems: [] })
      } catch (error) {
        logError(error)
        setAlert({
          type: AlertType.ERROR,
          msg: translate('common.message.requestCouldNotProcessErrorMsg'),
        })
        hideOverlayLoaderState()
        setIsQuoteSaving(false)
      }
    },
    [user, basket, formValues]
  )

  const handleToggleOpenQuoteSuccess = () => {
    setIsQuoteSuccessOpen(!isQuoteSuccessOpen)
  }

  /**
   * Component will not render,
   *  - If b2b user is NOT logged in
   *  - If quote is already created
   */
  if (!isB2BUser(user) && basket?.quoteStatus !== QuoteStatus.NOT_QUOTE) {
    return <></>
  }

  return (
    <Fragment>
      <form onSubmit={onSaveQuote}>
        <Button type="submit" className="!rounded-full !bg-slate-900 !capitalize w-full hover:!bg-slate-800 dark:!bg-slate-100 focus:!ring-black focus:!outline-none focus:!ring-2 focus:!ring-offset-2" loading={isQuoteSaving} disabled={isQuoteSaving}>
          {translate('label.quotes.saveQuote')}
        </Button>
        <Input type="text" name="purchaseOrderNo" value={formValues.purchaseOrderNo} onChange={(value) => onChange('purchaseOrderNo', value)} placeholder={translate('label.quotes.quoteRefNumPlaceholder')} className="rounded-full mt-2" />
      </form>
      {quoteDetails && <SaveQuoteSuccessModal quoteDetails={quoteDetails} isQuoteSuccessOpen={isQuoteSuccessOpen} handleToggleOpenQuoteSuccess={handleToggleOpenQuoteSuccess} />}
    </Fragment>
  )
}
