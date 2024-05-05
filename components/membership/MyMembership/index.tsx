import { useEffect, useState } from 'react'
import BenefitItems from '../BenefitItems'
import axios from 'axios'
import { NEXT_GET_ORDERS, NEXT_MEMBERSHIP_BENEFITS, } from '@components/utils/constants'
import { logError } from '@framework/utils/app-util'
import { useUI } from '@components/ui/context'
import VoucherDetails from './VoucherDetails'
import PurchaseDetails from './PurchaseDetails'
import MembershipDetails from './MembershipDetails'
import ManageMembership from '../ManageMembership'
import { useTranslation } from '@commerce/utils/use-translation'

export default function MyMembership({defaultDisplayMembership, allMembershipPlans}:any) {
  const translate = useTranslation()
  const { user } = useUI()
  const [discount, setDiscount] = useState(0)
  const [voucherCount, setVoucherCount] = useState(0)
  const [voucherLeft, setVoucherLeft] = useState(0)
  const [voucherUsed, setVoucherUsed] = useState(0)
  const [membership, setMembership] = useState({})
  const [latestMembershipOrder, setLatestMembershipOrder] = useState({})
  const [savedAmount, setSavedAmount] = useState(null)
  const [manageComponentShow, setManageComponentShow] = useState(false)
  const [ButtonText , setButtonText] = useState(manageComponentShow ? translate('label.membership.manageMembership.backToMyMembershipText') : translate('label.membership.manageMembership.manageMyMembershipText'))

  useEffect(() => {
    const fetchMemberShip = async () => {
      const userId = user?.userId
      const data = { userId, basketId: null, membershipPlanId: null }
      try {
        const { data: response } = await axios.post(
          NEXT_MEMBERSHIP_BENEFITS,
          data
        )
        if (!!response?.result) {
          const membershipPlans = response?.result
          setDiscount(membershipPlans?.benefits?.[0]?.discountPct || 0)
          setVoucherCount(membershipPlans?.benefits?.length || 0)
          setVoucherLeft(
            membershipPlans?.benefits?.filter((x: any) => x?.status === 0)
              ?.length || 0
          )
          setVoucherUsed(
            membershipPlans?.benefits?.filter((x: any) => x?.status === 1)
              ?.length || 0
          )
          setMembership(membershipPlans)
        }
      } catch (error) {
        logError(error)
      }
    }
    fetchMemberShip()
  }, [user?.userId])

  useEffect(() => {
    const fetchOrders = async () => {
      const response: any = await axios.post(NEXT_GET_ORDERS, {
        id: user?.userId,
        hasMembership: true,
      })
      const saved = response?.data?.reduce((acc: any, item: any) => {
        return acc + item?.discount?.raw?.withTax
      }, 0)
      setSavedAmount(saved)

      if (response?.data?.length > 0) {
        if (response?.data?.length === 0) {
          setLatestMembershipOrder(response?.data[0])
        } else {
          const lastOrder = response?.data?.sort((a: any, b: any) => {
            a = new Date(a?.orderDate)
            b = new Date(b?.orderDate)
            return a > b ? -1 : a < b ? 1 : 0
          })
          setLatestMembershipOrder(lastOrder[0])
        }
      }
    }
    fetchOrders()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect (() => {
    manageComponentShow ?  setButtonText(translate('label.membership.manageMembership.backToMyMembershipText')) : setButtonText(translate('label.membership.manageMembership.manageMyMembershipText'))
  }, [manageComponentShow])

  const onButtonClick = () => {
    setManageComponentShow(!manageComponentShow)
  }

  return (
    <div>
      <MembershipDetails membership={membership} ButtonText={ButtonText} onButtonClick={onButtonClick} />
      {manageComponentShow ? ( <ManageMembership defaultDisplayMembership={defaultDisplayMembership} allMembershipPlans={allMembershipPlans}/> ) : (
        <>
          <BenefitItems discountPerc={discount} />
          <div className="flex flex-col md:flex-row gap-6 p-6">
            <div className="w-full md:w-1/2 flex-1 flex">
              <PurchaseDetails lastPurchase={latestMembershipOrder} />
            </div>
            <div className="w-full md:w-1/2 flex-1 flex">
              <VoucherDetails voucherUsed={voucherUsed} currencySymbol={""} savedAmount={savedAmount} voucherLeft={voucherLeft} voucherCount={voucherCount} defaultDisplayMembership={defaultDisplayMembership} />
            </div>
          </div>
        </>
      )}
    </div>
  )
}
