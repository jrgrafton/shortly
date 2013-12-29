// Route / to index.html template
Router.map(function(){
	this.route('index', {
	  path: '/'
	});
	this.route('notFound', {
	  path: '*'
	});
});