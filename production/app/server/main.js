(function () {
    "use strict";

    Meteor.startup(function () {
	    console.log('startup');
    	var URL = new Meteor.Libraries.URL();
    });
})();