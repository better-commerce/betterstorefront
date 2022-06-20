// Base Imports
import React, { FC } from "react";

// Package Imports
import { Formik, Form, Field, FieldArray, ErrorMessage } from "formik";

// Component Imports
import { AddToBasketButton } from "./AddToBasketButon";

// Other Imports
import { VALUES_MAP } from ".";
import { GENERAL_ADD_TO_BASKET } from "@components/utils/textVariables";

interface ICSVFormProps {
    readonly onCSVSubmit: any;
    readonly type?: string;
}

export const CSVForm: FC<ICSVFormProps> = ({ onCSVSubmit, type = "bulkAddViaCSV" }: ICSVFormProps) => {
    const { schema, initialValues } = VALUES_MAP[type];

    return (
        <Formik initialValues={initialValues} validationSchema={schema} onSubmit={onCSVSubmit} enableReinitialize={true}>
            {({ errors, values, touched, setValues }) => (
                <Form>
                    <label className="font-bold text-sm leading-light">Copy and paste your file in following format: STOCKCODE[comma]Quantity</label>
                    <textarea name="data" rows={6} cols={12} placeholder="Copy and paste your file in following format: STOCKCODE[comma]Quantity" className="p-4 rounded-md bg-white border text-sm w-full border-gray-300" />
                    <ErrorMessage name="data" component="div" className=" text-red-500 text-xs mt-1 ml-1" />

                    {/*Add to cart button*/}
                    <AddToBasketButton buttonText={GENERAL_ADD_TO_BASKET} />
                </Form>
            )}
        </Formik>
    )
};