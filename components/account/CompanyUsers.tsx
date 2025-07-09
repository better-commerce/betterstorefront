import React, { useCallback, useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import Spinner from '@components/ui/Spinner'
import { useTranslation } from '@commerce/utils/use-translation'
import AddNewUserModal from '@components/account/AddCompanyUser'
import { NEXT_B2B_GET_COMPANY_DETAILS } from '@components/utils/constants'
import { useUI } from '@components/ui'
import { CheckIcon, EnvelopeIcon, PhoneIcon, ShoppingCartIcon } from '@heroicons/react/24/outline'

const USERS_PER_PAGE = 10

function CompanyUsers({ users }: any) {
  const translate = useTranslation()
  const [isAddNewUserModalOpen, setIsAddNewUserModalOpen] = useState(false)
  const [companyDetails, setCompanyDetails] = useState<any>(null)
  const { user } = useUI()
  const [currentPage, setCurrentPage] = useState(1)

  const getCompanyDetails = useCallback(async () => {
    const response: any = await axios.post(NEXT_B2B_GET_COMPANY_DETAILS, { userId: user?.userId })
    setCompanyDetails(response?.data || {})
  }, [user?.userId])

  useEffect(() => {
    getCompanyDetails()
  }, [])

  const toggelAddNewUserModal = () => {
    setIsAddNewUserModalOpen(!isAddNewUserModalOpen)
  }

  const currentUserId = user?.userId

  // Reorder current user first
  const reorderedUsers = useMemo(() => {
    if (!users || !currentUserId) return users
    const currentUser = users.find((u: any) => u?.userId === currentUserId)
    const others = users.filter((u: any) => u?.userId !== currentUserId)
    return currentUser ? [currentUser, ...others] : users
  }, [users, currentUserId])

  // Pagination slice
  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * USERS_PER_PAGE
    return reorderedUsers?.slice(start, start + USERS_PER_PAGE) || []
  }, [reorderedUsers, currentPage])

  const totalPages = Math.ceil(reorderedUsers?.length / USERS_PER_PAGE)

  // Page number array
  const pageNumbers = useMemo(() => {
    return Array.from({ length: totalPages }, (_, i) => i + 1)
  }, [totalPages])
  const PERMISSIONS_MAP: Record<string, { label: string; bg: string; text: string }> = {
    approveOrder: { label: 'Can Approve Order', bg: 'bg-blue-100', text: 'text-blue-700' },
    placeOrder: { label: 'Can Order', bg: 'bg-emerald-100', text: 'text-emerald-700' },
    viewCredit: { label: 'View Credit Limit', bg: 'bg-yellow-100', text: 'text-yellow-700' },
    viewInvoice: { label: 'View Invoice', bg: 'bg-purple-100', text: 'text-purple-700' },
  }
  return (
    <section className="w-full">
      {!users ? (
        <Spinner />
      ) : (
        <>
          <div className="flex items-center justify-between mt-3">
            <h3 className='text-xl font-semibold text-black'>Users</h3>
            <button
              onClick={toggelAddNewUserModal}
              className="inline-flex items-center px-6 py-2 text-sm font-medium text-white rounded shadow-lg nc-Button bg-slate-900 hover:bg-slate-800"
            >
              {translate('label.myAccount.addNewUserText')}
            </button>
          </div>
          <div className="mt-3 overflow-x-auto border rounded-lg border-slate-200">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-3 pl-3 pr-3 text-[12px] font-semibold text-left text-gray-900 sm:pl-4">User</th>
                  <th className="px-2 py-3 text-[12px] font-semibold text-left text-gray-900">Manager</th>
                  <th className="px-3 py-3 text-[12px] font-semibold text-left text-gray-900">Team</th>
                  <th className="px-3 py-3 text-[12px] font-semibold text-left text-gray-900">Location</th>
                  <th className="px-3 py-3 text-[12px] font-semibold text-left text-gray-900 w-28">Spend Limit</th>
                  <th className="px-1 py-3 text-[12px] font-semibold text-left text-gray-900 sm:w-[420px]">Permissions</th>
                </tr>
              </thead>
              <tbody className='bg-white divide-y divide-gray-200'>
                {paginatedUsers.map((user: any, idx: number) => {
                  const isCurrentUser = user?.userId === currentUserId
                  return (
                    <tr key={idx} className={`border-t border-b shadow-none group border-slate-200 hover:shadow ${isCurrentUser ? 'bg-yellow-50 font-semibold hover:bg-blue-100' : 'bg-white hover:bg-gray-100'}`} >
                      <td className={`px-2 py-3 text-sm whitespace-nowrap  ${isCurrentUser ? 'text-sky-500' : 'text-black'}`}>
                        <div className='flex flex-col '>
                          <span className='font-semibold'>{`${user?.firstName} ${user?.lastName}`}</span>
                          <span className='text-xs text-gray-600'>{user?.email}</span>
                          <span className='text-xs text-gray-600'>{user?.phoneNo}</span>
                        </div>
                      </td>
                      <td className="px-3 py-3 text-xs">{user?.reportingManager?.email || '-'}</td>
                      <td className="px-3 py-3 text-xs">{user?.team || '-'}</td>
                      <td className="px-3 py-3 text-xs capitalize">{user?.location || '-'}</td>
                      <td className="px-3 py-3 text-xs font-semibold text-emerald-500">{user?.spendLimit?.raw?.withTax > 0 ? user?.spendLimit?.formatted?.withTax : 'Unlimited'}</td>
                      <td className="px-1 py-3 text-xs">
                        <div className='flex flex-col gap-1'>
                          <div className='flex flex-wrap justify-start gap-1'>
                            {user?.canApproveOrder && <span className={`${user?.canApproveOrder ? 'bg-sky-100 text-sky-600 border border-sky-400' : 'bg-red-100 text-red-600 border border-red-400'} inline-flex items-center gap-1  py-0.5 rounded text-[9px] font-medium shadow-sm transition sm:w-[92px]`}>
                             <CheckIcon className='inline w-3 h-3' />
                              Approve Order
                            </span>}
                            {user?.canPlaceOrder && <span className={`${user?.canPlaceOrder ? 'bg-sky-100 text-sky-600 border border-sky-400' : 'bg-red-100 text-red-600 border border-red-400'} inline-flex items-center gap-1  py-0.5 rounded text-[9px] font-medium shadow-sm transition sm:w-[92px]`}>
                              <ShoppingCartIcon className='inline w-3 h-3' />
                              Place Order
                            </span>}
                            {user?.canSeeCreditLimit && <span className={`${user?.canSeeCreditLimit ? 'bg-sky-100 text-sky-600 border border-sky-400' : 'bg-red-100 text-red-600 border border-red-400'} inline-flex items-center gap-1 py-0.5 rounded text-[9px] font-medium shadow-sm transition sm:w-[92px]`}>
                              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M4 4h12v2H4V4zm0 4h12v8H4V8z" />
                              </svg>
                              View Credit
                            </span>}
                            {user?.canSeeInvoices && <span className={`${user?.canSeeInvoices ? 'bg-sky-100 text-sky-600 border border-sky-400' : 'bg-red-100 text-red-600 border border-red-400'} inline-flex items-center gap-1  py-0.5 rounded text-[9px] font-medium shadow-sm transition sm:w-[92px]`}>
                              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M5 4a2 2 0 00-2 2v10a1 1 0 001.447.894L8 15.118l3.553 1.776A1 1 0 0013 16V6a2 2 0 00-2-2H5zm0 2h6v7.382L8.447 12.106a1 1 0 00-.894 0L5 13.382V6z" />
                              </svg>
                              View Invoices
                            </span>}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex flex-wrap items-center justify-between gap-4 mt-4 text-sm text-slate-600">
              {/* Page info */}
              <div>
                Showing {Math.min((currentPage - 1) * USERS_PER_PAGE + 1, reorderedUsers.length)}–
                {Math.min(currentPage * USERS_PER_PAGE, reorderedUsers.length)} of {reorderedUsers.length}
              </div>

              {/* Pagination buttons */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 rounded bg-slate-100 hover:bg-slate-200 disabled:opacity-50"
                >
                  Previous
                </button>

                {/* Page Numbers */}
                {pageNumbers.map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1 rounded ${page === currentPage ? 'bg-slate-800 text-white' : 'bg-slate-100 hover:bg-slate-200'
                      }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 rounded bg-slate-100 hover:bg-slate-200 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Modal */}
      {isAddNewUserModalOpen && (
        <AddNewUserModal
          isOpen={isAddNewUserModalOpen}
          closeModal={toggelAddNewUserModal}
          companyDetails={companyDetails}
          btnTitle={translate('label.myAccount.addNewUserText')}
        />
      )}
    </section>
  )
}

export default CompanyUsers
