// Base Imports
import React, { useEffect, useState } from "react"

// Package Imports
import axios from "axios"
import { useRouter } from "next/router"

// Component Imports
import ReferralCard from '@components/customer/Referral/ReferralCard'

// Other Imports
import { NEXT_REFERRAL_ADD_USER_REFEREE, NEXT_REFERRAL_BY_SLUG, NEXT_REFERRAL_CLICK_ON_INVITE } from "@components/utils/constants"

const CustomerReferral = ({ router }: any) => {
    const [referralInfoObj, setReferralInfoObj] = useState<any>(null)
    const [isReferralAvailable, setIsReferralAvailable] = useState(false)
    const [referralEmail, setReferralEmail] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [voucher, setVoucher] = useState<any>(null)
    const [errors,setErrors] = useState('')

    const onReferralClickOnInvite = async (referralId: any) => {
        let { data: response } = await axios.post(NEXT_REFERRAL_CLICK_ON_INVITE, { referralId: referralId })
    }

    const onReferralSlug = async (referralSlug: any) => {
        let { data: referralValid } = await axios.post(NEXT_REFERRAL_BY_SLUG, { slug: referralSlug })
        if (referralValid?.referralDetails) { //?.referralDetails
            onReferralClickOnInvite(referralValid?.referralDetails?.id)
            setIsReferralAvailable(true)
            setReferralInfoObj(referralValid?.referralDetails)
        }
    }

    const onNewReferral = async (e: any) => {
        e.preventDefault()
        setIsLoading(true)
        let { data } = await axios.post(NEXT_REFERRAL_ADD_USER_REFEREE, { referralId: referralInfoObj?.id, email: referralEmail })
        if (data?.referralDetails) {
            setIsLoading(false)
            setVoucher(data?.referralDetails)
            // setReferralAvailable(false)
        } else{
            setIsLoading(false)
            setErrors('Offer already used by this email address')
        }

    }

    const onInputChange = (e: any) => {
        setReferralEmail(e.target.value)
    }

    useEffect(() => {
        const fetchReferralSlug = () => {
            if (router.isReady) {
                const referralSlug = router?.query?.['referral-code']
                // console.log('in useEffect referralSlug', referralSlug)
                if (referralSlug) {
                    onReferralSlug(referralSlug)
                }
            }
        }

        fetchReferralSlug()
    }, [router.query])

    return (
        <>
            {isReferralAvailable && (
                <ReferralCard
                    title={'Get your Discount Coupon'}
                    description={'You have a referral code! Avail a discount voucher by entering your email'}
                    hide={isReferralAvailable}
                    className="!flex !flex-col gap-y-2 "
                    onInputChange={onInputChange}
                    onNewReferral={onNewReferral}
                    isLoading={isLoading}
                    voucher={voucher}
                    errors={errors}
                />
            )}
        </>
    )
}

export default CustomerReferral