import MessageBox from "sap/m/MessageBox";
import mockserver from "zrouter001/localService/mockserver";

export default class InitMock {
	static {
		// initialize the mock server
		try {
			void new mockserver().init();
		} catch (oError: Error) {
			MessageBox.error(oError.message);
		}

		// initialize the embedded component on the HTML page
		sap.ui.require(["sap/ui/core/ComponentSupport"]);
	}
}
