import Home from "zrouter001/controller/Home.controller";

QUnit.module("Sample Home controller test");

QUnit.test("The Home controller class has a sayHello method", function (assert) {
	// as a very basic test example just check the presence of the "sayHello" method
	assert.strictEqual(typeof Home.prototype.sayHello, "function");
});
