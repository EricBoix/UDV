var test = require('tape'); // assign the tape library to the variable "test"
var request = require('request')

// FIXME This is copy of Example/Demo.js variable. Read
// https://stackoverflow.com/questions/950087/how-do-i-include-a-javascript-file-in-another-javascript-file
// again an try to "import" that configuration from the file instead of
// copying it here...
const buildingServerRequest = 'http://rict.liris.cnrs.fr:9091/getCity?city=citydb_temporal';

test('Testing http connectivity to Building Server', function (t) {
  request.get(
    buildingServerRequest,
    {timeout: 1500},
    function (err, result) {
        t.comment('Tested server: ' + buildingServerRequest);
        if (err) {
            if (err.code === 'ENOTFOUND') {
            t.error('Server not found: check your network cable?');
            t.end();
            return;
          }
          if (err.code === 'ETIMEDOUT') {
              if( err.connect === true ) {
                  t.error('Connection error: firewall problem?');
              } else {
                  t.error('Read timeout error: server too busy?');
              }
            t.end();
            return;
          }
        }
        t.false(err, 'Connection established and request answer provided.');
        // Inspect the request (since no connection error)
        const body = JSON.parse(result.body);
        t.ok(body, 'Result has a body.');
        const rootElement = body['root'];
        t.ok(rootElement, 'Body has a root element.');
        const rootVolumeBoundingBox = rootElement['boundingVolume']['box'];
        t.ok(
          rootVolumeBoundingBox,
          'Root bounding volume: ' + rootVolumeBoundingBox);
        t.end();
    })
});
