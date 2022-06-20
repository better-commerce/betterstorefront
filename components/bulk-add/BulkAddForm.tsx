// Base Imports
import React, { FC } from "react";

// Package Imports
import { Formik, Form, Field, FieldArray, ErrorMessage } from "formik";

// Other Imports
import { VALUES_MAP } from ".";
import { GENERAL_ADD_TO_BASKET, GENERAL_COPY_AND_PASTE, GENERAL_SHOW_MORE_ENTRY_FIELDS } from "@components/utils/textVariables";
import { BulkOrder } from "@components/utils/constants";
import { AddToBasketButton } from "./AddToBasketButon";

interface IBulkAddFormProps {
    readonly onGridSubmit: any;
    readonly type?: string;
}

export const BulkAddForm: FC<IBulkAddFormProps> = ({ onGridSubmit, type = "bulkAddViaGrid" }: IBulkAddFormProps) => {
    const { headerValues, schema, initialValues, config } = VALUES_MAP[type];

    const onAddMoreOrderPads = (e: any, field: any, values: any, setValues: any) => {
        // update dynamic form
        const orderPads = [...values.orderPads];
        const noOfFields = (e.target.value || field.value) + BulkOrder.DEFAULT_ENTRY_FIELD_COUNT;
        const previousNumber = parseInt(field.value || '0');
        if (previousNumber < noOfFields) {
            for (let i = previousNumber; i < noOfFields; i++) {
                orderPads.push({ stockCode: "", quantity: "" });
            }
        } else {
            for (let i = previousNumber; i >= noOfFields; i--) {
                orderPads.splice(i, 1);
            }
        }
        setValues({ ...values, orderPads });

        // call formik onChange method
        field.onChange(e);
    }

    return (
        <Formik initialValues={initialValues} validationSchema={schema} onSubmit={onGridSubmit} enableReinitialize={true}>
            {({ errors, values, touched, setValues }) => (
                <Form>
                    <Field name="noOfFields">
                        {(fieldProps: any) => (
                            <>
                                <div className="grid grid-cols-2 gap-x-2 mt-4">
                                    <div>
                                        <button className="flex justify-center w-full text-sm items-center py-2 border border-gray-800 rounded-sm shadow-sm font-medium text-white hover:text-white bg-gray-400 hover:bg-gray-900 " onClick={e => onAddMoreOrderPads(e, fieldProps.field, values, setValues)}>
                                            {GENERAL_SHOW_MORE_ENTRY_FIELDS}
                                        </button>
                                    </div>

                                </div>
                            </>
                        )}
                    </Field>

                    <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-sm mt-4">
                        <table className="min-w-full divide-y divide-gray-300">
                            <thead className="bg-gray-100">
                                <tr key={"header"}>
                                    {
                                        headerValues.map((x: any, idx: number) => (
                                            <th key={`th-${idx}`} scope="col" className={x.className}>
                                                {x.text}
                                            </th>
                                        ))
                                    }
                                </tr>
                            </thead>
                            <tbody className="bg-white">
                                <FieldArray name="orderPads">
                                    {() => (values.orderPads.map((orderPad: any, i: number) => {
                                        const errorOrderPads: any = errors.orderPads;
                                        const orderPadErrors: any = errorOrderPads?.length && errorOrderPads[i] || {};
                                        const touchedOrderPads: any = touched.orderPads;
                                        const orderPadTouched: any = touchedOrderPads?.length && touchedOrderPads[i] || {};
                                        return (
                                            <tr key={i}>
                                                <td key={i} className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                                    {i + 1}
                                                </td>
                                                {
                                                    config?.map((x: any, idx: number) => (
                                                        <td key={`inner-${idx}`} className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                            <Field key={`field_${i}_${x.key}`} name={`orderPads.${i}.${x.key}`} type="text" className={x.className + (orderPadErrors[x.key] && orderPadTouched[x.key] ? '  border rounded placeholder-gray-400 focus:border-indigo-400 focus:outline-none py-2 pr-2 pl-12 border-red-500 border-red-500' : '')} />
                                                            <ErrorMessage key={`err_${i}_${x.key}`} name={`orderPads.${i}.${x.key}`} component="div" className=" text-red-500 text-xs mt-1 ml-1" />
                                                        </td>
                                                    ))
                                                }
                                            </tr>
                                        );
                                    }))}
                                </FieldArray>
                            </tbody>
                        </table>
                    </div>

                    {/*Add to cart button*/}
                    <AddToBasketButton buttonText={GENERAL_ADD_TO_BASKET} />
                </Form>
            )}
        </Formik>
    );
};