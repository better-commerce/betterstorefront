import { ChangeEvent, useState } from 'react'
import axios, { AxiosRequestConfig } from 'axios'
import { useRouter } from 'next/router'
import { EmptyString, NEXT_TRADE_IN_CUSTOMERS, NEXT_TRADE_IN_LOGIN, NEXT_TRADE_IN_LOGIN_USER, OTP_LOGIN_ENABLED, TradeInItemCondition } from '@components/utils/constants'
import { useUI } from '@components/ui/context'
import useAnalytics from '@components/services/analytics/useAnalytics'
import { getEnabledSocialLogins, logError } from '@framework/utils/app-util'
import { useTranslation } from '@commerce/utils/use-translation'
import LoginOTPComp from '@components/account/login-otp'
import SocialSignInLinks from './SocialSignInLinks'
import { AnalyticsEventType } from '@components/services/analytics'
import { PAGE_TYPES } from '@components/withDataLayer'
import { updateQueryParams } from 'framework/utils/app-util'
import Loader from '@components/Loader'
import { RequestMethod } from 'bc-payments-sdk/dist/constants'
import { callApi } from '@framework/utils/api-util'

interface LoginProps {
  isLoginSidebarOpen?: boolean;
  redirectToOriginUrl?: boolean;
  pluginConfig: any;
  closeSideBar?: any;
  selectedItems?: any;
  nextSteps?: any;
  token?: any;
  setSuccessMessage?: any;
}

