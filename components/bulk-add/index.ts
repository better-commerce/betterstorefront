// Package Imports
import * as Yup from "yup";

// Other Imports
import { DEFAULT_ENTRY_FIELD_COUNT } from "@components/utils/constants";

const headerValues = [{
                        text: "S.No",
                        className: "py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                    }, {
                        text: "Stock Code",
                        className: "px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    }, {
                        text: "Quantity",
                        className: "px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    },
];

const initialValues = {
    noOfFields: DEFAULT_ENTRY_FIELD_COUNT,
    orderPads: [{ stockCode: "", quantity: "" },
                { stockCode: "", quantity: "" },
                { stockCode: "", quantity: "" },
                { stockCode: "", quantity: "" },
                { stockCode: "", quantity: "" },], //Array.from(Array(DEFAULT_ENTRY_FIELD_COUNT).map((x: any) => { return { stockCode: "", quantity: ""} })),
};

const validationSchema = Yup.object().shape({
    noOfFields: Yup.number(),
    orderPads: Yup.array().of(
        Yup.object().shape({
            stockCode: Yup.string()
                .when("code", {
                    is: (value: string) => value && value.trim().length > 0,
                    then: Yup.string().required('Stockcode is required'),
                }),
            quantity: Yup.number().min(1)
                .when("qty", {
                    is: (value: number) => value && value > 0,
                    then: Yup.number().min(1).required('quantity is required'),
                }),
        })
    )
});

export const bulkAddConfig = [
    {
        key: "stockCode",
        label: "Stock Code",
        type: "text",
        placeholder: "",
        className: "p-3 border bg-white text-gray-500 w-full",
    },
    {
        key: "quantity",
        label: "Quantity",
        type: "text",
        placeholder: "",
        className: "p-3 border bg-white text-gray-500 w-full",
    },
];

export const VALUES_MAP: any = {
    headerValues: headerValues,
    schema: validationSchema,
    initialValues: initialValues,
    config: bulkAddConfig,
};

export { default } from "./BulkAddSidebarView";