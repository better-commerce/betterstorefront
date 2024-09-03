import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/router";
import { useSaveFormValidationSchema } from "../SaveFormValidationSchema";
import { useSaveFormConfig } from "../SaveFormConfig";
import { useFormik } from "formik";
import { useUI } from "@components/ui";
import useCart from '@components/services/cart';
import { vatIncluded } from "@framework/utils/app-util";
import { useEffect, useState } from "react";
import axios from "axios";
import { NEXT_B2B_GET_USERS } from "@components/utils/constants";
import { useTranslation } from "@commerce/utils/use-translation";

export const SaveRFQForm = ({ handleFormSubmit, cartItems, basketId }: any) => {
  const router = useRouter();
  const { user, setCartItems } = useUI();
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

  useEffect(() => { if (!isClient) setIsClient(true) }, []);
  useEffect(() => { if (isClient && cartItems?.lineItems) setLines(restructureProductLines(cartItems?.lineItems)) }, [isIncludeVAT, isClient]);

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
      userName: user?.username || '',
      email: user?.email || '',
      phoneNumber: user?.mobileNumber || '',
      companyName: user?.companyName || '',
      role: user?.role || '',
      notes: '',
      poNumber: '',
      validUntil: '',
      assignedTo: '',
    },
    validationSchema ,
    onSubmit: async () => { },
  });

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const errors = await formik?.validateForm();
    formik?.setTouched(
      Object?.keys(formik?.values).reduce((touched, key) => {
        touched[key] = true;
        return touched;
      }, {} as any)
    );
    if (Object?.keys(errors).length === 0) {
      handleFormSubmit({ ...formik?.values, lines });
    } else {
      formik?.setErrors(errors);
    }
  };

  const openModal = (product: any, type: string) => {
    setSelectedProduct(product);
    if (type === 'delete') {
      setIsRemoveModalOpen(true);
    } else {
      setNewTargetPrice(product.targetPrice);
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
      productId: product?.ProductId,
      stockCode: product?.stockCode,
      qty: 0,
    };
    const item: any = await addToCart(data, 'delete', { product });
    setCartItems(item);
    const restructuredLines = restructureProductLines(item?.lineItems);
    setLines(restructuredLines);
  };

  const handleSaveTargetPrice = () => {
    if (selectedProduct) {
      const updatedLines: any = lines.map((line: any) =>
        line.ProductId === selectedProduct.ProductId
          ? { ...line, targetPrice: newTargetPrice }
          : line
      );
      setLines(updatedLines);
    }
    closeModal();
  };

  const handleSetSameAsPrice = () => {
    if (selectedProduct) {
      const updatedLines: any = lines.map((line: any) =>
        line.ProductId === selectedProduct.ProductId
          ? { ...line, targetPrice: line.price }
          : line
      );
      setLines(updatedLines);
    }
    closeModal();
  };

  return (
    <div className="flex flex-col w-full">
      <h1 className="mb-6 text-2xl font-semibold">{translate('label.myAccount.rfq.requestForQuote')}</h1>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-6 mb-6 sm:grid-cols-2">
          {Object?.keys(formConfig?.fields).map((fieldKey) => {
            const field:any = formConfig.fields[fieldKey];
            if (field.type === 'select') {
              return (
                <div key={fieldKey}>
                  <label className="block mb-2 text-sm font-medium">{field.label} {field?.required && <span className="text-red-600">*</span>}</label>
                  <select
                    name={fieldKey}
                    className="w-full p-2 border border-gray-300 rounded-md"
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
                    <div className="text-sm text-red-600">{formik?.errors[fieldKey]}</div>
                  )}
                </div>
              );
            }

            return (
              <div key={fieldKey} className={`${field?.type === 'textarea' ? "col-span-2" : ""}`}>
                <label className="block mb-2 text-sm font-medium">{field.label} {field?.required && <span className="text-red-600">*</span>}</label>
                {field.type === 'textarea' ? (
                  <textarea
                    name={fieldKey}
                    placeholder={field.placeholder}
                    className="w-full h-24 p-2 border border-gray-300 rounded-md"
                    onChange={formik?.handleChange}
                    value={formik?.values[fieldKey]}
                    onBlur={formik?.handleBlur}
                  />
                ) : (
                  <input
                    type={field.type}
                    name={fieldKey}
                    placeholder={field.placeholder}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    onChange={formik?.handleChange}
                    value={formik?.values[fieldKey]}
                    onBlur={formik?.handleBlur}
                  />
                )}
                {formik?.errors[fieldKey] && formik?.touched[fieldKey] && (
                  <div className="text-sm text-red-600">{formik?.errors[fieldKey]}</div>
                )}
              </div>
            );
          })}
        </div>

        <div className="w-full">
          <h2 className="mb-4 text-xl font-semibold">{translate('label.myAccount.rfq.lineItems')}</h2>
          <div className="grid grid-cols-1 gap-4 mb-6">
            {lines?.map((item: any, index: number) => (
              <div
                key={index}
                className="grid grid-cols-12 gap-2 p-2 border border-gray-300 rounded-md bg-gray-50"
              >
                <div className="col-span-4">
                  <a href="#" className="text-xs text-blue-600 underline">{item?.stockCode} - {item?.productName}</a>
                </div>
                <div className="grid grid-cols-7 col-span-6 space-x-2">
                  <p className="col-span-1 text-xs">{translate('label.myAccount.rfq.quantity')}: {item?.qty}</p>
                  <p className="col-span-3 text-xs">{translate('label.myAccount.rfq.targetPrice')}: {item?.targetPrice}</p>
                  <p className="col-span-3 text-xs">{translate('label.myAccount.rfq.price')}: {item?.price}</p>
                </div>
                <div className="grid grid-cols-2 col-span-2 space-x-4">
                  <PencilIcon className="w-4 h-4 col-span-1 text-gray-600 cursor-pointer" onClick={() => openModal(item, 'edit')} />
                  <TrashIcon className="w-4 h-4 col-span-1 text-red-600 cursor-pointer" onClick={() => openModal(item, 'delete')} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-between mt-6 space-x-4">
          <button type="button" className="px-4 py-2 text-gray-700 bg-transparent border border-gray-600 rounded-md" onClick={() => router.back()} >
            {translate('label.myAccount.rfq.backToList')}
          </button>
          <button type="submit" className="px-4 py-2 text-white rounded-md btn btn-primary" >
            Submit Request
          </button>
        </div>
      </form>
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
                  <input
                    type="text"
                    value={newTargetPrice}
                    onChange={(e) => setNewTargetPrice(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex justify-end mt-6 space-x-4">
                  <button
                    type="button"
                    className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
                    onClick={handleSetSameAsPrice}
                  >
                    {translate('label.myAccount.rfq.setToListedPrice')}
                  </button>
                  <button
                    type="button"
                    className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    onClick={handleSaveTargetPrice}
                  >
                    {translate('label.myAccount.rfq.save')}
                  </button>
                  <button
                    type="button"
                    className="px-4 py-2 text-gray-800 bg-gray-300 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
                    onClick={closeModal}
                  >
                    {translate('label.myAccount.rfq.cancel')}
                  </button>
                </div>
              </>
            ) : (
              <>
                <p className="mb-4 text-gray-600">{translate('label.myAccount.rfq.removeProductConfirmation')}</p>
                <div className="flex justify-end space-x-4">
                  <div
                    className="flex items-center justify-center border border-gray-300 rounded-full shadow-sm btn"
                    onClick={() => setIsRemoveModalOpen(false)} // Close the modal without removing
                  >
                    {translate('label.myAccount.rfq.cancel')}
                  </div>
                  <div
                    className="flex items-center justify-center border border-gray-300 rounded-full shadow-sm btn btn-primary"
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

const restructureProductLines = (lines: any) => {
  const newLines = lines?.map((value: any) =>
    sanitizeProduct(value)
  );
  return newLines;
};

const sanitizeProduct = (product: any) => {
  const isIncludeVAT = vatIncluded();
  return {
    ProductId: product?.productId,
    productName: product?.name,
    stockCode: product?.stockCode,
    qty: product?.qty,
    price: isIncludeVAT ? product?.price?.raw?.withTax : product?.listPrice?.raw?.withoutTax,
    targetPrice: isIncludeVAT ? product?.price?.raw?.withTax : product?.listPrice?.raw?.withoutTax,
  };
};
