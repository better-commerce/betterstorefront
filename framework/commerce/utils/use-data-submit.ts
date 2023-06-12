// Base Imports
import React, { useReducer } from "react";

// Other Imports
export interface actionInterface {
    type?: string
    payload?: any
}

export interface ISubmitStateInterface {
    readonly isSubmitting: boolean;
    readonly submitSource: number;
    readonly error: any;
    readonly id?: string;
}

export module DataSubmit {
    export const SET_SUBMITTING = "SET_SUBMITTING";
    export const SET_SUBMITTING_OPTIONAL_ID = "SET_SUBMITTING_OPTIONAL_ID";
    export const RESET_SUBMITTING = "RESET_SUBMITTING";
    export const ERROR = "ERROR";
    export const RESET_ERROR = "RESET_ERROR";
}

const useDataSubmit = () => {

    const INITIAL_STATE: ISubmitStateInterface = {
        isSubmitting: false,
        submitSource: -1,
        error: "",
        id: "",
    };

    function reducer(state: ISubmitStateInterface, { type, payload }: actionInterface) {
        switch (type) {
            case DataSubmit.SET_SUBMITTING: {
                return {
                    ...state,
                    isSubmitting: true,
                    submitSource: payload,
                }
            }
            case DataSubmit.SET_SUBMITTING_OPTIONAL_ID: {
                return {
                    ...state,
                    isSubmitting: true,
                    submitSource: payload?.type,
                    id: payload?.id,
                }
            }
            case DataSubmit.RESET_SUBMITTING: {
                return {
                    ...state,
                    isSubmitting: false,
                    submitSource: "",
                    error: "",
                }
            }
            case DataSubmit.ERROR: {
                return {
                    ...state,
                    error: payload,
                }
            }
            case DataSubmit.RESET_ERROR: {
                return {
                    ...state,
                    error: "",
                }
            }
            default: {
                return state
            }
        }
    }

    const [state, dispatch] = useReducer(reducer, INITIAL_STATE);
    return { state: state, dispatch: dispatch };
};

export default useDataSubmit;