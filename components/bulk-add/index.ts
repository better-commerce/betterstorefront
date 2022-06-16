// Package Imports
import * as Yup from "yup";

// Other Imports
import { DEFAULT_ENTRY_FIELD_COUNT } from "@components/utils/constants";

const initialValues = {
    noOfFields: DEFAULT_ENTRY_FIELD_COUNT,
    orderPads: [{ stockCode: "", quantity: "" },
                { stockCode: "", quantity: "" },
                { stockCode: "", quantity: "" },
                { stockCode: "", quantity: "" },
                { stockCode: "", quantity: "" },
                ], //Array.from(Array(DEFAULT_ENTRY_FIELD_COUNT).map((x: any) => { return { stockCode: "", quantity: ""} })),
};

const validationSchema = Yup.object().shape({
    noOfFields: Yup.number(),
    orderPads: Yup.array().of(
        Yup.object().shape({
            stockCode: Yup.string()
                .required('Stock Code is required'),
            quantity: Yup.number()
                .min(1)
                .required('Quantity is required'),
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
    schema: validationSchema,
    initialValues: initialValues,
    config: bulkAddConfig,
};

export { default } from "./BulkAddSidebarView";