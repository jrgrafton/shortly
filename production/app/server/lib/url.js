Meteor.Libraries.URL = (function() {
	"use strict"

	var _this;
	
	function URL() {
		_this = this;
		_this.__setupMeteorMethods();
	};

	URL.prototype = {
		constructor : URL,
		getShortURLForInput : function(input) {
			if(!_this.__isShortenedAlready(input)) {
				// Last generated URL (or 'aaa')
				var lastURL = _this.__getLastURL();
				var shortURL = (lastURL === null)? 'aaaaa' : _this.__getNextURL(lastURL);
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

		__getNextURL : function(shortURL) {
			// Available chars for tiny URL
			var availableChars = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'X', 'Y', 'Z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
			var lastAvailableChar = availableChars[availableChars.length - 1];

			// Starting from end character rotate one and propgate change left
			for(var i = (shortURL.length - 1); i >= 0; i--) {
				var character = shortURL[i];
				var availableCharsIndex = availableChars.indexOf(character);

				// If character does not wrap just increase and return result
				if(++availableCharsIndex < (availableChars.length - 1)) {
					var sArray = shortURL.split("");
					sArray[i] = availableChars[availableCharsIndex];
					return sArray.join("");
				}
			}
			throw new Error("No more short URLs available");
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
