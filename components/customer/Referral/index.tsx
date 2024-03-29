// Base Imports
import React, { useEffect, useState } from "react"

// Package Imports
import axios from "axios"
import { useRouter } from "next/router"

// Component Imports
import ReferralCard from '@components/customer/Referral/ReferralCard'

// Other Imports
import { NEXT_REFERRAL_ADD_USER_REFEREE, NEXT_REFERRAL_BY_SLUG, NEXT_REFERRAL_CLICK_ON_INVITE, NEXT_REFERRAL_INFO } from "@components/utils/constants"
import { EMAIL_FIELD_VALIDATION } from "@components/utils/textVariables"
import { useUI } from "@components/ui"

const CustomerReferral = ({ router }: any) => {
    const [referralInfoObj, setReferralInfoObj] = useState<any>(null)
    const [isReferralAvailable, setIsReferralAvailable] = useState(false)
    const [referralEmail, setReferralEmail] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [voucher, setVoucher] = useState<any>(null)
    const [errors,setErrors] = useState('')
    const {setReferralProgramActive} = useUI()

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
    const checkReferralProgram = async ()=>{
              let { data: referralProgram } = await axios.post(NEXT_REFERRAL_INFO)
              if (referralProgram?.referralDetails?.refereePromo) {
                setReferralProgramActive(true)
              } else {
                setReferralProgramActive(false)
              }
    }
    const onNewReferral = async (e: any) => {
        e.preventDefault()
        if(referralEmail.length<1){
            setErrors(EMAIL_FIELD_VALIDATION)
        } else{
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
    }

    const onInputChange = (e: any) => {
        setReferralEmail(e.target.value)
    }

    useEffect(() => {
        const fetchReferralSlug = () => {
            if (router.isReady) {
                const referralSlug = router?.query?.['referral-code']
                if (referralSlug) {
                    onReferralSlug(referralSlug)
                }
            }
        }

        checkReferralProgram()
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