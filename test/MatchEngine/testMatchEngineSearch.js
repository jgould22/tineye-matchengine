const config = require("../testConfig.js");
const FormData = require("form-data");
const fs = require("fs");
const axios = require("axios");
const { MatchEngine } = require("../../../tineye-services");

const matchengine = new MatchEngine(
  config.MatchEngine.user,
  config.MatchEngine.pass,
  "",
  config.MatchEngine.url
);

describe("MatchEngine Search:", function() {
  // Set timeout to 5s
  this.timeout(5000);

  var birdFilePath = __dirname + "/../image2.jpg";
  var melonCatFilePath = __dirname + "/../image3.jpg";

  // Post an image to the collection manually
  before(function(done) {
    var form = new FormData();

    form.append("image", fs.createReadStream(birdFilePath));
    form.append("filepath", "matchEngineSearchTest1.jpg");

    axios
      .post(config.MatchEngine.url + "add", form, {
        auth: {
          username: config.MatchEngine.user,
          password: config.MatchEngine.pass
        },
        headers: form.getHeaders()
      })
      .then(response => {
        if (response.data.status === "ok") {
          done();
        } else {
          done(new Error("Before hook failed to add image: " + response.data));
        }
      })
      .catch(error => {
        done(error);
      });
  });

  // Make call to delete images after tests
  after(function(done) {
    axios
      .delete(config.MatchEngine.url + "delete", {
        auth: {
          username: config.MatchEngine.user,
          password: config.MatchEngine.pass
        },
        params: { filepath: "matchEngineSearchTest1.jpg" }
      })
      .then(response => {
        if (response.data.status === "ok") {
          done();
        } else {
          done(new Error("After hook failed to delete added image"));
        }
      })
      .catch(err => {
        done();
      });
  });

  describe("Search Image by filepath", function() {
    it('Should return a call with status "ok" and a result', function(done) {
      matchengine.search({ filepath: "matchEngineSearchTest1.jpg" }, function(
        err,
        data
      ) {
        if (err) {
          done(new Error(err));
        } else if (data.result.length > 0) {
          done();
        } else {
          done(new Error("No Result was returned"));
        }
      });
    });
  });

  describe("Search Image by file", function() {
    it('Should return a call with status "ok" and a result', function(done) {
      matchengine.search({ image: birdFilePath }, function(err, data) {
        if (err) {
          done(err);
        } else if (data.result.length > 0) {
          done();
        } else {
          done(new Error("No Result was returned"));
        }
      });
    });
  });

  describe("Search for image that is not in collection by File", function() {
    it('Should return a call with status "ok" and no result', function(done) {
      matchengine.search({ image: melonCatFilePath }, function(err, data) {
        if (err) {
          done(new Error(err));
        } else if (data.result.length == 0) {
          done();
        } else {
          done(new Error("A non error status was returned"));
        }
      });
    });
  });
});
