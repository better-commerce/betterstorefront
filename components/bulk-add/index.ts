// Package Imports
import * as Yup from "yup";

// Other Imports
import { BulkOrder } from "@components/utils/constants";

export interface IBulkAddData {
    readonly noOfFields: number;
    readonly orderPads: Array<{ stockCode: string, quantity: string }>;
}

const gridHeaderValues = [{
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

const gridInitialValues: IBulkAddData = {
    noOfFields: BulkOrder.DEFAULT_ENTRY_FIELD_COUNT,
    orderPads: [{ stockCode: "", quantity: "" },
    { stockCode: "", quantity: "" },
    { stockCode: "", quantity: "" },
    { stockCode: "", quantity: "" },
    { stockCode: "", quantity: "" },
    ], //Array.from(Array(BulkOrder.DEFAULT_ENTRY_FIELD_COUNT).map((x: any) => { return { stockCode: "", quantity: ""} })),
};

const gridValidationSchema = Yup.object().shape({
    noOfFields: Yup.number(),
    orderPads: Yup.array().of(
        Yup.object().shape({
            stockCode: Yup.string()
                .notRequired()
                /*.when(["stockCode", "quantity"], {
                    is: (stockCode: string, quantity: string) => !stockCode && quantity,
                    then: Yup.string().required("stockCode is required")
                })*/
                .test("code", "stockCode is invalid", (value) => {
                    if (value && value.trim().length) {
                        const regExp = new RegExp(BulkOrder.STOCK_CODE_REGEX);
                        return regExp.test(value.trim());
                    }
                    return true;
                }),

            quantity: Yup.string()
                .notRequired()
                .test("qty", "quantity should be a whole number", (value) => {
                    if (value && value.trim().length) {
                        const regExp = new RegExp(BulkOrder.QUANTITY_REGEX);
                        return regExp.test(value.trim());
                    }
                    return true;
                }),
        }/*, [["stockCode", "quantity"]]*/),
    ),
});

export const gridBulkAddConfig = [
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

const csvInitialValues = {
    data: "",
};

const csvValidationSchema = Yup.object().shape({
    data: Yup.string()
        .required("CSV data is required")
        .test("csvData", "data is not in valid format", (value) => {
            const lines = (value: string) => { 
                const parsedLines = value.split(/\r*\n/);
                return parsedLines.length;
            };
            if (value && value.trim().length) {
                const regExp = new RegExp(BulkOrder.CSV_DATA_REGEX);
                const matches = value.trim().match(regExp);
                if (!matches || matches && (matches.length === lines(value.trim()))) {
                    return false;
                }
            }
            return true;
        }),
});

export const VALUES_MAP: any = {
    bulkAddViaGrid: {
        headerValues: gridHeaderValues,
        schema: gridValidationSchema,
        initialValues: gridInitialValues,
        config: gridBulkAddConfig,
    },
    bulkAddViaCSV: {
        schema: csvValidationSchema,
        initialValues: csvInitialValues,
    }
};

export { default } from "./BulkAddSidebarView";