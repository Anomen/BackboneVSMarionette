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

var VInfo = Marionette.ItemView.extend({
	// We declare the template to be used by the view
	template: '#infoTpl',

	// We bind the model event to re-render
	modelEvents: {
        "change": "render"
	}
});

var VJobRow = Marionette.ItemView.extend({
	template: '#jobRow',
	tagName: 'li'
});

var VJobsList = Marionette.CompositeView.extend({
	template: '#jobsList',
	itemViewContainer: 'ol',
	itemView: VJobRow
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