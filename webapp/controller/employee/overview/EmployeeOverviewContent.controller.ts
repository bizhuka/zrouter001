import BaseController from "zrouter001/controller/BaseController";

import Table from "sap/m/Table";
import ViewSettingsDialog, { ViewSettingsDialog$ConfirmEvent } from "sap/m/ViewSettingsDialog";
import SearchField, { SearchField$SearchEvent } from "sap/m/SearchField";
import ViewSettingsItem from "sap/m/ViewSettingsItem";
import Filter from "sap/ui/model/Filter";
import FilterOperator from "sap/ui/model/FilterOperator";
import Sorter from "sap/ui/model/Sorter";
import ListBinding from "sap/ui/model/ListBinding";
import { Route$MatchedEvent } from "sap/ui/core/routing/Route";
import { ListBase$ItemPressEvent } from "sap/m/ListBase";
import { EmployeeParam } from "../Employee.controller";


/**
 * @namespace zrouter001.controller
*/

type Urlparams = {
    search: string
    sortField: string
    sortDescending: boolean
    showDialog: boolean
}
type RouterArgs = {
    "?query"?: Urlparams
}

export default class EmployeeOverviewContent extends BaseController {
    private _oTable: Table;
    private _oVSD: ViewSettingsDialog;

    private _sSortField: string;
    private _bSortDescending: boolean;
    private _aValidSortFields: string[];
    private _sSearchQuery: string;

    private _oRouterArgs: RouterArgs

    public onInit() {
        this._oTable = this.byId("employeesTable") as Table;
        this._oVSD = null;
        this._sSortField = null;
        this._bSortDescending = false;
        this._aValidSortFields = ["EmployeeID", "FirstName", "LastName"];
        this._sSearchQuery = null;
        this._oRouterArgs = {
            "?query": this._getEmptyUrlParams()
        };

        this._initViewSettingsDialog();

        const oRouter = this.getRouter();
        // make the search bookmarkable
        oRouter.getRoute("employeeOverview").attachMatched(this._onRouteMatched.bind(this));
    }

    private _getEmptyUrlParams(): Urlparams {
        return {
            search: '',
            sortField: '',
            sortDescending: false,
            showDialog: false
        }
    }

    _onRouteMatched(oEvent: Route$MatchedEvent) {
        // save the current query state
        this._oRouterArgs = oEvent.getParameter("arguments");
        this._oRouterArgs["?query"] = this._oRouterArgs["?query"] || this._getEmptyUrlParams();
        const oQueryParameter = this._oRouterArgs["?query"];

        // search/filter via URL hash
        this._applySearchFilter(oQueryParameter.search);

        // sorting via URL hash
        this._applySorter(oQueryParameter.sortField, oQueryParameter.sortDescending);

        // show dialog via URL hash
        if (oQueryParameter.showDialog) {
            this._oVSD.open();
        }
    }

    public onSortButtonPressed() {
        //this._oVSD.open();
        this._oRouterArgs["?query"].showDialog = true;
        this.navTo("employeeOverview", this._oRouterArgs);
    }

    public onSearchEmployeesTable(oEvent: SearchField$SearchEvent) {
        //this._applySearchFilter(oEvent.getSource().getValue());

        // update the hash with the current search term
        this._oRouterArgs["?query"].search = oEvent.getSource().getValue();
        this.navTo("employeeOverview", this._oRouterArgs, true /*no history*/);
    }

    public onItemPressed (oEvent: ListBase$ItemPressEvent) {
        const oItem = oEvent.getParameter("listItem");
        const oCtx = oItem.getBindingContext();
        this.navTo("employeeResume",{
            employeeId : oCtx.getProperty("EmployeeID") as string,
            "?query": {
                tab: "Info"
            }
        } as EmployeeParam);
    }

    private _initViewSettingsDialog() {
        this._oVSD = new ViewSettingsDialog("vsd", {
            confirm: (oEvent: ViewSettingsDialog$ConfirmEvent) => {
                const oSortItem = oEvent.getParameter("sortItem");

                //this._applySorter(oSortItem.getKey(), oEvent.getParameter("sortDescending"));
                this._oRouterArgs["?query"].sortField = oSortItem.getKey();
                this._oRouterArgs["?query"].sortDescending = oEvent.getParameter("sortDescending");
                delete this._oRouterArgs["?query"].showDialog;

                this.navTo("employeeOverview", this._oRouterArgs, true /*without history*/);
            },

            cancel: () => {
                delete this._oRouterArgs["?query"].showDialog;
                this.navTo("employeeOverview", this._oRouterArgs, true /*without history*/);
            }
        });

        // init sorting (with simple sorters as custom data for all fields)
        this._oVSD.addSortItem(new ViewSettingsItem({
            key: "EmployeeID",
            text: "Employee ID",
            selected: true			// by default the MockData is sorted by EmployeeID
        }));

        this._oVSD.addSortItem(new ViewSettingsItem({
            key: "FirstName",
            text: "First Name",
            selected: false
        }));

        this._oVSD.addSortItem(new ViewSettingsItem({
            key: "LastName",
            text: "Last Name",
            selected: false
        }));
    }

    private _applySearchFilter(sSearchQuery: string) {
        // first check if we already have this search value
        if (this._sSearchQuery === sSearchQuery) {
            return;
        }
        this._sSearchQuery = sSearchQuery;
        (this.byId("searchField") as SearchField).setValue(sSearchQuery);

        // add filters for search
        let oFilter: Filter
        if (sSearchQuery && sSearchQuery.length > 0) {
            const aFilters = [];
            aFilters.push(new Filter("FirstName", FilterOperator.Contains, sSearchQuery));
            aFilters.push(new Filter("LastName", FilterOperator.Contains, sSearchQuery));
            oFilter = new Filter({ filters: aFilters, and: false });  // OR filter
        } else {
            oFilter = null;
        }

        // update list binding
        const oBinding = this._oTable.getBinding("items") as ListBinding;
        oBinding.filter(oFilter, "Application");
    }

    /**
     * Applies sorting on our table control.
     * @param sSortField		the name of the field used for sorting
     * @param sortDescending	true or false as a string or boolean value to specify a descending sorting
     * @private
     */
    private _applySorter(sSortField: string, sortDescending: boolean | string) {
        // only continue if we have a valid sort field
        if (sSortField && this._aValidSortFields.indexOf(sSortField) > -1) {

            // convert  the sort order to a boolean value
            let bSortDescending: boolean
            if (typeof sortDescending === "string") {
                bSortDescending = sortDescending === "true";
            } else if (typeof sortDescending === "boolean") {
                bSortDescending = sortDescending;
            } else {
                bSortDescending = false;
            }

            // sort only if the sorter has changed
            if (this._sSortField && this._sSortField === sSortField && this._bSortDescending === bSortDescending) {
                return;
            }

            this._sSortField = sSortField;
            this._bSortDescending = bSortDescending;
            const oSorter = new Sorter(sSortField, bSortDescending);

            // sync with View Settings Dialog
            this._syncViewSettingsDialogSorter(sSortField, bSortDescending);

            const oBinding = this._oTable.getBinding("items") as ListBinding;
            oBinding.sort(oSorter);
        }
    }

    private _syncViewSettingsDialogSorter(sSortField: string, bSortDescending: boolean) {
        // the possible keys are: "EmployeeID" | "FirstName" | "LastName"
        // Note: no input validation is implemented here
        this._oVSD.setSelectedSortItem(sSortField);
        this._oVSD.setSortDescending(bSortDescending);
    }
}