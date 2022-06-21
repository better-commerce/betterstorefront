// Base Imports
import React, { FC } from "react";

// Package Imports
import { Formik, Form, ErrorMessage, Field } from "formik";

// Other Imports
import { VALUES_MAP } from ".";

interface ICSVFormProps {
    readonly onCSVSubmit: any;
    readonly addToBasketBtn: any;
    readonly type?: string;
}

export const CSVForm: FC<ICSVFormProps> = ({ onCSVSubmit, addToBasketBtn, type = "bulkAddViaCSV" }: ICSVFormProps) => {
    const { schema, initialValues } = VALUES_MAP[type];

    return (
        <Formik initialValues={initialValues} validationSchema={schema} onSubmit={onCSVSubmit} enableReinitialize={true}>
            {({ errors, values, touched, setValues }) => (
                <Form>
                    <label className="font-bold text-sm leading-light">Copy and paste your file in following format: STOCKCODE[comma]Quantity</label>
                    <Field name="data" component="textarea" rows={6} cols={12} placeholder="Copy and paste your file in following format: STOCKCODE[comma]Quantity" className="p-4 rounded-md bg-white border text-sm w-full border-gray-300" />
                    <ErrorMessage name="data" component="div" className=" text-red-500 text-xs mt-1 ml-1" />

                    {/*Add to cart button*/}
                    {addToBasketBtn}
                </Form>
            )}
        </Formik>
    )
};