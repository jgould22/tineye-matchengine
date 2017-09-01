const config = require('../testConfig.js');
const FormData = require('form-data');
const fs = require('fs');
const got = require('got');
const { MulticolorEngine }= require('../../../tineye-services');
const mocha = require('mocha');
const libxmljs = require('libxmljs');

var multicolorengine = new MulticolorEngine('', '', '', config.MulticolorEngine);

describe('MulticolorEngine ExtractCollectionColors:', function() {

	//Set timeout to 5s
	this.timeout(10000);

   	var colorsPath = __dirname + '/../colors.png';
	var bluePath = __dirname + '/../blue.png';
	var purplePath = __dirname + '/../purple.png';
	var greensPath = __dirname + '/../greens.png';
	var url = 'http://tineye.com/images/meloncat.jpg';
	var url2 = 'https://services.tineye.com/developers/matchengine/_images/364069_a1.jpg';
	   
	var form = new FormData();
	form.append('image', fs.createReadStream(greensPath));
	form.append('filepath', 'multicolorEngineExtractCollectionGreens.jpg');

	var form2 = new FormData();
	form2.append('image', fs.createReadStream(purplePath));
	form2.append('filepath', 'multicolorEngineExtractCollectionPurple.jpg');

	var form3 = new FormData();
	form3.append('image', fs.createReadStream(bluePath));
	form3.append('filepath', 'multicolorEngineExtractCollectionBlue.jpg');

	var form4 = new FormData();
	form4.append('image', fs.createReadStream(colorsPath));
	form4.append('filepath', 'multicolorEngineExtractCollectionColors.jpg');

	//post an image to the collection manually
	before(function(done) {
	
	   	var postColor1 = got.post(config.MulticolorEngine + 'add', {
		    body: form
		});

	   	var postColor2 = got.post(config.MulticolorEngine + 'add', {
		    body: form2
		});

		var postColor3 = got.post(config.MulticolorEngine + 'add', {
		    body: form3
		});

		var postColors = got.post(config.MulticolorEngine + 'add', {
		    body: form4
		});

		postColor1.then(function(response){
			return postColor2;
		})
		.then(function(response){
			return postColor3;
		})
		.then(function(response){
			return postColors;
		})
		.then(function(response){
			done();
		})
		.catch(function(error){
			done(error);
		});


	});

	//make call to delete images after tests
	after(function(done){
				
	    var deleteColor1 = got.delete(config.MulticolorEngine+'delete', {
	      json: true,
	      query: {filepath:'multicolorEngineExtractCollectionGreens.jpg'}
		});

		var deleteColor2 = got.delete(config.MulticolorEngine+'delete', {
			json: true,
			query: {filepath:'multicolorEngineExtractCollectionPurple.jpg'}
		});
		
		var deleteColor3 = got.delete(config.MulticolorEngine+'delete', {
			json: true,
			query: {filepath:'multicolorEngineExtractCollectionBlue.jpg'}
		});

		var deleteColors = got.delete(config.MulticolorEngine+'delete', {
			json: true,
			query: {filepath:'multicolorEngineExtractCollectionColors.jpg'}
		});

		deleteColor1.then(function(response){
			return deleteColor2;
		})
		.then(function(response){
			return deleteColor3;
		})
		.then(function(response){
			return deleteColors;
		})
		.then(function(response){
			done();
		})
		.catch(function(error){
			done(new Error('After hook failed to delete added images'));
		});

	});

	describe('Extract collection colors by image file', function() {
		
		it('Should return a call with status "ok" and 13 colors', function(done) {

			multicolorengine.extractCollectionColors({},function(err, data) {
	    		if(err)
	    			done(new Error(JSON.stringify(err,null, 4)));
				else if (data.result.length === 13){
	    			done();
				}else
	    			done(new Error('Result returned:' + JSON.stringify(data,null, 4)));

			});

		});

	});

	describe('Extract collection colors by color and weight', function() {
		
		it('Should return a call with status "ok" and 9 results', function(done) {

			params = {
				colors:['#1abc9c'],
				weights:[100]
			};

			multicolorengine.extractCollectionColors(params, function(err, data) {
	    		if(err)
	    			done(new Error(JSON.stringify(err,null, 4)));
				else if (data.result.length === 9){
	    			done();
				}else
	    			done(new Error('Result returned:' + JSON.stringify(data,null, 4)));

			});

		});

	});

});
