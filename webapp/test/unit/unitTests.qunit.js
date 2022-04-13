/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"grcriskassess2/grcriskassess2/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});