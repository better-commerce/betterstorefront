import React, { useEffect, useMemo, useState } from 'react'
import moment from 'moment'
import { useTranslation } from '@commerce/utils/use-translation'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import {
  DATE_FORMAT,
  NEXT_MEMBERSHIP_BENEFITS,
  MembershipType,
} from '@components/utils/constants'
import axios from 'axios'
import { logError } from '@framework/utils/app-util'
import Link from 'next/link'

const MembershipBanner = ({ user }: any) => {
  const [membership, setMembership] = useState<any>([])
  const [discount, setDiscount] = useState(0)
  const [voucherCount, setVoucherCount] = useState(0)
  const [voucherLeft, setVoucherLeft] = useState(0)
  const [voucherUsed, setVoucherUsed] = useState(0)
  const translate = useTranslation()
  const formatDate = (dateString: string) => {
    return moment(dateString).format(DATE_FORMAT)
  }

  useEffect(() => {
    const fetchMemberShip = async () => {
      const userId: any = user?.userId
      const data: any = { userId, basketId: null, membershipPlanId: null }
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

  const getBackgroundColor = (membershipName: MembershipType): string => {
    switch (membershipName) {
      case MembershipType.SILVER:
        return 'gradient-silver';
      case MembershipType.GOLD:
        return 'gradient-golden';
      case MembershipType.PLATINUM:
        return 'gradient-platinum';
      default:
        return 'gray-500';
    }
  }
  const getVoucherColor = (membershipName: MembershipType): string => {
    switch (membershipName) {
      case MembershipType.SILVER:
        return 'back-silver'
        case MembershipType.GOLD:
        return 'back-golden'
        case MembershipType.PLATINUM:
        return 'back-platinum'
      default:
        return 'gray-500'
    }
  }
  const balanceVoucher = membership?.benefits?.filter(
    (benefit: any) => benefit?.status === 0
  ).length

  const membershipColor = useMemo(() => {
    if (membership?.membershipName === MembershipType.SILVER || membership?.membershipName === MembershipType.PLATINUM) {
      return 'text-black';
    } else {
      return 'text-white';
    }
  }, [membership]);

  if (!membership?.membershipName) {
    return <>
      <div className='container w-full mx-auto mt-14 sm:mt-20 sm:mb-0 theme-account-container'>
        <h2 className="text-3xl font-semibold xl:text-4xl dark:text-black">{translate('common.label.accountText')}</h2>
        <span className="block mt-2 text-base text-neutral-500 dark:text-neutral-400 sm:text-lg">
          <span className="font-semibold text-slate-900 dark:text-slate-900"> {user?.firstName}, </span>{" "} {user?.email}
        </span>
        <hr className="hidden sm:mt-6 border-slate-200 dark:border-slate-200 sm:block"></hr>
      </div>
    </>
  }

  return (
    <>
      <div className={`${getBackgroundColor(membership?.membershipName)} p-5 header-space`}>
        <div className="container flex">
          <div className="w-2/4">
            <h2
              className={`text-xl sm:text-3xl ${membershipColor}`}
            >
              {translate('common.label.helloText')} {user?.firstName}
            </h2>
            {membership && (
              <div className="flex">
                <Link href="/my-membership">
                  <span className={`${membershipColor} text-lg mt-2`} >
                  {translate('label.membership.seeText')} {membership?.membershipName} {translate('label.membership.benefitsText')}{' '}
                    <ChevronDownIcon className="inline w-4 h-4 transform -rotate-90" aria-hidden="true" />
                  </span>
                </Link>
              </div>
            )}
          </div>
          <div className="flex w-2/4 mt-5 gap-x-5">
            <div>
              <p className={`font-bold ${membershipColor} text-xs`} >
              {translate('label.membership.membershipNoText')}
              </p>
              <p className={`${membershipColor}`} >
                {membership?.membershipNo}
              </p>
            </div>
            <div>
              <p className={`font-bold ${membershipColor} text-xs`} >
              {translate('label.membership.balanceVoucherText')}
              </p>
              <p
                className={`${membershipColor} ml-1`}
              >
                {balanceVoucher}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className={`${getVoucherColor(membership?.membershipName)} py-2 px-5`}>
        <div className="container flex">
          <div className="w-2/4">
            <p
              className={`${membershipColor}`}
            >
              {membership?.membershipName} {translate('label.membership.memberText')}
            </p>
          </div>
          <div className="w-2/4">
            <p
              className={`${membershipColor}`}
            >
              {translate('label.membership.sinceText')} {formatDate(membership?.startDate)}
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

export default MembershipBanner
