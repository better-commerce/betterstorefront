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
            <div className='flex flex-col p-4 border-b border-gray-200 dark:text-black'>
                <h4 className="font-semibold">{translate('label.store.checkStoreStockText')}</h4>
            </div>

            <span className='px-4 pt-4 font-medium text-md dark:text-black'>{translate('label.store.stockCheckDescText')}</span>
            <form className='flex flex-row mx-4 mt-4 mb-10 gap-x-4' onSubmit={stockCheckFormik.handleSubmit}>
                <input
                    name="postCode"
                    type="text"
                    value={stockCheckFormik.values.postCode}
                    onChange={stockCheckFormik.handleChange}
                    placeholder={translate('common.label.enterYourPostCodePlaceholder')}
                    className='w-1/2 border border-gray-300 rounded placeholder:text-gray-300 placeholder:font-light'
                />
                <button
                    type="submit"
                    disabled={isLoading}
                    className={`${isLoading && 'cursor-not-allowed'} rounded bg-black text-white w-1/2 uppercase font-semibold hover:opacity-80`}
                >
                    {isLoading ? <LoadingDots /> : translate('label.store.findStockText')}
                </button>
            </form>
        </div>
    )
}

export default StockCheckSection