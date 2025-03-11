import { useEffect, useState, ChangeEvent } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import TradeInLogin from "@components/shared/Login/TradeInLogin";
import { CheckIcon } from "@heroicons/react/24/outline";
import { useUI } from "@components/ui";
import { NEXT_TRADE_IN_GET_QUOTE_BY_ID, NEXT_TRADE_IN_GUEST_CHECKOUT, TradeInItemCondition } from "@components/utils/constants";
import Loader from "@components/Loader";
import { updateQueryParams } from "framework/utils/app-util";
import { logError } from "@framework/utils/app-util";

export default function ConfirmDetails({ selectedItems, nextSteps, handleGuest, setSuccessMessage }: any) {
  const router = useRouter();
  const { user } = useUI();
  const [showGuestForm, setShowGuestForm] = useState(false);
  const [quoteDetails, setQuoteDetails] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [guestData, setGuestData] = useState({ firstName: "", lastName: "", email: "", phone: "" });

  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setGuestData((prev) => ({ ...prev, [name]: value }));

    // Remove validation error as user types
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
    [TradeInItemCondition.WELL_USED]: 1,
    [TradeInItemCondition.GOOD]: 2,
    [TradeInItemCondition.VERY_GOOD]: 3,
    [TradeInItemCondition.EXCELLENT]: 4,
    [TradeInItemCondition.LIKE_NEW]: 5,
  };

  const fetchQuoteDetails = async (quoteId: string) => {
    try {
      const { data } = await axios.post(NEXT_TRADE_IN_GET_QUOTE_BY_ID, { data: { id: quoteId } });
      setQuoteDetails(data);

      // AS DISCUSSED WITH MASOOD SIR ADDED THIS HANDLING TO GET GUEST NAME AND PASS TO NEXT STEP TO SHOW GUEST NAME INSTEAD OF ID 
      // MASOOD SIR WORKING ON GUEST LOGIN SOLUTION AS THERE IS SECURITY BREACH POSSIBILITY. ONCE DONE WILL ADD GUEST API CALL TO LOGIN AS GUEST.
      handleGuest(guestData?.firstName)

      nextSteps(data);
    } catch (error) {
      logError(error)
    }
  };

  const submitGuestRequest = async () => {
    if (!validateGuestForm()) return;
    setIsLoading(true);
    try {
      const items = selectedItems?.map(({ selectedProductData, selectedCondition, selectedAccessories }: any) => ({
        parentStockCode: selectedProductData?.stockCode || "",
        conditions: conditionLabels[selectedCondition?.conditionName] || 0,
        accessories: selectedAccessories || [],
      }));

      const { data: quoteId } = await axios.post(NEXT_TRADE_IN_GUEST_CHECKOUT, { data: { ...guestData, items } });
      updateQueryParams(router, { quoteId });
      if (quoteId) {
        setSuccessMessage("Quote created successfully!!!");
      }
      await fetchQuoteDetails(quoteId);

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
                  item?.selectedCondition?.conditionName == TradeInItemCondition.GOOD ? 'Good' : item?.selectedCondition?.conditionName == TradeInItemCondition.VERY_GOOD ? 'Very Good' : item?.selectedCondition?.conditionName == TradeInItemCondition.EXCELLENT ? 'Excellent' : item?.selectedCondition?.conditionName == TradeInItemCondition.LIKE_NEW ? 'Like New' : 'N/A'
                }</td>
                <td className="px-3 py-4 text-sm text-left text-gray-500">
                  {item?.selectedAccessories?.length
                    ? item?.selectedAccessories?.map((acc: any, accId: number) => {
                      const accessory = item?.selectedProductData?.accessories?.find((a: any) => a.accessoryId === acc);
                      return <span key={`acc-${accId}`} className="pr-2">{accessory?.accessoryName || "-"}</span>;
                    })
                    : <span className="pr-2">N/A</span>
                  }
                </td>
                <td className="px-3 py-4 text-sm text-gray-500">
                  <CheckIcon className="w-6 h-6 text-emerald-600" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col justify-center mt-6">
        {!showGuestForm && !user?.userId ? (
          <div className="flex flex-col justify-center gap-4 mb-6 text-center">
            <button onClick={() => setShowGuestForm(true)} className="px-4 py-3 border border-[#2d4d9c] text-[#2d4d9c] rounded hover:bg-[#2d4d9c] hover:text-white disabled:bg-gray-300">
              Continue as Guest
            </button>
            <span>Or</span>
          </div>
        ) : null}

        {!showGuestForm ? (
          <TradeInLogin pluginConfig={undefined} selectedItems={selectedItems} nextSteps={nextSteps} />
        ) : (
          <div className="flex justify-start gap-2">
            {["firstName", "lastName", "email", "phone"].map((field) => (
              <div key={field} className="flex flex-col">
                <input
                  type="text"
                  name={field}
                  placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                  value={guestData[field as keyof typeof guestData]}
                  onChange={handleInputChange}
                  className={`p-2 text-sm font-normal text-black border rounded ${validationErrors[field] ? "border-red-500" : "border-gray-200"
                    }`}
                />
                {validationErrors[field] && <span className="text-xs text-left text-red-500">{validationErrors[field]}</span>}
              </div>
            ))}
            <button onClick={submitGuestRequest} className="py-2 px-6 text-white bg-[#2d4d9c] rounded">
              Continue as Guest
            </button>
          </div>
        )}
      </div>
    </>
  );
}