// import Log from "sap/base/Log";
import MockServer from "sap/ui/core/util/MockServer";
import JSONModel from "sap/ui/model/json/JSONModel";


type EmployeeRemote = {
	uri: string,
	settings: {
		localUri: string
	}
}

export default class mockserver {
	public init(): Promise<void> {
		const _sAppPath = "zrouter001/",
			_sJsonFilesPath = _sAppPath + "localService/mockdata";

		return new Promise<void>(function (fnResolve, fnReject) {
			const sManifestUrl = sap.ui.require.toUrl(_sAppPath + "manifest.json"),
				oManifestModel = new JSONModel(sManifestUrl);

			oManifestModel.attachRequestCompleted(function () {

				const sJsonFilesUrl = sap.ui.require.toUrl(_sJsonFilesPath),
					oMainDataSource = oManifestModel.getProperty("/sap.app/dataSources/employeeRemote") as EmployeeRemote,
					sMetadataUrl = sap.ui.require.toUrl(_sAppPath + oMainDataSource.settings.localUri);

				// create
				const oMockServer = new MockServer({
					rootUri: oMainDataSource.uri
				});

				// configure
				MockServer.config({
					autoRespond: true,
					autoRespondAfter: 500
				});

				// simulate
				oMockServer.simulate(sMetadataUrl, {
					sMockdataBaseUrl: sJsonFilesUrl
				});

				// start
				oMockServer.start();

				// Log.info("Running the app with mock data");
				console.info("Running the app with mock data")
				fnResolve();
			});

			oManifestModel.attachRequestFailed(function () {
				const sError = "Failed to load application manifest";

				//Log.error(sError);
				console.error(sError);
				fnReject(new Error(sError));
			});
		});
	}
}