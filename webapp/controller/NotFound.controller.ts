import BaseController from "./BaseController";
import Target from "sap/ui/core/routing/Target";

/**
 * @namespace zrouter001.controller
 */

export type FromTarget = {
    fromTarget: string
}

export default class NotFound extends BaseController {
    private _oData: FromTarget;

    onInit(): void {
        const oRouter = this.getRouter();
        const oTarget = oRouter.getTarget("notFound") as Target;
        oTarget.attachDisplay((oEvent) => {
            this._oData = oEvent.getParameter("data") as FromTarget;	// store the data
        });
    }


    // override the parent's onNavBack (inherited from BaseController)
    public onNavBack(): void {
        // in some cases we could display a certain target when the back button is pressed
        if (this._oData && this._oData.fromTarget) {
            void this.getRouter().getTargets().display(this._oData.fromTarget);
            delete this._oData.fromTarget;
            return;
        }

        // call the parent's onNavBack
        super.onNavBack()
    }

}
