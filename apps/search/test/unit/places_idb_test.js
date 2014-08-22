/* globals MocksHelper */
/* globals asyncStorage */
/* globals PlacesIdbStore */

'use strict';

require('/shared/test/unit/mocks/mock_async_storage.js');

requireApp('search/js/places_idb.js');

var mocksHelper = new MocksHelper([
  'asyncStorage'
]).init();

suite('search/places_idb', function() {

  var subject;

  var mozilla = 'http://mozilla.org';
  var google = 'http://google.com';
  var yahoo = 'http://yahoo.com';

  function place(url, frecency, visited) {
    frecency = frecency || 1;
    visited = visited || 0;
    return {url: url, frecency: frecency, visited: visited};
  }

  mocksHelper.attachTestHelpers();

  suiteSetup(function(done) {

    asyncStorage.getItem = function(key, callback) {
      callback(null);
    };

    subject = new PlacesIdbStore();

    subject.init().then(function() {
      subject.clear().then(function() {
        done();
      });
    });
  });

  suiteTeardown(function() { });

  test('Test frecency', function(done) {
    Promise.all([
      subject.add('url', place(mozilla, 1, 0)),
      subject.add('url', place(google, 3, 1)),
      subject.add('url', place(yahoo, 2, 2)),
      subject.add('url', place(mozilla, 4, 3))
    ]).then(function() {
      subject.read('frecency', 5, function(results) {
        assert.equal(results.length, 3);
        assert.equal(results[0].url, mozilla);
        assert.equal(results[1].url, google);
        assert.equal(results[2].url, yahoo);
        done();
      });
    });
  });

  test('Test history', function(done) {
    Promise.all([
      subject.add('url', place(mozilla, 1, 0)),
      subject.add('url', place(google, 3, 1)),
      subject.add('url', place(yahoo, 2, 2)),
      subject.add('url', place(mozilla, 4, 3))
    ]).then(function() {
      subject.read('visited', 5, function(results) {
        assert.equal(results.length, 3);
        assert.equal(results[0].url, mozilla);
        assert.equal(results[1].url, yahoo);
        assert.equal(results[2].url, google);
        done();
      });
    });
  });

  test('Test filter', function(done) {
    Promise.all([
      subject.add('url', place(mozilla, 1, 0)),
      subject.add('url', place(google, 3, 1)),
      subject.add('url', place(yahoo, 2, 2)),
      subject.add('url', place(mozilla, 4, 3))
    ]).then(function() {
      subject.read('visited', 5, function(results) {
        console.log(JSON.stringify(results));
        assert.equal(results.length, 1);
        assert.equal(results[0].url, mozilla);
        done();
      }, function(place) {
        return place.url === mozilla;
      });
    });
  });

});
