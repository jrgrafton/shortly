Shortly = (function() {
	// Private vars
	var _this;
	
	// Constructor
	function Shortly() {
		_this = this;
		_this.__initObservers();
		_this.__initGA();
	}

	// Prototype
	Shortly.prototype = {
		constructor : Shortly,
		__initObservers : function() {
			$('form.shorten-url').on('submit', function() {
				_this.__processURL($('#input-url').val());
				return false;
			});

			$('#input-url').on('change', function() {
				if(_this.__isValidURL($(this).val())) {
					_this.__deactivateInvalidState();
				} else {
					_this.__activateInvalidState();
				}
			});
		},

		__initGA : function() {
			var production_url = /^shortly.site$/
			if (production_url.test(window.location.hostname)) {
				(function(b,o,i,l,e,r){b.GoogleAnalyticsObject=l;b[l]||(b[l]=
		        function(){(b[l].q=b[l].q||[]).push(arguments)});b[l].l=+new Date;
		        e=o.createElement(i);r=o.getElementsByTagName(i)[0];
		        e.src='//www.google-analytics.com/analytics.js';
		        r.parentNode.insertBefore(e,r)}(window,document,'script','ga'));
		        ga('create','UA-46740382-2');ga('send','pageview');
			}
		},

		__processURL : function(url) {
			if(_this.__isValidURL(url)) {
				_this.__deactivateInvalidState();
				_this.__submitURL(url);
			} else {
				_this.__activateInvalidState();
			}
		},

		__isValidURL : function(url) {
			return /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(url);
		},

		__activateInvalidState : function() {
			$('.form-group').addClass('has-error');
			$('.error-label').show();

			$('#input-url').removeClass('pulse animated');
			// Since instantly switching classes doesn't trigger animation
			setTimeout(function() {
				$('#input-url').addClass('pulse animated');
			}, 100);
		},
		
		__deactivateInvalidState : function() {
			$('.form-group').removeClass('has-error');
			$('.error-label').hide();
		},

		__submitURL : function(url) {
			// Call Meteor backend function
			Meteor.call("URL__get_short_url_for_input", url, function(error, shortURL) {
				_this.__processResult(url, window.location.origin + '/' + shortURL);
				_this.__activateResultsState();
        	});
		},

		__processResult : function(url, shortenedUrl) {
			// Restrict max length of original url
			if(url.length > 43) {
				url = url.substring(0, 40) + '...';
			}
			var url = '<a href="' + url + '" target="_blank">' + url + '</a>';
			var shortenedUrl = '<a href="' + shortenedUrl + '" target="_blank">' + shortenedUrl + '</a>';
			var resultHTML = '<tr><td>' + url + '</td><td class="url-shortened">' + shortenedUrl + '</td><tr>';
			$('.row.results .table tbody').prepend(resultHTML);
		},
		
		__activateResultsState : function() {
			$('hr').show();
			$('.row.results').show();
			$('.row.results').addClass('fadeIn animated');
		}
	};
	return Shortly;
})();

$(function() {
	setTimeout(function() {
		window.shortly = new Shortly();
	}, 500);
});
