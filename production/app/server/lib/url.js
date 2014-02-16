Meteor.Libraries.URL = (function() {
	"use strict"
	var _this;
	
	function URL() {
		_this = this;
		_this.__setupMeteorMethods();
		_this.base62 = new Base62();
	};

	URL.prototype = {
		constructor : URL,
		getShortURLForInput : function(input) {
			if(!_this.__isShortenedAlready(input)) {
				// Last generated URL (or 'aaa')
				var lastURL = _this.__getLastURL();
				var shortURL = _this.base62.encode(Meteor.Models.URL.find({}).count());
				_this.__storeURL(input, shortURL);
			}
			// Return result
			return _this.__getShortURL(input);
		},
		getOriginalURLForInput : function(input) {
			// Return result
			return _this.__getOriginalURL(input); 
		},
		__setupMeteorMethods : function() {
			try {
				Meteor.methods({
					URL__get_short_url_for_input : function(input) { return _this.getShortURLForInput(input); }
				});
			}
			catch(e){}
		},
		__isShortenedAlready : function(URL) {
			return (Meteor.Models.URL.find({urlOriginal : URL}).count() === 1);
		},
		__getLastURL : function() {
			var lastURL = Meteor.Models.URL.find({}, {sort: {$natural:-1}, limit:1}).fetch();
			return (lastURL.length === 0)? null : lastURL[0].urlShortened;
		},
		__storeURL : function(URL, shortURL) {
			console.log("Insert: " + URL + " " + shortURL);
			Meteor.Models.URL.insert({urlOriginal : URL, urlShortened : shortURL, urlTimestamp : new Date().getTime()});
			return true;
		},
		__getOriginalURL : function(shortURL){
			var result = Meteor.Models.URL.findOne({urlShortened : shortURL});
			return (result == null)? null : result.urlOriginal
		},
		__getShortURL : function(URL){
			var result = Meteor.Models.URL.findOne({urlOriginal : URL});
			return (result == null)? null : result.urlShortened
		}
	};

	return URL;	
})();
