import BaseController from "./BaseController";
import { FromTarget } from "./NotFound.controller";

/**
 * @namespace zrouter001.controller
 */
export default class Home extends BaseController {

	public onDisplayNotFound(): void {
		//display the "notFound" target without changing the hash
		void this.getRouter().getTargets().display("notFound", {
			fromTarget: "home"
		} as FromTarget);
	}

	public onNavToEmployees(): void {
		this.getRouter().navTo("employeeList");
	}


	public onNavToEmployeeOverview() {
		this.getRouter().navTo("employeeOverview");
	}
}
