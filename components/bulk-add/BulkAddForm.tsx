// Base Imports
import React, { FC } from "react";

// Package Imports
import { Formik, Form, Field, FieldArray, ErrorMessage, FormikTouched } from "formik";

// Other Imports
import { VALUES_MAP } from ".";
import { GENERAL_SHOW_MORE_ENTRY_FIELDS } from "@components/utils/textVariables";

interface IBulkAddFormProps {
    readonly entryFieldCount: number;
    readonly submit: any;
}

export const BulkAddForm: FC<IBulkAddFormProps> = (props: IBulkAddFormProps) => {
    const { entryFieldCount, submit } = props;
    const { schema, initialValues, config } = VALUES_MAP;

    function onAddMoreOrderPads(e: any, field: any, values: any, setValues: any) {
        debugger;
        // update dynamic form
        const orderPads = [...values.orderPads];
        const noOfFields = (e.target.value || field.value) + 5;
        const previousNumber = parseInt(field.value || '0');
        if (previousNumber < noOfFields) {
            for (let i = previousNumber; i < noOfFields; i++) {
                orderPads.push({ stockCode: '', quantity: '' });
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

    function onSubmit(fields: any) {
        // display form field values on success
        alert('SUCCESS!! :-)\n\n' + JSON.stringify(fields, null, 4));
    }

    return (
        <Formik initialValues={initialValues} validationSchema={schema} onSubmit={onSubmit} enableReinitialize={true}>
            {({ errors, values, touched, setValues }) => (
                <Form>
                    <Field name="noOfFields">
                        {({ field }) => (

                            <>
                                {/*<select {...field} className={'form-control' + (errors.noOfFields && touched.noOfFields ? ' is-invalid' : '')} onChange={e => onAddMoreOrderPads(e, field, values, setValues)}>
                                    <option value=""></option>
                                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(i =>
                                        <option key={i} value={i}>{i}</option>
                                    )}
                                </select>*/}
                                <button className="flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 " onClick={e => onAddMoreOrderPads(e, field, values, setValues)}>
                                    {GENERAL_SHOW_MORE_ENTRY_FIELDS}
                                </button>
                            </>

                        )}
                    </Field>
                    <ErrorMessage name="noOfFields" component="div" className="invalid-feedback" />
                    <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                        <table className="min-w-full divide-y divide-gray-300">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                                        S.No
                                    </th>
                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                        StockCode
                                    </th>
                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                        Quantity
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white">
                                <FieldArray name="orderPads">
                                    {() => (values.orderPads.map((orderPad: any, i: number) => {
                                        const orderPadErrors: any = errors.orderPads?.length && errors.orderPads[i] || {};
                                        const orderPadTouched: any = touched.orderPads?.length && touched.orderPads[i] || {};
                                        return (
                                            <>
                                                <tr key={i}>
                                                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                                        {i + 1}
                                                    </td>
                                                    {
                                                        config?.map((x: any) => (
                                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                                <Field name={`orderPads.${i}.${x.key}`} type="text" className={x.className + (orderPadErrors.name && orderPadTouched.name ? ' is-invalid' : '')} />
                                                                <ErrorMessage name={`orderPads.${i}.${x.key}`} component="div" className="invalid-feedback" />
                                                            </td>
                                                        ))
                                                    }
                                                </tr>
                                            </>
                                        );
                                    }))}
                                </FieldArray>
                            </tbody>
                        </table>
                    </div>
                </Form>
            )}
        </Formik>
    );
};