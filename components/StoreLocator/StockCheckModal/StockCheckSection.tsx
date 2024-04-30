// Base Imports
import React from 'react'

// Package Imports
import { useFormik } from 'formik'

// Other Imports
import { useStockCheckSchema } from './config';
import { EmptyString } from '@components/utils/constants';
import { useTranslation } from '@commerce/utils/use-translation';
import { LoadingDots } from '@components/ui';

const StockCheckSection = ({
    onSubmit,
    isLoading
}: any) => {
    const translate = useTranslation();
    const stockCheckSchema = useStockCheckSchema();

    const stockCheckFormik = useFormik({
        initialValues: {
            postCode: EmptyString,
        },
        validationSchema: stockCheckSchema,
        onSubmit: async (values: any) => {
            onSubmit(values)
        },
    })

    return (
        <div className='flex flex-col'>
            <h4 className='font-semibold text-lg'>{translate('label.store.checkStoreStockText')}</h4>
            <hr className='h-1 my-4'></hr>
            <span className='font-extralight text-md'>{translate('label.store.stockCheckDescText')}</span>
            <form className='flex flex-row mx-4 my-10 gap-x-4' onSubmit={stockCheckFormik.handleSubmit}>
                <input
                    name="postCode"
                    type="text"
                    value={stockCheckFormik.values.postCode}
                    onChange={stockCheckFormik.handleChange}
                    placeholder={translate('common.label.enterYourPostCodePlaceholder')}
                    className='w-1/2 rounded border border-gray-300 placeholder:text-gray-300 placeholder:font-light'
                />
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`${isLoading && 'cursor-not-allowed'} rounded bg-black text-white w-1/2 uppercase font-semibold hover:opacity-80`}
                >
                  { isLoading ? <LoadingDots /> : translate('label.store.findStockText')}
                </button>
            </form>
        </div>
    )
}

export default StockCheckSection