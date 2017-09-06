var config = require('../testConfig.js');
const FormData = require('form-data');
const fs = require('fs');
const got = require('got');
const { MulticolorEngine }= require('../../../tineye-services');
var mocha = require('mocha');

var multicolorengine = new MulticolorEngine(
	config.MulticolorEngine.user, 
	config.MulticolorEngine.pass, 
	'', 
	config.MulticolorEngine.url
	);

describe('MulticolorEngine Count:', function() {

	//Set timeout to 5s
	this.timeout(10000);

	//post an image to the collection manually
	before(function(done) {
	
		var form = new FormData();
					
		form.append('image', fs.createReadStream(__dirname + '/../image.jpg'));
		form.append('filepath', "multicolorEngineCountTest.jpg");

	   	got.post(config.MulticolorEngine.url + 'add', {
	      auth:config.MulticolorEngine.user + ':' + config.MulticolorEngine.pass,
	      body: form
		})
		.then(response => {
			done(); 
		})
		.catch(error => {
			done(error);
		});

	});

	//make call to delete image after each add
	after(function(done){
				
	    got.delete(config.MulticolorEngine.url + 'delete', {
	      auth:config.MulticolorEngine.user + ':' + config.MulticolorEngine.pass,
	      json: true,
	      query: {filepath:'multicolorEngineCountTest.jpg'}
	    }).then((response) => {

   			if(response.body.status !== 'ok'){
				done(new Error('After hook failed to delete added image')); 
   			}
   			else{
				done(); 
   			}

	    }).catch((err) => {
			done();
	    });

	});


	describe('Get a count of total images', function() {
		it('Should return a call with status "ok" and a result > 0', function(done) {
			multicolorengine.count(function(err, data) {
				
				if(err){
					done(err);
				}
				else if(data.result[0]>0){
					done();
				}
				else{
					done(new Error("Response does not contain image.jpg"));
				}

			});

		});

	});

});
