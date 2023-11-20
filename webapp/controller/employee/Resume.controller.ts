import { Route$MatchedEvent } from "sap/ui/core/routing/Route";
import BaseController from "../BaseController";
import { ALL_TABS, EmployeeParam, OneTab } from "./Employee.controller";
import JSONModel from "sap/ui/model/json/JSONModel";
import { IconTabBar$SelectEvent } from "sap/m/IconTabBar";



/**
 * @namespace zrouter001.controller
 */

type UI = {
    selectedTabKey: OneTab
}
export default class Resume extends BaseController {
    private ui: UI = {
        selectedTabKey: null
    }

    onInit() {
        const oRouter = this.getRouter();
        this.getView().setModel(new JSONModel(this.ui, true), "view");
        oRouter.getRoute("employeeResume").attachMatched(this._onRouteMatched.bind(this));
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

        const oQuery = oArgs["?query"];
        if (oQuery && ALL_TABS.indexOf(oQuery.tab) > -1) {
            this.ui.selectedTabKey = oQuery.tab;

            // support lazy loading for the hobbies and notes tab
            if (oQuery.tab === "Hobbies" || oQuery.tab === "Notes"){
                // the target is either "resumeTabHobbies" or "resumeTabNotes"
                void this.getRouter().getTargets().display("resumeTab" + oQuery.tab);
            }
        } else {
            // the default query param should be visible at all time
            this._navToTab(oArgs.employeeId, ALL_TABS[0])
        }
    }

    private _navToTab(employeeId: string, tab: OneTab) {
        const employeeParam: EmployeeParam = {
            employeeId: employeeId,
            "?query": {
                tab: tab
            }
        }
        this.getRouter().navTo("employeeResume", employeeParam, true /*without history*/);
    }

    public onTabSelect(oEvent: IconTabBar$SelectEvent) {
        const oCtx = this.getView().getBindingContext();

        this._navToTab(
            oCtx.getProperty("EmployeeID") as string,
            oEvent.getParameter("selectedKey") as OneTab);
    }

    private _onBindingChange() {
        // No data for the binding
        if (!this.getView().getBindingContext()) {
            void this.getRouter().getTargets().display("notFound");
        }
    }
}