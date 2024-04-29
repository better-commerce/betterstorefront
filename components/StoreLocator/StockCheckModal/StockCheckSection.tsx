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
}: any) => {
    const translate = useTranslation();
    const stockCheckSchema = useStockCheckSchema();

    const stockCheckFormik = useFormik({
        initialValues: {
            postCode: EmptyString,
        },
        validationSchema: stockCheckSchema,
        onSubmit: async (values: any, { setSubmitting }: any) => {
            onSubmit(values)
            setSubmitting(false)
        },
    })

    return (
        <div className='flex flex-col'>
            <h4 className='font-semibold text-lg'>Check Store Stock</h4>
            <hr className='h-1 my-4'></hr>
            <span className='font-extralight text-md'>Need your item today? Find your nearest store and pick up in selected stores</span>
            <form className='flex flex-row mx-4 my-10' onSubmit={stockCheckFormik.handleSubmit}>
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
                  disabled={stockCheckFormik.isSubmitting}
                  className='rounded bg-black text-white w-1/2 uppercase font-semibold hover:opacity-90'
                >
                  {stockCheckFormik.isSubmitting ? <LoadingDots /> : 'Find Stock'}
                </button>
            </form>
        </div>
    )
}

export default StockCheckSection