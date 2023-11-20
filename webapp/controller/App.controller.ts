import Log from "sap/base/Log";
import BaseController from "./BaseController";

/**
 * @namespace zrouter001.controller
 */
export default class App extends BaseController {
	public onInit(): void {
		// apply content density mode to root view
		this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());

		// This is ONLY for being used within the tutorial.
		// The default log level of the current running environment may be higher than INFO,
		// in order to see the debug info in the console, the log level needs to be explicitly
		// set to INFO here.
		// But for application development, the log level doesn't need to be set again in the code.
		Log.setLevel(Log.Level.INFO);

		const oRouter = this.getRouter();

		oRouter.attachBypassed(function (oEvent) {
			const sHash = oEvent.getParameter("hash");
			// do something here, i.e. send logging data to the backend for analysis
			// telling what resource the user tried to access...
			Log.info("Sorry, but the hash '" + sHash + "' is invalid.", "The resource was not found.");
		});

		oRouter.attachRouteMatched(function (oEvent){
			const sRouteName = oEvent.getParameter("name");
			// do something, i.e. send usage statistics to back end
			// in order to improve our app and the user experience (Build-Measure-Learn cycle)
			Log.info("User accessed route " + sRouteName + ", timestamp = " + Date.now());
		});
	}
}
