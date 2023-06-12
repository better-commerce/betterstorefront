import { DataSubmit, ISubmitStateInterface } from "@commerce/utils/use-data-submit";

export const resetSubmitData = (dispatch: any) => {
    if (dispatch) {
        dispatch({ type: DataSubmit.RESET_SUBMITTING });
    }
}