export default function TradeInLogin({ isLoginSidebarOpen, redirectToOriginUrl = false, pluginConfig = [], closeSideBar = () => { }, selectedItems, nextSteps, setSuccessMessage }: LoginProps) {
  const { recordAnalytics } = useAnalytics()
  const translate = useTranslation()

  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false);
  const [loginDetail, setLoginDetails] = useState<any>(null)
  const [loginData, setLoginData] = useState({ username: "", password: "" });
  const { isGuestUser, setIsGuestUser, setUser, user } = useUI()
  const otpEnabled = OTP_LOGIN_ENABLED
  const SOCIAL_LOGINS_ENABLED = getEnabledSocialLogins(pluginConfig)
  const conditionLabels: Record<string, number> = {
    [TradeInItemCondition.LIKE_NEW]: 1,
    [TradeInItemCondition.EXCELLENT]: 2,
    [TradeInItemCondition.VERY_GOOD]: 3,
    [TradeInItemCondition.GOOD]: 4,
    [TradeInItemCondition.WELL_USED]: 5,
  };
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));

    // Remove validation error as user types
    setValidationErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateLoginForm = () => {
    let errors: { [key: string]: string } = {};
    if (!loginData.password.trim()) errors.password = "Password is required";
    if (!loginData.username.trim()) errors.username = "username is required";
    else if (!/\S+@\S+\.\S+/.test(loginData.username)) errors.username = "Invalid user name format";

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const submitLoginRequest = async () => {
    if (!validateLoginForm()) return;
    setIsLoading(true);
    try {
      // Getting User Token API calls

      const { data: loginResult }: any = await axios.post(NEXT_TRADE_IN_LOGIN, { data: { ...loginData } });
      if (loginResult) {
        setLoginDetails(loginResult);
      }
      const config1: AxiosRequestConfig = { url: NEXT_TRADE_IN_CUSTOMERS, method: RequestMethod.GET };
      const { data: userResult }: any = await callApi(config1);
      // END Getting User Token API calls
      setUser({ ...loginResult, ...userResult })
      setIsGuestUser(false)
      const items = selectedItems?.map(({ selectedProductData, selectedCondition, selectedAccessories }: any) => ({
        parentStockCode: selectedProductData?.stockCode || "",
        productName: selectedProductData?.name || "",
        conditions: conditionLabels[selectedCondition?.conditionName] || 0,
        accessories: selectedAccessories || [],
      }));

      const config: AxiosRequestConfig = { url: NEXT_TRADE_IN_LOGIN_USER, method: RequestMethod.POST, data: { customerId: loginResult?.userId, items } };
      const { data: quoteId } = await callApi(config);

      updateQueryParams(router, { quoteId });
      if (quoteId) {
        setSuccessMessage("Quote created successfully!!!");
      }
    } catch (error) {
      logError(error)
    } finally {
      setIsLoading(false);
    }
  };

  let redirectUrl = EmptyString
  if (redirectToOriginUrl) {
    const url = new URL(document.URL)
    redirectUrl = `${url?.origin}${url?.pathname}${url?.search}`
  }
  recordAnalytics(AnalyticsEventType.PAGE_VIEWED, { entityName: PAGE_TYPES.Login, })

  const getConditionValue = (conditionName: string) => {
    const conditionMap: Record<string, number> = {
      [TradeInItemCondition.LIKE_NEW]: 1,
      [TradeInItemCondition.EXCELLENT]: 2,
      [TradeInItemCondition.VERY_GOOD]: 3,
      [TradeInItemCondition.GOOD]: 4,
      [TradeInItemCondition.WELL_USED]: 5,
    };
    return conditionMap[conditionName] || 0;
  };
  const submitLoggedInUserRequest = async () => {
    setIsLoading(true);
    const allItems = selectedItems?.map((item: any) => ({
      parentStockCode: item?.selectedProductData?.stockCode || "",
      productName: item?.selectedProductData?.name || "",
      conditions: getConditionValue(item?.selectedCondition?.conditionName),
      accessories: item.selectedAccessories || [],
    }));

    try {
      const config: AxiosRequestConfig = { url: NEXT_TRADE_IN_LOGIN_USER, method: RequestMethod.POST, data: { customerId: user?.userId, items: allItems } };
      const quoteResp = await callApi(config);

      updateQueryParams(router, { quoteId: quoteResp?.data });
    } catch (error) {
      logError(error)
    } finally {
      setIsLoading(false);
    }
  };
  if (!isGuestUser && user.userId) {
    return (
      <>
        {isLoading && <Loader />}
        <div className="flex flex-col w-full h-full">
          <button onClick={() => submitLoggedInUserRequest()} className="py-3 px-6 text-white bg-[#2d4d9c] rounded w-full">Continue</button>
        </div>
      </>
    )
  }

  if (otpEnabled) {
    return <LoginOTPComp />
  }

  return (
    <>
      {isLoading && <Loader />}
      <section aria-labelledby="trending-heading" className="bg-gray-50">
        <div className="px-10 pt-10 pb-10 text-left lg:max-w-7xl lg:mx-auto sm:pt-6 sm:pb-6">
          <div className="flex flex-col px-4 mb-4 sm:px-6 lg:px-0 sm:mb-6">
            <h3 className="text-xl font-medium text-left text-black">
              {translate('label.login.loginBtnText')}
            </h3>
            <p className='text-sm font-normal text-left text-gray-600'>Already got a Park Cameras account? Log in below.</p>
          </div>
          <div className='grid grid-cols-12 gap-10'>
            <div className='col-span-6'>
              <div className="w-full">
                <div className="grid gap-3">
                  {SOCIAL_LOGINS_ENABLED && (
                    <div className='social-login-section'>
                      <SocialSignInLinks isLoginSidebarOpen={isLoginSidebarOpen} containerCss={`flex justify-center gap-2 mx-auto ${isLoginSidebarOpen ? 'sm:w-full width-md-full !px-0' : 'width-md-full'}`} redirectUrl={redirectUrl} pluginSettings={pluginConfig} />
                    </div>
                  )}
                </div>
                {SOCIAL_LOGINS_ENABLED &&
                  <div className="relative text-center">
                    <span className="relative z-10 inline-block px-4 text-sm font-medium bg-white dark:text-neutral-400 dark:bg-neutral-900">
                      OR
                    </span>
                    <div className="absolute left-0 w-full transform -translate-y-1/2 border top-1/2 border-neutral-100 dark:border-neutral-800"></div>
                  </div>
                }
                <div className='flex flex-col items-center justify-start gap-3 mb-4'>
                  {["username", "password"].map((field) => (
                    <div key={field} className="flex flex-col w-full">
                      <input
                        type={field === "password" ? "password" : "text"}
                        name={field}
                        placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                        value={loginData[field as keyof typeof loginData]}
                        onChange={handleInputChange}
                        className={`p-2 text-sm font-normal w-full text-black border rounded ${validationErrors[field] ? "border-red-500" : "border-gray-200"
                          }`}
                      />
                      {validationErrors[field] && (
                        <span className="text-xs text-left text-red-500">
                          {validationErrors[field]}
                        </span>
                      )}
                    </div>
                  ))}

                  <button onClick={submitLoginRequest} className="py-2 px-6 w-full text-white bg-[#2d4d9c] rounded">
                    Login
                  </button>
                </div>
                <div className={`flex flex-col items-start text-left justify-start w-full mt-0 mx-auto ${isLoginSidebarOpen ? 'sm:w-full ' : 'sm:w-full'}`} >
                  <a href="/my-account/forgot-password" target='_blank'>
                    <span className="block text-sm font-medium underline cursor-pointer text-sky-600 hover:text-sky-800 hover:underline">
                      {translate('label.login.forgotPasswordBtnText')}
                    </span>
                  </a>
                </div>
                <span className="block text-sm text-left text-neutral-700 dark:text-neutral-700">
                  {translate('label.login.newUserText')}{` `}
                  <a className="underline text-sky-600" href="/my-account/register" target='_blank'>
                    {translate('label.login.createAccountText')}
                  </a>
                </span>
              </div>
            </div>
            <div className='col-span-6'>
              <h3 className="text-xl font-medium text-left text-black">Login to get the following benefits:</h3>
              <ul className='pl-0 text-sm list-disc list-inside'>
                <li>Quick and easy trade-in from start to finish</li>
                <li>Track your quote through its journey</li>
                <li>Loyalty points on your account</li>
                <li>Speedier payments</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
