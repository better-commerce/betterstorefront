import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/router";
import { useSaveFormValidationSchema } from "../SaveFormValidationSchema";
import { useSaveFormConfig } from "../SaveFormConfig";
import { useFormik } from "formik";
import { LoadingDots,useUI } from "@components/ui";
import useCart from '@components/services/cart';
import { vatIncluded } from "@framework/utils/app-util";
import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { NEXT_B2B_GET_USERS } from "@components/utils/constants";
import { useTranslation } from "@commerce/utils/use-translation";
import { MinusIcon, PlusIcon } from "@heroicons/react/24/solid";
import { stringFormat } from "@framework/utils/parse-util";
import ProductQtyTextbox from '@components/account/RequestForQuote/ProductQtyTextbox'
import Spinner from "@components/ui/Spinner";
import Link from "next/link";
import { AlertType } from "@framework/utils/enums";
interface ITargetPrices {
  [productId: string]: number;
}

export const SaveRFQForm = ({ handleFormSubmit, cartItems, basketId }: any) => {
  const router = useRouter();
  const { user, setCartItems, setAlert } = useUI();
  const isIncludeVAT = vatIncluded();
  const [isClient, setIsClient] = useState(false);
  const { addToCart } = useCart();
  const [lines, setLines] = useState([]);
  const [b2bUsers, setB2BUsers] = useState<any>([]);
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [newTargetPrice, setNewTargetPrice] = useState<string>('');
  const translate = useTranslation();
  const formConfig = useSaveFormConfig();
  const validationSchema = useSaveFormValidationSchema();
  const [loadingProduct, setLoadingProduct] = useState<string | null>(null); // To track the loading state for each product
  const [targetPrices, setTargetPrices] = useState<ITargetPrices>({});
  useEffect(() => { if (!isClient) setIsClient(true) }, []);
  useEffect(() => { if (isClient && cartItems?.lineItems) setLines(restructureProductLines(cartItems?.lineItems, null)) }, [isIncludeVAT, isClient, cartItems]);

  const fetchB2BUsers = async () => {
    let { data: b2bUsers } = await axios.post(NEXT_B2B_GET_USERS, {
      companyId: user?.companyId,
    });
    if (b2bUsers?.length) {
      setB2BUsers(b2bUsers);
    }
    return b2bUsers;
  };

  useEffect(() => {
    fetchB2BUsers();
  }, []);

  // Initialize Formik
  const formik: any = useFormik({
    initialValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      userName: user?.email || '',
      email: user?.email || '',
      phoneNumber: user?.mobile || '',
      companyName: user?.companyName || '',
      companyId: user?.companyId || '',
      role: user?.companyUserRole || '-',
      notes: '',
      poNumber: '',
      validUntil: '',
      assignTo: user?.email || '',
    },
    validationSchema,
    onSubmit: async () => { },
  });

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const errors = await formik.validateForm();

    // Set all fields as touched so that error messages are shown
    formik.setTouched(
      Object.keys(formik.values).reduce((touched, key) => {
        touched[key] = true;
        return touched;
      }, {} as any)
    );

    // Check if there are validation errors
    if (Object.keys(errors).length === 0) {
      handleFormSubmit({ ...formik.values, lines });
    } else {
      formik.setErrors(errors);

      // Scroll to the top of the page when there are validation errors
      window.scrollTo({
        top: 0,
        behavior: "smooth" // Smooth scroll to the top
      });

      // Optionally, you can display a general error message at the top
      setAlert({
        type: 'error',
        msg: 'Please Enter PO Number/ETA before submit request.'
      });
    }
  };


  const openModal = (product: any, type: string) => {
    setSelectedProduct(product);
    if (type === 'delete') {
      setIsRemoveModalOpen(true);
    } else {
      setNewTargetPrice(product?.targetPrice);
      setIsModalOpen(true);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const removeFromCart = async ({ product }: { product: any }) => {
    const data: any = {
      basketId,
      productId: product?.productId,
      stockCode: product?.stockCode,
      qty: 0,
    };
    const item: any = await addToCart(data, 'delete', { product });
    setCartItems(item);
    const restructuredLines = restructureProductLines(item?.lineItems, targetPrices);
    setLines(restructuredLines);
  };

  const handleSaveTargetPrice = () => {
    if (selectedProduct) {
      const targetPrice = parseFloat(newTargetPrice);

      // Check if the target price is a valid number and not negative
      if (isNaN(targetPrice) || targetPrice <= 0) {
        setAlert({
          type: AlertType.ERROR,
          msg: translate("common.message.basket.minimumTargetPriceMsg")
        });
        return;
      }
      if (newTargetPrice > selectedProduct?.maxPrice) {
        setAlert({
          type: AlertType.ERROR,
          msg: translate("common.message.basket.maxTargetPriceExceedErrorMsg") + ` ${selectedProduct?.maxPrice}.`,
        });
        return
      }
      setTargetPrices((prev) => ({
        ...prev,
        [selectedProduct?.productId]: parseFloat(newTargetPrice),
      }));
      const updatedLines: any = lines?.map((line: any) =>
        line?.productId === selectedProduct?.productId
          ? { ...line, targetPrice: parseFloat(newTargetPrice) }
          : line
      );
      setLines(updatedLines);
      setAlert({
        type: AlertType.SUCCESS,
        msg: translate("common.message.basket.tagetPriceUpdateSuccessMsg"),
      });
    }
    closeModal();
  };


  const handleSetSameAsPrice = () => {
    if (selectedProduct) {
      const updatedLines: any = lines?.map((line: any) => {
        if (line?.productId === selectedProduct?.productId && targetPrices && targetPrices[line?.productId]) {
          const updatedTargetPrices = { ...targetPrices };
          delete updatedTargetPrices[line?.productId];
          setTargetPrices(updatedTargetPrices);
        }
        if (line?.productId === selectedProduct?.productId) {
          return { ...line, targetPrice: line?.price };
        }
        return line;
      });
      setLines(updatedLines);
    }
    closeModal();
  };
  let maxBasketItemsCount = 100
  let debounceTimer: any = null; // Create a debounce timer
  const handleItem = (product: any, type = 'increase') => {
    if (debounceTimer) {
      clearTimeout(debounceTimer); // Clear debounce timer
    }

    debounceTimer = setTimeout(async () => {
      setLoadingProduct(product?.productId); // Set loading state for this product

      const asyncHandleItem = async (product: any) => {
        const currentQty = product?.qty || 0;
        const data: any = {
          basketId,
          productId: product?.productId,
          stockCode: product?.stockCode,
          manualUnitPrice: product?.price,
          displayOrder: product?.displayOrder || "0",
          qty: currentQty, // Start with current qty
          targetPrice: product?.targetPrice || product?.price, // Keep the target price unchanged
        };

        if (type === 'increase') {
          if (currentQty < maxBasketItemsCount) {
            data.qty = 1; // Increment by 1
          } else {
            setAlert({
              type: 'error',
              msg: stringFormat(translate('common.message.basket.maxBasketItemsCountErrorMsg'), {
                maxBasketItemsCount,
              }),
            });
            setLoadingProduct(null); // Reset loading state
            return;
          }
        }

        if (type === 'decrease') {
          if (currentQty > 1) {
            data.qty = -1; // Decrease by 1
          } else {
            data.qty = 0;
          }
        }

        try {
          const updatedCart = await addToCart(data, type, { product });
          setCartItems(updatedCart); // Update cart state
          const restructuredLines = restructureProductLines(updatedCart?.lineItems, targetPrices);
          setLines(restructuredLines);
        } catch (error) {
          console.log(error);
        } finally {
          setLoadingProduct(null);
        }
      };

      if (product && product?.length) {
        product?.forEach((product: any) => {
          asyncHandleItem(product);
        });
      } else if (product?.productId) {
        asyncHandleItem(product);
      }
    }, 200);
  };


  const handleInputQuantity = (product: any, updateQty: any) => {
    const prevValue: number = parseInt(product?.qty);
    const newValue: number = parseInt(updateQty);
    let qtyChange = newValue - prevValue;

    if (newValue <= 0) {
      qtyChange = 0;
    }

    const asyncHandleItem = async (product: any) => {
      const data = {
        basketId,
        productId:product?.productId,
        stockCode: product?.stockCode,
        manualUnitPrice: product?.price,
        displayOrder: product?.displayOrder || "0",
        qty: qtyChange,
        targetPrice: product?.targetPrice || product?.price, // Preserve the target price
      };

      try {
        const updatedCart = await addToCart(data, 'ADD', { product });
        setCartItems(updatedCart);
        const restructuredLines = restructureProductLines(updatedCart?.lineItems, targetPrices);
        setLines(restructuredLines);
      } catch (error) {
        console.error("Error adding to cart:", error);
      } finally {
        setLoadingProduct(null);
      }
    };

    if (product && product?.length) {
      product?.forEach((product: any) => {
        asyncHandleItem(product);
      });
    } else if (product?.productId) {
      asyncHandleItem(product);
    }
  };




  return (
    <div className="flex flex-col w-full mt-2">
      <h1 className="text-xl font-normal sm:text-2xl dark:text-black">Request For Quote</h1>
      <div className="grid grid-cols-1 gap-6 mt-4 sm:gap-10 sm:grid-cols-12">
        <div className="flex flex-col w-full py-4 bg-white border divide-y divide-gray-200 shadow sm:col-span-8 border-slate-200 rounded-xl max-line-panel">
          {!lines ? <Spinner /> : lines?.length > 0 ? lines?.map((item: any, index: number) => (
            <div key={`rfq-line-items-${index}`} className="flex items-center justify-between gap-4 px-4 py-2 bg-white hover:bg-gray-50" >
              <Link passHref legacyBehavior href={`/${item?.slug}`}>
                <a className="text-[13px] font-medium text-sky-500 flex justify-start gap-2 items-center w-5/12">
                  <span>
                    <img src={item?.image} alt={item?.productName} className="w-10 h-10 rounded-md" />
                  </span>
                  <span>{item?.productName}</span>
                </a>
              </Link>
              <div className="flex justify-center w-6/12 gap-4">
                <div className="flex flex-col w-full gap-2">
                  <p className="flex items-center col-span-3 gap-1 text-xs"><span className="font-semibold text-black">{translate('label.myAccount.rfq.targetPrice')}:</span> {item?.currencySymbol}{item?.targetPrice}
                    <PencilSquareIcon className="w-4 h-4 col-span-1 text-gray-500 cursor-pointer hover:text-black" onClick={() => openModal(item, 'edit')} />
                  </p>
                  <div className="col-span-3 text-xs"><span className="text-black">
                    <span className="flex-1 font-semibold">{translate('label.myAccount.rfq.price')}:</span> {item?.price}</span>
                  </div>
                </div>
                <div className="flex flex-row items-center px-4 text-gray-900 border">
                  <MinusIcon onClick={() => handleItem(item, 'decrease')} className="w-4 text-gray-400 cursor-pointer hover:text-black" />
                  {loadingProduct === item?.productId ? <LoadingDots /> : <ProductQtyTextbox maxBasketItemsCount={maxBasketItemsCount} product={item} onUpdateBasket={handleInputQuantity} onLoading={setLoadingProduct} />}
                  <PlusIcon className="w-4 text-gray-400 cursor-pointer hover:text-black" onClick={() => handleItem(item, 'increase')} />
                </div>
              </div>
              <div className="flex justify-end w-1/12 gap-3">
                <TrashIcon className="w-4 h-4 col-span-1 text-gray-400 cursor-pointer hover:text-red-500" onClick={() => openModal(item, 'delete')} />
              </div>
            </div>
          )) : (<>
            <div className='flex flex-col items-center justify-center w-full gap-4 py-6 sm:py-10'>
              <span className="text-xl font-normal text-slate-300">
                No line item available
              </span>
            </div>
          </>)}
        </div>
        <div className="sm:col-span-4">
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col w-full gap-3 p-3 border shadow bg-gray-50 rounded-xl border-slate-200">
              {Object?.keys(formConfig?.fields)?.map((fieldKey) => {
                const field: any = formConfig.fields[fieldKey];
                const today = new Date().toISOString().split('T')[0]; // Get today's date in 'YYYY-MM-DD' format

                if (field.type === 'select') {
                  return (
                    <div key={fieldKey}>
                      <label className="block mb-1 text-xs font-medium text-black">
                        {field.label} {field?.required && <span className="text-red-600">*</span>}
                      </label>
                      <select
                        name={fieldKey}
                        className="w-full px-2 py-1 border border-gray-300 rounded-md text-[12px]"
                        onChange={formik?.handleChange}
                        value={formik?.values[fieldKey]}
                        onBlur={formik?.handleBlur}
                      >
                        <option value="">{translate('label.search.searchText')}</option>
                        {b2bUsers?.map((option: any) => (
                          <option key={option?.email} value={option?.email}>
                            {option?.firstName + ' ' + option?.lastName}
                          </option>
                        ))}
                      </select>
                      {formik?.errors[fieldKey] && formik?.touched[fieldKey] && (
                        <div className="text-xs text-red-600">{formik?.errors[fieldKey]}</div>
                      )}
                    </div>
                  );
                }

                return (
                  <div key={fieldKey} className={`${field?.type === 'textarea' ? "col-span-12" : ""}`}>
                    <label className="block mb-1 text-xs font-medium text-black">
                      {field.label} {field?.required && <span className="text-red-600">*</span>}
                    </label>
                    {field.type === 'textarea' ? (
                      <textarea
                        name={fieldKey}
                        placeholder={field.placeholder}
                        className="w-full h-24 px-2 text-[12px] py-1 border border-gray-300 rounded-md"
                        onChange={formik?.handleChange}
                        value={formik?.values[fieldKey]}
                        onBlur={formik?.handleBlur}
                      />
                    ) : (
                      <input
                        type={field.type}
                        name={fieldKey}
                        placeholder={field.placeholder}
                        readOnly={field?.readOnly}
                        className={`${formik?.errors[fieldKey] && formik?.touched[fieldKey] ? 'border-red-500' : ''
                          } w-full px-2 !text-[12px] py-1 border border-gray-300 rounded-md ${field?.readOnly ? 'bg-gray-100 font-medium text-black' : ''
                          }`}
                        onChange={formik?.handleChange}
                        value={formik?.values[fieldKey]}
                        onBlur={formik?.handleBlur}
                        min={field.type === 'date' ? today : undefined} // Set the min attribute for date fields
                      />
                    )}
                    {formik?.errors[fieldKey] && formik?.touched[fieldKey] && (
                      <div className="text-xs text-red-600">{formik?.errors[fieldKey]}</div>
                    )}
                  </div>
                );
              })}
            </div>
            {lines?.length > 0 && (
              <div className="flex justify-between mt-4 space-x-4">
                <button
                  type="button"
                  className="nc-Button relative h-auto inline-flex items-center justify-center rounded-full transition-colors text-sm sm:text-base font-medium py-3 px-4 sm:py-2.5 sm:px-6  ttnc-ButtonPrimary disabled:bg-opacity-90 bg-transparent dark:bg-slate-900 hover:transparent !text-black border border-gray-800 dark:text-slate-800 shadow-xl  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-6000 dark:focus:ring-offset-0"
                  onClick={() => router.back()}
                >
                  {translate('label.myAccount.rfq.backToList')}
                </button>
                <button
                  type="submit"
                  className="nc-Button relative h-auto inline-flex items-center justify-center rounded-full transition-colors text-sm sm:text-base font-medium py-3 px-4 sm:py-2.5 sm:px-6  ttnc-ButtonPrimary disabled:bg-opacity-90 bg-slate-900 dark:bg-slate-900 hover:bg-slate-800 !text-slate-50 dark:text-slate-800 shadow-xl  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-6000 dark:focus:ring-offset-0"
                >
                  Submit Request
                </button>
              </div>
            )}
          </form>

        </div>
      </div>

      {(isModalOpen || isRemoveModalOpen) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="w-full max-w-md p-6 mx-4 bg-white rounded-lg shadow-lg">
            <h3 className="mb-4 text-lg font-semibold text-gray-800">
              {isModalOpen ? translate('label.myAccount.rfq.editTargetPrice') : translate('label.myAccount.rfq.removeProduct')}
            </h3>
            {isModalOpen ? (
              <>
                <div className="mb-4">
                  <label className="block mb-2 text-sm font-medium text-gray-700">{translate('label.myAccount.rfq.newTargetPrice')}</label>
                  <input type="text" value={newTargetPrice} onChange={(e) => setNewTargetPrice(e.target.value)} className="w-full p-3 border border-gray-300 rounded-md shadow-sm text-[12px] focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div className="flex justify-end mt-6 space-x-4">
                  <button type="button" className="btn btn-default !px-4 !py-2 !rounded-full !capitalize" onClick={handleSetSameAsPrice} >
                    {translate('label.myAccount.rfq.setToListedPrice')}
                  </button>
                  <button type="button" className="btn btn-default !px-4 !py-2 !rounded-full !capitalize" onClick={closeModal} >
                    {translate('label.myAccount.rfq.cancel')}
                  </button>
                  <button type="button" className="btn btn-primary !px-4 !py-2 !rounded-full !capitalize" onClick={handleSaveTargetPrice} >
                    {translate('label.myAccount.rfq.save')}
                  </button>
                </div>
              </>
            ) : (
              <>
                <p className="mb-4 text-gray-600">{translate('label.myAccount.rfq.removeProductConfirmation')}</p>
                <div className="flex justify-end space-x-4">
                  <div className="btn btn-default !px-4 !py-2 !rounded-full !capitalize" onClick={() => setIsRemoveModalOpen(false)} >
                    {translate('label.myAccount.rfq.cancel')}
                  </div>
                  <div
                    className="btn btn-primary !px-4 !py-2 !rounded-full !capitalize"
                    onClick={() => {
                      if (selectedProduct) {
                        removeFromCart({ product: selectedProduct });
                        setIsRemoveModalOpen(false);
                      }
                    }}
                  >
                    {translate('label.myAccount.rfq.removeProduct')}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Helper functions

const restructureProductLines = (lines: any, targetPrices: any) => {
  const newLines = lines?.map((value: any) => {
    let line = sanitizeProduct(value)
    if (targetPrices && targetPrices[line?.productId]) {
      line.targetPrice = targetPrices[line?.productId];
    }
    return line;
  }
  );
  return newLines;
};

const sanitizeProduct = (product: any) => {
  const isIncludeVAT = vatIncluded();
  return {
    productId: product?.productId,
    productName: product?.name,
    image: product?.image,
    slug: product?.slug,
    stockCode: product?.stockCode,
    qty: product?.qty,
    currencySymbol: product?.price?.currencySymbol,
    price: isIncludeVAT ? product?.price?.formatted?.withTax : product?.price?.formatted?.withoutTax,
    listPrice: isIncludeVAT ? product?.listPrice?.formatted?.withTax : product?.listPrice?.formatted?.withoutTax,
    targetPrice: isIncludeVAT ? product?.price?.raw?.withTax : product?.price?.raw?.withoutTax,
    maxPrice: product?.price?.raw?.withTax,
  };
};
