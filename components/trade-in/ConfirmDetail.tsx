import { useState, ChangeEvent } from "react";
import axios, { AxiosRequestConfig } from "axios";
import { useRouter } from "next/router";
import TradeInLogin from "@components/shared/Login/TradeInLogin";
import { CheckIcon, ChevronLeftIcon, ChevronRightIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useUI } from "@components/ui";
import { NEXT_TRADE_IN_GUEST_LOGIN, NEXT_TRADE_IN_LOGIN_USER, TradeInItemCondition } from "@components/utils/constants";
import Loader from "@components/Loader";
import { updateQueryParams } from "framework/utils/app-util";
import { logError } from "@framework/utils/app-util";
import { RequestMethod } from "bc-payments-sdk/dist/constants";
import { callApi } from "@framework/utils/api-util";

export default function ConfirmDetails({ selectedItems, nextSteps, setSuccessMessage, prevStep, deviceInfo }: any) {
  const router = useRouter();
  const { user } = useUI();
  const { isMobile } = deviceInfo
  const [showGuestForm, setShowGuestForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [guestData, setGuestData] = useState({ firstName: "", lastName: "", email: "", phone: "" });
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setGuestData((prev) => ({ ...prev, [name]: value }));
    setValidationErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateGuestForm = () => {
    let errors: { [key: string]: string } = {};
    if (!guestData.firstName.trim()) errors.firstName = "First name is required";
    if (!guestData.lastName.trim()) errors.lastName = "Last name is required";
    if (!guestData.email.trim()) errors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(guestData.email)) errors.email = "Invalid email format";

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const conditionLabels: Record<string, number> = {
    [TradeInItemCondition.LIKE_NEW]: 1,
    [TradeInItemCondition.EXCELLENT]: 2,
    [TradeInItemCondition.VERY_GOOD]: 3,
    [TradeInItemCondition.GOOD]: 4,
    [TradeInItemCondition.WELL_USED]: 5,
    [TradeInItemCondition.FAULTY]: 6,
  };
  const submitGuestRequest = async () => {
    if (!validateGuestForm()) return;
    setIsLoading(true);
    try {
      // Getting User Token API calls
      const { data: guestLoginResult }: any = await axios.post(NEXT_TRADE_IN_GUEST_LOGIN, { data: { ...guestData } });
      // END Getting User Token API calls

      const items = selectedItems?.map(({ selectedProductData, selectedCondition, selectedAccessories }: any) => ({
        parentStockCode: selectedProductData?.stockCode || "",
        productName: selectedProductData?.name || "",
        conditions: conditionLabels[selectedCondition?.conditionName] || 0,
        accessories: selectedAccessories || [],
      }));
      const config: AxiosRequestConfig = { url: NEXT_TRADE_IN_LOGIN_USER, method: RequestMethod.POST, data: { customerId: guestLoginResult?.customerId, items } };
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

  return (
    <>
      {isLoading && <Loader />}
      <div className="flex flex-col w-full gap-6 mt-4 sm:mt-5">
        <div className="mt-6 text-center sm:mt-8">
          <h3 className="text-xl sm:text-3xl font-semibold text-[#2d4d9c]">Quote Summary</h3>
        </div>
      </div>
      {isMobile ? (<>
        <div className="flex flex-col w-full overflow-hidden shadow ring-1 ring-gray-300 sm:rounded">
          <table className="min-w-full divide-y divide-gray-300">
            <thead className="bg-gray-50">
              <tr>
                {["Description", "Instant Quote"].map((header) => (
                  <th key={header} className="!pr-2 py-2 text-left text-xs font-semibold text-gray-900">{header}</th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {selectedItems?.sort((a: any, b: any) => a?.parentProductName?.localeCompare(b?.parentProductName))?.map((item: any, idx: number) => (
                <tr key={`item-${idx}`} className="bg-white hover:bg-gray-100">
                  <td className="py-2 pl-1 pr-3 text-sm font-medium text-left text-gray-900 whitespace-nowrap">
                    <div className="flex items-start gap-1 justify-normal">
                      <div className="w-10">
                        <img src={item?.selectedProductImage} className="inline-block w-10 h-auto" alt={item?.selectedProduct} />
                      </div>
                      <div className="flex flex-col w-full gap-0">
                        <span className="text-sm">{item?.selectedProduct}</span>
                        <span className="text-xs font-medium"><strong>Condition:</strong> {item?.selectedCondition?.conditionName == TradeInItemCondition.WELL_USED ? 'Well Used' :
                          item?.selectedCondition?.conditionName == TradeInItemCondition.FAULTY ? 'Faulty' : item?.selectedCondition?.conditionName == TradeInItemCondition.GOOD ? 'Good' : item?.selectedCondition?.conditionName == TradeInItemCondition.VERY_GOOD ? 'Very Good' : item?.selectedCondition?.conditionName == TradeInItemCondition.EXCELLENT ? 'Excellent' : item?.selectedCondition?.conditionName == TradeInItemCondition.LIKE_NEW ? 'Like New' : 'N/A'
                        }</span>
                        <span className="text-xs font-medium">
                          <strong>Accessories:</strong> {item?.selectedAccessories?.length ? (
                            [...item.selectedAccessories]
                              .map((acc) => item?.selectedProductData?.accessories?.find((a: any) => a.accessoryId === acc))
                              .filter((accessory) => accessory)
                              .sort((a, b) => a.accessoryName.localeCompare(b.accessoryName))
                              .map((accessory) => accessory?.accessoryName || "-") // Extract names
                              .join(", ") // Join with commas
                          ) : (
                            <span className="pr-2">N/A</span>
                          )}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-1 py-2 text-sm text-gray-500">
                    {item?.selectedAccessories?.length > 0 ?
                      <CheckIcon className="w-6 h-6 text-emerald-600" /> : <XMarkIcon className="w-6 h-6 text-red-600" />
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </>) : (<>
        <div className="flex flex-col w-full overflow-hidden shadow ring-1 ring-gray-300 sm:rounded">
          <table className="min-w-full divide-y divide-gray-300">
            <thead className="bg-gray-50">
              <tr>
                {["Description", "Condition", "Accessories", "Instant Quote Available"].map((header) => (
                  <th key={header} className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">{header}</th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {selectedItems?.sort((a: any, b: any) => a?.parentProductName?.localeCompare(b?.parentProductName))?.map((item: any, idx: number) => (
                <tr key={`item-${idx}`} className="bg-white hover:bg-gray-100">
                  <td className="py-4 pl-4 pr-3 text-sm font-medium text-left text-gray-900 whitespace-nowrap">
                    <img src={item?.selectedProductImage} className="inline-block w-10 h-auto mr-2" alt={item?.selectedProduct} />
                    {item?.selectedProduct}
                  </td>
                  <td className="px-3 py-4 text-sm text-left text-gray-500">{item?.selectedCondition?.conditionName == TradeInItemCondition.WELL_USED ? 'Well Used' :
                    item?.selectedCondition?.conditionName == TradeInItemCondition.FAULTY ? 'Faulty' : item?.selectedCondition?.conditionName == TradeInItemCondition.GOOD ? 'Good' : item?.selectedCondition?.conditionName == TradeInItemCondition.VERY_GOOD ? 'Very Good' : item?.selectedCondition?.conditionName == TradeInItemCondition.EXCELLENT ? 'Excellent' : item?.selectedCondition?.conditionName == TradeInItemCondition.LIKE_NEW ? 'Like New' : 'N/A'
                  }</td>
                  <td className="px-3 py-4 text-sm text-left text-gray-500">
                    {item?.selectedAccessories?.length ? (
                      [...item.selectedAccessories]
                        .map((acc) => item?.selectedProductData?.accessories?.find((a: any) => a.accessoryId === acc))
                        .filter((accessory) => accessory)
                        .sort((a, b) => a.accessoryName.localeCompare(b.accessoryName))
                        .map((accessory) => accessory?.accessoryName || "-") // Extract names
                        .join(", ") // Join with commas
                    ) : (
                      <span className="pr-2">N/A</span>
                    )}
                  </td>
                  <td className="px-3 py-4 text-sm text-gray-500">
                    {item?.selectedAccessories?.length > 0 ?
                      <CheckIcon className="w-6 h-6 text-emerald-600" /> : <XMarkIcon className="w-6 h-6 text-red-600" />
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </>)}

      <div className="flex-col items-start justify-start flex-1 ml-0">
        <button onClick={() => prevStep()} className="px-3 py-2 items-center gap-1 flex border border-[#2d4d9c] text-[#2d4d9c] rounded hover:bg-[#2d4d9c] text-sm hover:text-white disabled:bg-gray-300">
          <ChevronLeftIcon className="w-5 h-5" /> Edit Products
        </button>
      </div>
      <div className="flex flex-col justify-center">
        {!showGuestForm && !user?.userId ? (
          <div className="flex flex-col justify-center gap-4 mb-6 text-center">
            <button onClick={() => setShowGuestForm(true)} className="px-4 flex items-center gap-1 py-2 justify-center border border-[#2d4d9c] text-[#2d4d9c] rounded hover:bg-[#2d4d9c] hover:text-white disabled:bg-gray-300">
              Continue as Guest <ChevronRightIcon className="w-5 h-5" />
            </button>
            <span>Or</span>
          </div>
        ) : null}

        {!showGuestForm ? (
          <TradeInLogin pluginConfig={undefined} selectedItems={selectedItems} nextSteps={nextSteps} setSuccessMessage={setSuccessMessage} />
        ) : (
          <div className="flex flex-col items-center justify-start w-full gap-2 sm:flex-row">
            {["firstName", "lastName", "email", "phone"].map((field) => (
              <div key={field} className="flex flex-col w-full sm:w-auto">
                <input
                  type="text"
                  name={field}
                  placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                  value={guestData[field as keyof typeof guestData]}
                  onChange={handleInputChange}
                  className={`p-2 text-sm font-normal sm:w-auto w-full text-black border rounded ${validationErrors[field] ? "border-red-500" : "border-gray-200"
                    }`}
                />
                {validationErrors[field] && <span className="text-xs text-left text-red-500">{validationErrors[field]}</span>}
              </div>
            ))}
            <button onClick={submitGuestRequest} className="py-2 px-6 text-white bg-[#2d4d9c] rounded w-full sm:w-auto">
              Continue as Guest
            </button>
            <span className="text-sm font-semibold">OR</span>
            <button onClick={() => setShowGuestForm(false)} className="text-[#2d4d9c] rounded hover:underline underline text-sm disabled:bg-gray-300">
              Login Here
            </button>
          </div>
        )}
      </div>
    </>
  );
}