(function(Backbone, _, $){



var MPerson = Backbone.Model.extend({
	defaults: {
		'firstname'  : null,
		'lastname'   : null,
		'email'      : null,
		'description': null
	}
});

var MJob = Backbone.Model.extend({
	defaults: {
		'startdate'  : null,
		'enddate'    : null,
		'company'    : null,
		'position'   : null,
		'description': null
	}
});

var CJobs = Backbone.Collection.extend({
	model: MJob
});

var VInfo = Backbone.View.extend({
	// We declare the template to be used by the view
	template: _.template($('#infoTpl').html()),
	
	// We will have a reference to the model stored in the view
	model: null,

	initialize: function(options){
		// We pass the model tp the constructor
		this.model = options.model;
		
		// We re-render the view if the model changes somehow
		this.listenTo(this.model, 'change', this.render);
	},
	destroy: function(){
		delete this.model; // Of course, we release the reference of the model
	},
	render: function(){
		// We call the template with data from the model
		this.$el.html(this.template(this.model.toJSON()));

		// Convention
		return this;
	}
});

var VJobRow = Backbone.View.extend({
	template: _.template($('#jobRow').html()),
	tagName: 'li',
	model: null,
	initialize: function(options){
		this.model = options.model;
		this.listenTo(this.model, 'change' , this.render);
		this.listenTo(this.model, 'destroy', this.remove);
	},
	destroy: function(){
		delete this.model;
	},
	render: function(){
		this.$el.html(this.template(this.model.toJSON()));
		return this;
	}
});

var VJobsList = Backbone.View.extend({
	template: _.template($('#jobsList').html()),
	collection: null,
	initialize: function(options){
		// We pass the collection to the constructor
		this.collection = options.collection;
		
		this.listenTo(this.collection, 'add'  , this.addOne);
		this.listenTo(this.collection, 'reset', this.addAll);
	},
	destroy: function(){
		delete this.collection; // Of course, we release the reference of the collection
	},
	addOne: function(model){
		var vJobRow = new VJobRow({ model: model });
		this.$('ol').append(vJobRow.render().$el);
	},
	addAll: function(){
		this.collection.each(this.addOne, this);
	},
	render: function(){
		this.$el.html(this.template());
		this.addAll();
		return this;
	}
});

// First: we instanciate a new Person
var mPerson = new MPerson();
var cJobs   = new CJobs  ();

// Then, we instanciate a new view with the model
var vInfo     = new VInfo    ({ model: mPerson    });
var vJobsList = new VJobsList({ collection: cJobs });

// Finally, we grab information from the server
mPerson.fetch({ url: 'person-fixture.json' });
cJobs  .fetch({ url: 'jobs-fixture.json'   });

// We display to the proper place
$("#info").html(vInfo.render().$el);
$("#jobs").html(vJobsList.render().$el);



})(Backbone, _, $);