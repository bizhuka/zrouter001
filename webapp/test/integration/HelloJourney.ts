/* eslint-disable @typescript-eslint/no-floating-promises */
import opaTest from "sap/ui/test/opaQunit";
import HomePage from "./pages/HomePage";

const onTheHomePage = new HomePage();

QUnit.module("Sample Hello Journey");

opaTest("Should open the Hello dialog", function () {
	// Arrangements
	onTheHomePage.iStartMyUIComponent({
		componentConfig: {
			name: "zrouter001"
		}
	});

	// Actions
	onTheHomePage.iPressTheSayHelloWithDialogButton();

	// Assertions
	onTheHomePage.iShouldSeeTheHelloDialog();

	// Actions
	onTheHomePage.iPressTheOkButtonInTheDialog();

	// Assertions
	onTheHomePage.iShouldNotSeeTheHelloDialog();

	// Cleanup
	onTheHomePage.iTeardownMyApp();
});

opaTest("Should close the Hello dialog", function () {
	// Arrangements
	onTheHomePage.iStartMyUIComponent({
		componentConfig: {
			name: "zrouter001"
		}
	});

	// Actions
	onTheHomePage.iPressTheSayHelloWithDialogButton();
	onTheHomePage.iPressTheOkButtonInTheDialog();

	// Assertions
	onTheHomePage.iShouldNotSeeTheHelloDialog();

	// Cleanup
	onTheHomePage.iTeardownMyApp();
});
