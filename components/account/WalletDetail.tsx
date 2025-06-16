"use client"
import AddBankDetailsModal from '@components/AddBankDetailsModal';
import Loader from '@components/Loader';
import TransferToBankModal from '@components/TransferToBankModal';
import { LoadingDots } from '@components/ui';
import { useUI } from '@components/ui/context'
import { DATE_FORMAT, NEXT_WALLET_ASSOCIATE_TO_CUSTOMER, NEXT_WALLET_ENABLE_CUSTOMER_WALLET, NEXT_WALLET_GET_BANK_TRANSFERS, NEXT_WALLET_GET_CUSTOMER_BANKS, NEXT_WALLET_GET_CUSTOMER_WALLET, NEXT_WALLET_GET_CUSTOMER_WALLET_TRANSACTIONS } from "@components/utils/constants";
import { callApi } from '@framework/utils/api-util';
import { logError } from "@framework/utils/app-util";
import { WalletIcon } from "@heroicons/react/24/outline";
import { AxiosRequestConfig } from "axios";
import { RequestMethod } from 'bc-payments-sdk/dist/constants';
import moment from 'moment';
import dynamic from 'next/dynamic';
import { useEffect, useState } from "react";
import { useTranslation } from "@commerce/utils/use-translation";
const Pagination = dynamic(() => import('@components/Product/Pagination'))
export default function WalletDetail() {
  const [walletEnabled, setWalletEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingTransactions, setIsLoadingTransactions] = useState(false)
  const [isLoadingBankTransactions, setIsLoadingBankTransactions] = useState(false)
  const [isLoadingWallet, setIsLoadingWallet] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [walletDetail, setWalletDetail] = useState<any>({})
  const [walletTransactions, setWalletTransaction] = useState<any>({})
  const [bankTransferTransactions, setBankTransferTransactions] = useState<any>({})
  const [bankAccountList, setBankAccountList] = useState<any>([{}])
  const [paginationState, setPaginationState] = useState<any>({ pageNumber: 1, pageSize: 1, sortBy: 'created_on', sortDescending: true, pageCount: 1 })
  const [bankTransfersPaginationState, setBankTransfersPaginationState] = useState<any>({ pageNumber: 1, pageSize: 1, sortBy: 'created_on', sortDescending: true, pageCount: 1 })
  const [openTransferToBankModal, setOpenTransferToBankModal] = useState(false)
  const [openAddBankDetailsModal, setOpenAddBankDetailsModal] = useState(false)
  const translate = useTranslation()
  const { user, setUser } = useUI()
  const handleEnableWallet = async () => {
    setIsLoading(true);
    try {
      const config: AxiosRequestConfig = { url: NEXT_WALLET_ENABLE_CUSTOMER_WALLET, method: RequestMethod.POST, data: { customerId: user.userId } }
      const { data: walletResult }: any = await callApi(config);
      if (walletResult?.data) {
        const config: AxiosRequestConfig = { url: NEXT_WALLET_ASSOCIATE_TO_CUSTOMER, method: RequestMethod.POST, data: { id: user.userId, walletId: walletResult?.data }, }
        await callApi(config);
        setWalletEnabled(true);
        setSuccessMessage("Your Wallet enabled successfully!!!");
        setUser({ ...user, walletId: walletResult?.data })
        if (walletResult?.data) {
          const walletId = walletResult?.data;
          getWallet(walletId);
        }
        setTimeout(() => {
          setSuccessMessage("");
        }, 5000);
      }
    } catch (error) {
      logError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const getWallet = async (walletId: any) => {
    setIsLoadingWallet(true);
    try {
      const config: AxiosRequestConfig = { url: NEXT_WALLET_GET_CUSTOMER_WALLET, method: RequestMethod.POST, data: { walletId }, }
      const { data: walletData }: any = await callApi(config);
      setWalletDetail(walletData?.data);
    } catch (error) {
      logError(error);
    } finally {
      setIsLoadingWallet(false);
    }
  };
  const getWalletTransactions = async ({ walletId, page = 1, sortBy = "created_on", sortDescending = true, filters = {} }: any) => {
    setIsLoadingTransactions(true);
    try {
      const { pageCount, ...rest } = paginationState;
      const config: AxiosRequestConfig = { url: NEXT_WALLET_GET_CUSTOMER_WALLET_TRANSACTIONS, method: RequestMethod.POST, data: { walletId, page, pageSize: 10, sortBy, sortDescending, filters }, }
      const { data: transactionsResult }: any = await callApi(config)
      setWalletTransaction(transactionsResult?.data);
      const bankConfig: AxiosRequestConfig = { url: NEXT_WALLET_GET_CUSTOMER_BANKS, method: RequestMethod.POST, data: { walletId, page: 1, pageSize: 1000, sortBy, sortDescending, filters }, }
      const { data: bankResult }: any = await callApi(bankConfig)
      setBankAccountList(bankResult?.data?.items)
      setPaginationState((prev: any) => ({
        ...prev,
        pageNumber: transactionsResult?.data?.page || page, // ✅ Set current page from API response
        pageCount: transactionsResult?.data?.totalPages || prev.pageCount,
        pageSize: transactionsResult?.data?.pageSize || prev.pageSize,
      }));
    } catch (error) {
      logError(error);
    } finally {
      setIsLoadingTransactions(false);
    }
  };

  const getBankTransfers = async ({ walletId, page = 1, sortBy = "created_on", sortDescending = true, filters = {} }: any) => {
    setIsLoadingBankTransactions(true);
    try {
      const { pageCount, ...rest } = bankTransfersPaginationState;
      const config: AxiosRequestConfig = { url: NEXT_WALLET_GET_BANK_TRANSFERS, method: RequestMethod.POST, data: { walletId, page, pageSize: 10, sortBy, sortDescending, filters }, }
      const { data: transactionsResult }: any = await callApi(config)
      setBankTransferTransactions(transactionsResult?.data);
      setBankTransfersPaginationState((prev: any) => ({
        ...prev,
        pageNumber: transactionsResult?.data?.page || page, // ✅ Set current page from API response
        pageCount: transactionsResult?.data?.totalPages || prev.pageCount,
        pageSize: transactionsResult?.data?.pageSize || prev.pageSize,
      }));
    } catch (error) {
      logError(error);
    } finally {
      setIsLoadingBankTransactions(false);
    }
  };

  useEffect(() => {
    if (user?.userId && user.walletId) {
      setWalletEnabled(true)
      getWallet(user.walletId);
      getWalletTransactions({ walletId: user?.walletId });
      getBankTransfers({ walletId: user?.walletId });
    }
  }, [user?.userId]); // Runs when user.userId is available

  return (
    isLoading ? (
      <div className='flex flex-col w-full'>
        <div className='flex flex-col items-center justify-center gap-5 py-10'>
          <LoadingDots />
          <span className='text-2xl font-semibold text-gray-600'>{translate('label.myAccount.walletActivationMessage')}</span>
        </div>
      </div>
    ) : (
      isLoadingWallet ? <Loader /> :
        <>
          {successMessage &&
            <div className='fixed z-10 top-32 right-4'>
              <span className='px-4 py-2 text-sm font-semibold text-white rounded-full bg-emerald-500'>{successMessage}</span>
            </div>
          }
          <div className="w-full">
            <div className="flex items-center justify-between w-full btn-primary-clr btn-section-wallet">
              <h2 className={`text-xl font-normal sm:text-2xl dark:text-black ${walletEnabled ? 'mb-6' : ''}`}>{translate('label.myAccount.myWalletText')}</h2>
              {walletEnabled &&
                <div className="flex w-5/12 gap-2 mb-6">
                  <button
                    className={`w-full flex items-center justify-center !text-sm px-4 py-3 -mr-0.5 !rounded-sm sm:px-2 link-button btn-primary  ${bankAccountList?.length > 0 ? '' : '!cursor-not-allowed opacity-50'}`}
                    onClick={() => setOpenTransferToBankModal(true)}
                    disabled={!(bankAccountList?.length > 0)}
                  >
                    {translate('label.myAccount.transferToBankText')}
                  </button>
                  <button
                    className={`w-full flex items-center justify-center !text-sm px-4 py-3 -mr-0.5 !rounded-sm sm:px-2 link-button btn-c btn-primary`}
                    onClick={() => setOpenAddBankDetailsModal(true)}
                  >
                    {translate('label.myAccount.addBankDetailsText')}
                  </button>
                </div>}
            </div>
            {!walletEnabled &&
              <div className="flex flex-col w-full gap-4 mt-6">
                <div className="flex flex-col w-full pb-4 mb-2 border-b border-gray-200">
                  <label className="flex items-center flex-1 gap-4 cursor-pointer">
                    <input type="checkbox" checked={walletEnabled}
                      onChange={() => {
                        if (!walletEnabled) {
                          handleEnableWallet();
                        }
                      }}
                      className="sr-only" />
                    <span className="text-sm font-normal text-black">{translate('label.myAccount.enableWalletText')}</span>
                    <div className={`relative w-[47px] h-[22px] transition-all ${walletEnabled ? "bg-emerald-500 border-emerald-800" : "bg-gray-300 border-gray-800"} rounded-full border`}>
                      <div className={`absolute w-[20px] h-[20px] rounded-full shadow-md top-0 left-0 transform transition-all ${walletEnabled ? "translate-x-6 bg-white" : "bg-gray-800"}`}></div>
                    </div>
                  </label>
                </div>
              </div>
            }
            {walletEnabled ? (
              <div className="w-full pb-10 mx-auto bg-white">
                <div className="p-4 mb-6 text-center bg-gray-100 rounded-lg">
                  <h3 className="text-lg font-medium">{translate('label.myAccount.walletCurrentBalanceText')}</h3>
                  <p className="text-3xl font-bold text-sky-500">{walletDetail?.formattedBalance}</p>
                </div>
                <h3 className="mb-3 text-lg font-medium">{translate('label.myAccount.walletTransactionHistoryText')}</h3>
                {isLoadingTransactions && <Loader />}
                {walletTransactions?.items?.length > 0 ? (
                  <>
                    <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                      <table className="min-w-full divide-y divide-gray-300">
                        <thead className="bg-gray-50">
                          <tr className="bg-gray-200">
                            <th className="p-2 font-semibold text-left border font-sm">{translate('label.myAccount.dateText')}</th>
                            <th className="p-2 font-semibold text-left border font-sm">{translate('label.product.specifications.typeText')}</th>
                            <th className="p-2 font-semibold text-left border font-sm">{translate('label.myAccount.referenceText')}</th>
                            <th className="p-2 font-semibold text-right border font-sm">{translate('label.myAccount.amountText')}</th>
                          </tr>
                        </thead>
                        <tbody className='bg-white divide-y divide-gray-200'>
                          {walletTransactions?.items.map((txn: any, index: number) => (
                            <tr key={index} className="text-sm bg-white border-b shadow-none border-slate-200 hover:shadow hover:bg-gray-100">
                              <td className="p-2 border">{moment(new Date(txn.createdOn)).format(DATE_FORMAT)}</td>
                              <td className="p-2 border">{txn.transactionType}</td>
                              <td className="p-2 border">{txn.transactionRef}</td>
                              <td className={`border p-2 text-right font-semibold ${txn.transactionType === "Credit" ? "text-green-600" : "text-red-600"}`} >
                                {txn.transactionType === "Debit" ? "-" : "+"}£{txn.amount}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    {paginationState.pageCount > 1 && <Pagination
                      currentPage={paginationState.pageNumber}
                      onPageChange={({ selected }: any) => getWalletTransactions({ walletId: user.walletId, page: selected + 1 })}
                      pageCount={paginationState.pageCount}
                    />}
                  </>
                ) : (
                  <>
                    <div className="flex flex-col justify-center w-full py-10">
                      <WalletIcon className="w-10 h-10 mx-auto text-gray-300" />
                      <h4 className="text-xl font-semibold text-center text-gray-300">{translate('label.myAccount.noTransactionHistoryMessage')}</h4>
                    </div>
                  </>
                )}

                <h3 className="mt-5 mb-3 text-lg font-medium">{translate('label.myAccount.bankTransferHistoryText')}</h3>
                {isLoadingBankTransactions && <Loader />}
                {bankTransferTransactions?.items?.length > 0 ? (
                  <>
                    <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                      <table className="min-w-full divide-y divide-gray-300">
                        <thead className="bg-gray-50">
                          <tr className="bg-gray-200">
                            <th className="p-2 font-semibold text-left border font-sm">{translate('label.myAccount.dateText')}</th>
                            <th className="p-2 font-semibold text-left border font-sm">{translate('label.myAccount.bankNameText')}</th>
                            <th className="p-2 font-semibold text-left border font-sm">{translate('label.myAccount.AccountNoText')}</th>
                            <th className="p-2 font-semibold text-left border font-sm">{translate('label.orderDetails.statusText')}</th>
                            <th className="p-2 font-semibold text-left border font-sm">{translate('label.myAccount.sortCodeText')}</th>
                            <th className="p-2 font-semibold text-right border font-sm">{translate('label.myAccount.amountText')}</th>
                          </tr>
                        </thead>
                        <tbody className='bg-white divide-y divide-gray-200'>
                          {bankTransferTransactions?.items.map(({ data }: any, index: number) => (
                            <tr key={index} className="text-sm bg-white border-b shadow-none border-slate-200 hover:shadow hover:bg-gray-100">
                              <td className="p-2 border">{moment(new Date(data.createdOn)).format(DATE_FORMAT)}</td>
                              <td className="p-2 border">{data.bankName}</td>
                              <td className="p-2 border">{data.accountNumber}</td>
                              <td className="p-2 border">{data.statusLabel}</td>
                              <td className="p-2 border">{data.sortCode}</td>
                              <td className={`border p-2 text-right font-semibold`} >
                                {data?.formattedAmount}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    {bankTransfersPaginationState.pageCount > 1 && <Pagination
                      currentPage={bankTransfersPaginationState.pageNumber}
                      onPageChange={({ selected }: any) => getBankTransfers({ walletId: user.walletId, page: selected + 1 })}
                      pageCount={bankTransfersPaginationState.pageCount}
                    />}
                  </>
                ) : (
                  <>
                    <div className="flex flex-col justify-center w-full py-10">
                      <WalletIcon className="w-10 h-10 mx-auto text-gray-300" />
                      <h4 className="text-xl font-semibold text-center text-gray-300">{translate('label.myAccount.noBankTransferHistoryText')}</h4>
                    </div>
                  </>
                )}

              </div>
            ) : (
              <div className="flex flex-col justify-center w-full py-10">
                <WalletIcon className="w-20 h-20 mx-auto text-gray-300" />
                <h4 className="text-xl font-semibold text-center text-gray-300">{translate('label.myAccount.walletDisabledMessage')}</h4>
              </div>
            )}
          </div>
          <TransferToBankModal open={openTransferToBankModal} handleClose={() => {setOpenTransferToBankModal(false)}} walletId={user.walletId} walletDetail={walletDetail} setSuccessMessage={setSuccessMessage} refreshWalletDetails={getWallet} />
          <AddBankDetailsModal open={openAddBankDetailsModal} handleClose={() => {setOpenAddBankDetailsModal(false)}} walletId={user.walletId} walletDetail={walletDetail} setSuccessMessage={setSuccessMessage} refreshWalletDetails={getWallet} />
        </>
    )
  );
}
