(function () {
    "use strict";

    jasmine.DEFAULT_TIMEOUT_INTERVAL = jasmine.getEnv().defaultTimeoutInterval = 20000;

    Template.stub('index');
    Template.stub('notFound');

    // Testing OO front end JS that does not modify UI elements
    describe("OO front end JS", function () {
	    
        it("Can be constructed without error", function () {
	        var shortly = new Shortly();
            expect(shortly).not.toBeNull();
        });
        it("Can validate URLs accurately", function () {
	        var shortly = new Shortly();
            expect(shortly.__isValidURL('http://google.com')).toBe(true);
            expect(shortly.__isValidURL('https://google.com')).toBe(true);
            expect(shortly.__isValidURL('http://goog')).toBe(false);
        });
    });
})();