// Route / to index.html template
Router.map(function(){
	this.route('index', {
	  path: '/'
	});
	this.route('notFound', {
	  path: '/notFound'
	});
	this.route('redirect', {
	  path: '/:shortUrl',
	  where: 'server',
	  action: function() {
		  var url = new Meteor.Libraries.URL();
		  var shortURL = url.getOriginalURLForInput(this.params.shortUrl);
		  if(shortURL != null) {
			  this.response.writeHead(301, { Location : shortURL });
			  this.response.end();
		  } else {
			  this.response.writeHead(301, { Location : '/notFound' });
		  }
	  }
	}); 
});