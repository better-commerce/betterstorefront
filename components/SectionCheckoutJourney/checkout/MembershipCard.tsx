import React, { useEffect } from 'react';
import { useTranslation } from "@commerce/utils/use-translation";
import { Guid } from '@commerce/types'
import { MEMBERSHIP_PLANS } from '@components/utils/constants'
import axios from 'axios'

const MembershipCard = ({ basket, setOpenOMM}:any) => {
    const translate = useTranslation();
    console.log("basket",basket)
    const moneySaved = basket?.grandTotal?.currencySymbol + (0.2*basket?.grandTotal?.raw?.withTax).toFixed(2)
    const discountLeft = 0
    const lowestMemberShipPrice = 0

    useEffect(() => {
      const fetchData = async () => {
        const response = await axios.get(MEMBERSHIP_PLANS)
        console.log("response",response)
      }
      fetchData()
    },[])

    const handleOptMembershipModal = () => {
        setOpenOMM(true)
    }

  if (basket?.hasMembership) {
    return (
      <div className="bg-indigo-800 p-6 rounded-lg mt-2 text-center">
        <div className="flex items-center justify-center text-white text-2xl font-bold mb-4">
            <img src="/theme/blue/image/logo.png?fm=webp&amp;h=200" width="60" height="60" alt="Store" className="brand-logo" />
        </div>
        <p className="text-yellow-300 font-semibold mb-6">
          {!!moneySaved && `Apply your 20% OFF discount to save ${moneySaved}`}
        </p>
        <button className="bg-white text-indigo-900 font-semibold py-2 px-4 rounded-md mb-4">
          APPLY DISCOUNT
        </button>
        <p className="text-white">{discountLeft>=0 && `You have ${discountLeft} discounts remaining`}</p>
      </div>
    );
  } else {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md mt-2 text-center">
        <div className="flex items-center justify-center">
          <img src="/theme/blue/image/logo.png?fm=webp&amp;h=200" width="60" height="60" alt="Store" className="brand-logo" />
        </div>
        <div className="mt-4">
          <p className="font-bold text-lg">
            <span className="text-red-700">{!!moneySaved && `SAVE ${moneySaved}`}</span>
            <span className="text-indigo-900"> OFF THIS ORDER</span>
          </p>
          <p className="text-gray-600 mt-2">
            Get 20% OFF, unlimited FREE delivery and unique offers all year round!*
          </p>
          <p className="text-gray-600 mt-2">{ lowestMemberShipPrice>=0 && `Membership starts from ${lowestMemberShipPrice} per annum `}</p>
        </div>
        <div className="flex justify-center mt-6">
          <button onClick={handleOptMembershipModal} className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded">
            Join now
          </button>
        </div>
        {basket?.userId && basket?.userId != Guid.empty && <div className="mt-4 text-center">
          <hr/>
          <p className="text-indigo-900 hover:text-purple-950 font-semibold mt-2">Already a member?<a href="#"> Log in </a></p>
        </div>}
      </div>
    );
  }
};

export default MembershipCard;
