
import { ListItemBase$PressEvent } from "sap/m/ListItemBase";
import BaseController from "../BaseController";
import { EmployeeParam } from "./Employee.controller";

/**
 * @namespace zrouter001.controller
 */
export default class EmployeeList extends BaseController {

    public onListItemPressed(oEvent: ListItemBase$PressEvent){
        const oItem = oEvent.getSource();
        const oCtx = oItem.getBindingContext();
        this.getRouter().navTo("employee", {
            employeeId : oCtx.getProperty("EmployeeID") as string
        } as EmployeeParam);
    }
}



