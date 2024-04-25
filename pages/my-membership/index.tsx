import withDataLayer, { PAGE_TYPES } from "@components/withDataLayer";
import NextHead from 'next/head'
import { useRouter } from "next/router";
import Layout from '@components/Layout/Layout'
import { EmptyGuid, NEXT_GET_ALL_MEMBERSHIP_PLANS, SITE_ORIGIN_URL } from "@components/utils/constants";
import axios from "axios";
import { useEffect, useState } from "react";
import { removeQueryString } from "@commerce/utils/uri-util";
import { GiftIcon, PlusIcon, StarIcon, TagIcon, TruckIcon } from "@heroicons/react/24/outline";
const PAGE_TYPE = PAGE_TYPES.MyMembership
const memberBenefit = [
  { "name": "20% off whenever you want*", "description": "Start saving today and choose how many 20% off vouchers you fancy based on the tier you choose.", "icon": <GiftIcon className="w-16 h-16 mx-auto mb-4 text-sky-600" /> },
  { "name": "FREE unlimited* express delivery", "description": "Delivery charges? Not for our My Store members! Free delivery all year long.", "icon": <TruckIcon className="w-16 h-16 mx-auto mb-4 text-sky-600" /> },
  { "name": "Exclusive offers & perks", "description": "Get exclusive perks tailored to you plus early access to amazing offers.", "icon": <StarIcon className="w-16 h-16 p-2 mx-auto mb-4 border-2 rounded-full text-sky-600 border-sky-600" /> },
  { "name": "Upgrade whenever you like", "description": "Pay the difference to upgrade your plan at any time to keep on saving.", "icon": <PlusIcon className="w-16 h-16 p-2 mx-auto mb-4 border-2 rounded-full text-sky-600 border-sky-600" /> }
]

const MyMembership = () => {
  const router = useRouter()
  const [allPlans, setAllPlans] = useState([])

  useEffect(() => {
    getAllPlans()
  }, [])

  const getAllPlans = async () => {
    try {
      const payload = {
        "SearchText": null,
        "PricingType": 0,
        "Name": null,
        "TermType": 0,
        "IsActive": 1,
        "ProductId": EmptyGuid,
        "CategoryId": EmptyGuid,
        "ManufacturerId": EmptyGuid,
        "SubManufacturerId": EmptyGuid,
        "PlanType": 0,
        "CurrentPage": 0,
        "PageSize": 0
      }
      const { data }: any = await axios.post(NEXT_GET_ALL_MEMBERSHIP_PLANS, payload)
      setAllPlans(data)
    } catch (error) {
      console.error('err in fetching membership plans', error)
    }
  }
  const cleanPath = removeQueryString(router.asPath)
  return (
    <>
      <NextHead>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <link rel="canonical" id="canonical" href={SITE_ORIGIN_URL + cleanPath} />
        <title>My Membership</title>
        <meta name="title" content="My Membership" />
        <meta name="description" content="My Membership" />
        <meta name="keywords" content="My Membership" />
        <meta property="og:image" content="My Membership" />
        <meta property="og:title" content="My Membership" key="ogtitle" />
        <meta property="og:description" content="My Membership" key="ogdesc" />
      </NextHead>
      <div className="py-6 sm:py-16 bg-gradient-to-t from-purple-100 to-white">
        <div className="container flex flex-col justify-center py-6 mx-auto text-center sm:py-10">
          <h3 className="mx-auto my-1 text-5xl font-semibold text-black leading-extra-loose sm:max-w-xl">GET 20% OFF + FREE DELIVERY</h3>
          <p>on your order today when you join our membership</p>
        </div>
      </div>      
      <div className="pb-10 sm:pb-24 bg-gradient-to-b from-purple-100 to-white">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {allPlans?.map((plan: any, planIdx: number) => (
              <div className="flex flex-col w-full bg-transparent border-2 border-black rounded-2xl" key={`plan-${planIdx}`}>
                <div className="items-center justify-center py-4 text-center bg-black rounded-t-xl">
                  <h2 className="text-lg font-medium text-white">{plan?.name}</h2>
                </div>
                <div className="bg-gradient-to-t from-purple-100 to-white rounded-b-xl">
                  <div className="flex flex-col gap-4 p-6">
                    {plan?.membershipBenefits?.map((benefits: any, bIdx: number) => (
                      <>
                        <div className="flex items-center gap-4 justify-normal">
                          <GiftIcon className="w-6 h-6 p-1 text-white bg-black rounded-full" />
                          <span className="font-medium text-black text-md">{benefits?.code}</span>
                        </div>
                        <div className="flex items-center gap-4 justify-normal">
                          <TagIcon className="w-6 h-6 p-1 text-white bg-black rounded-full" />
                          <span className="font-medium text-black text-md">{benefits?.noOfVoucher} x 20% discounts anytime</span>
                        </div>
                      </>
                    ))}

                  </div>
                  <div className="flex items-center justify-center gap-1 pt-6 mt-6 border-t border-purple-100">
                    <h3 className="text-xl font-semibold text-slate-900">{plan?.price?.formatted?.withTax}</h3>
                    <span className="text-xs font-normal text-slate-500">per year</span>
                  </div>
                  <div className="flex items-center justify-center mt-2">
                    <h4 className="text-sm font-normal text-black">Billed annually</h4>
                  </div>
                  <div className="flex items-center justify-center px-6 pt-3 pb-6 mt-6">
                    <button className="w-full py-3 text-sm text-white bg-black rounded-full hover:bg-purple-900">Add to Bag</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="container mx-auto">
        <div className="flex flex-col justify-center pb-6 mx-auto text-center sm:max-w-4xl sm:pb-10">
          <h3 className="my-1 mb-6 text-3xl font-medium text-slate-800">Already a Member?</h3>
          <p className="my-2 text-sm font-normal text-slate-700"> you've used up all your vouchers and fancy more or like the sound of 20% off* subscription, you can upgrade your membership plan easily.</p>
          <p className="my-1 text-sm font-normal text-slate-700">Upgrade any time by simply paying the difference between the tiers.</p>
          <p className="my-1 text-sm font-normal text-slate-700">Spray some more happiness for less!</p>
        </div>
        <div className="flex flex-col justify-center py-6 text-center border-t border-slate-200 sm:py-10">
          <h3 className="my-1 text-3xl font-medium text-slate-800">All Benefits Membership gives you</h3>
          <div className="grid grid-cols-1 gap-10 mt-8 sm:grid-cols-4">
            {memberBenefit?.map((benefit: any, bIdx: number) => (
              <div key={`b-${bIdx}`} className="flex flex-col justify-center w-full">
                {benefit?.icon}
                <h2 className="mb-4 text-lg font-semibold text-slate-800">{benefit?.name}</h2>
                <h5 className="text-sm font-normal text-slate-600">{benefit?.description}</h5>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

MyMembership.LayoutAccount = Layout
export default withDataLayer(MyMembership, PAGE_TYPE, true, Layout)