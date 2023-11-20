import { Route$MatchedEvent } from "sap/ui/core/routing/Route";
import BaseController from "../BaseController";



/**
 * @namespace zrouter001.controller
 */

export const ALL_TABS = ["Info", "Projects", "Hobbies", "Notes"] as const;
export type OneTab = typeof ALL_TABS[number]

export type EmployeeParam = {
    employeeId: string;
    "?query"?: {
        tab: OneTab
    }
}
export default class Employee extends BaseController {

    onInit(): void {
        const oRouter = this.getRouter();
        oRouter.getRoute("employee").attachMatched(this._onRouteMatched.bind(this));
        // Hint: we don't want to do it this way
        /*
        oRouter.attachRouteMatched(function (oEvent){
            var sRouteName, oArgs, oView;
            sRouteName = oEvent.getParameter("name");
            if (sRouteName === "employee"){
                this._onRouteMatched(oEvent);
            }
        }, this);
        */
    }

    private _onRouteMatched(oEvent: Route$MatchedEvent) {
        const oArgs = oEvent.getParameter("arguments") as EmployeeParam;
        const oView = this.getView();

        oView.bindElement({
            path: "/Employees(" + oArgs.employeeId + ")",
            events: {
                change: this._onBindingChange.bind(this),
                dataRequested() {
                    oView.setBusy(true);
                },
                dataReceived() {
                    oView.setBusy(false);
                }
            }
        });
    }

    private _onBindingChange(): void {
        // No data for the binding
        if (!this.getView().getBindingContext()) {
            void this.getRouter().getTargets().display("notFound");
        }
    }

    public onShowResume() {
        const oCtx = this.getView().getElementBinding().getBoundContext();

        this.getRouter().navTo("employeeResume", {
            employeeId: oCtx.getProperty("EmployeeID") as string
        } as EmployeeParam);
    }
}