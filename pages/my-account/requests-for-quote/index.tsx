import { useState, useEffect, Fragment, useMemo } from 'react'
import withDataLayer, { PAGE_TYPES } from '@components/withDataLayer'
import { Tab } from '@headlessui/react'
import { useConfig } from '@components/utils/myAccount'
import withAuth from '@components/utils/withAuth'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { EVENTS_MAP } from '@components/services/analytics/constants'
import useAnalytics from '@components/services/analytics/useAnalytics'
import { useUI } from '@components/ui/context'
import NextHead from 'next/head'
import React from 'react'
import axios from 'axios'
import Spinner from '@components/ui/Spinner'
import { isB2BUser } from '@framework/utils/app-util'
import { useTranslation } from '@commerce/utils/use-translation'
import LayoutAccount from '@components/Layout/LayoutAccount'
import { FunnelIcon, TrashIcon, ArrowPathIcon, EyeIcon } from "@heroicons/react/24/outline";


function RequestQuote({ deviceInfo }: any) {
  const { user, changeMyAccountTab, isGuestUser, displayDetailedOrder, referralProgramActive } = useUI()
  const translate = useTranslation()
  useEffect(() => {
    changeMyAccountTab(translate('label.myAccount.myCompanyMenus.requestQuote'))
  }, [])
  const rfqData = [
    {
      rfqNumber: 1,
      status: "Submitted",
      poNumber: "N/A",
      dnslt: "N/A",
      createdAt: "8/22/2024, 5:09 AM",
      owner: "Purchasing Manager"
    },
    {
      rfqNumber: 2,
      status: "Approved",
      poNumber: "PO123456",
      dnslt: "N/A",
      createdAt: "8/23/2024, 10:30 AM",
      owner: "Finance Manager"
    }
  ];
  return (
    <>
      {!isB2BUser(user) ? (
        <Spinner />
      ) : (
             <>
 <div className="p-4">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-lg font-semibold">ALL REQUESTS FOR QUOTE</h2>
        <button className="bg-transoarent border text-sm text-black py-2 px-4 rounded border-gray-800">
          + New Quote
        </button>
      </div>
      <div className="my-4 flex justify-between">
        <button className="flex items-center text-black">
          <FunnelIcon className="h-5 w-5 mr-1" />
          Filter
        </button>
        <p className="text-sm text-gray-600">{rfqData.length} Total Request For Quote</p>
        <div className="flex space-x-2">
          <button>
            <ArrowPathIcon className="h-5 w-5" />
          </button>
          <button>
            <TrashIcon className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="border rounded-lg overflow-hidden shadow-sm">
        <table className="min-w-full text-left">
          <thead>
            <tr className="bg-gray-100 text-xs text-gray-600">
              <th className="py-2 px-4">RFQ #</th>
              <th className="py-2 px-4">Status</th>
              <th className="py-2 px-4">PO Number</th>
              <th className="py-2 px-4">DNSLT</th>
              <th className="py-2 px-4">Created At</th>
              <th className="py-2 px-4">Owner</th>
              <th className="py-2 px-4"></th>
            </tr>
          </thead>
          <tbody>
            {rfqData.map((rfq) => (
              <tr key={rfq.rfqNumber} className="text-xs border-b">
                <td className="py-2 px-4">{rfq?.rfqNumber}</td>
                <td className="py-2 px-4">{rfq?.status}</td>
                <td className="py-2 px-4">{rfq?.poNumber}</td>
                <td className="py-2 px-4">{rfq?.dnslt}</td>
                <td className="py-2 px-4">{rfq?.createdAt}</td>
                <td className="py-2 px-4">{rfq?.owner}</td>
                <td className="py-2 px-4">
                  <button className="flex items-center text-black">
                    <EyeIcon className="h-5 w-5 mr-1" />
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
             </>
      )}
    </>
  )
}

RequestQuote.LayoutAccount = LayoutAccount
export default withDataLayer(withAuth(RequestQuote), PAGE_TYPES.RequestQuote, true, LayoutAccount)
