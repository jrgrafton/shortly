(function () {
    "use strict";

    jasmine.DEFAULT_TIMEOUT_INTERVAL = jasmine.getEnv().defaultTimeoutInterval = 600000;

    // Testing OO front end JS that does not modify UI elements
    describe("Server URL library", function () {
	    
        it("Can be constructed without error", function () {
	        var url = new Meteor.Libraries.URL();
            expect(url).not.toBeNull();
        });

        it("Can get next URL for input", function () {
	      	var url = new Meteor.Libraries.URL();
            expect(url.__getNextURL('aaaaa')).toBe('aaaab');
            expect(url.__getNextURL('aaaa9')).toBe('aaab9');
            expect(url.__getNextURL('a9999')).toBe('b9999');
            expect( function(){ url.__getNextURL('99999'); } ).toThrow(new Error("No more short URLs available"));
        });

        // @TODO: How to test functionality that interfaces with Meteor Collections?
        /* it("Can store and get original URL", function () {
	        Url.remove({});
	        var url = new Meteor.Libraries.URL();
	        expect(url.__storeURL('http://google.com', 'aaaaa')).toBe(true);
	        
	        var storedURL = url.__getOriginalURL('http://google.com');
	        expect(storedURL.urlOriginal).toBe('http://google.com');
	        expect(storedURL.urlShortened).toBe('aaaaa');
	    });

        it("Get last URL returns expected result", function () {
	        Meteor.Models.URL.remove({});
	        var url = new Meteor.Libraries.URL();
	        expect(url.__storeURL('http://google.com', 'aaaaa')).toBe(true);
	        expect(url.__storeURL('http://hotmail.com', 'aaaab')).toBe(true);
	        expect(url.__storeURL('http://mymail.com', 'aaaac')).toBe(true);

	        var lastURL = url.__getLastURL();
	        expect(lastURL.urlOriginal).toBe('http://mymail.com');
	        expect(lastURL.urlShortened).toBe('aaaac');
	    }); 

	    it("Detects when a URL has already been stored", function () {
	    	var url = new Meteor.Libraries.URL();
	        expect(url.__storeURL('http://google.com', 'aaaaa')).toBe(true);
	        expect(url.__isShortenedAlready('http://google.com')).toBe(true);
	    });

	    it("Can shorten URLS", function() {
	    	var url = new Meteor.Libraries.URL();
	        expect(url.getURLForInput('http://google.com')).toBe('aaaaa');	    	
	    });
*/
    });
})();