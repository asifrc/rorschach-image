var router = require('express').Router();
var fs = require('fs');
var gm = require('gm').subClass({'imageMagic': true});

var orientations = [0,90,180,270];

var showInkblot = function(req, res, id, orientation) {
  id = id || 1;
  orientation = orientation || 0;
  var rotation = orientations[ orientation % orientations.length ]
  var blotId = ("00" + id).slice(-2);
  var fileName = "inkblots/Rorschach_blot_" + blotId + ".jpg";
  console.log(fileName);
  gm(fileName).options({
    imageMagick: true
  }).rotate("white", rotation).toBuffer(function(err, buffer) {
    if (err) {
      console.warn(err);
      var status =  (err.code == "ENOENT") ? 404 : 500;
      res.locals.message = "Not Found";
      res.locals.error = {};
      res.status(status);
      res.render('error');
      return;
    }
    else {
      res.setHeader('Cache-Control', 'public, max-age=31557600');
      res.writeHead(200, {'Content-Type': "image/jpeg"});
      res.end(buffer);
    }
  });
};

var randomImage = function() {
  var imageCount = 10;
  return  {
    'id': Math.ceil(Math.random() * imageCount),
    'orientation': Math.floor(Math.random() * orientations.length)
  };
}

router.get('/', function(req, res, next) {
  var image = randomImage();
  var data = {
    "url": "/inkblots/blot/" + image.id + "/" + image.orientation
  };
  res.json(data);
});

router.get('/blot/:id/:orientation', function(req, res) {
  showInkblot(req, res, req.params.id, req.params.orientation);
});

module.exports = router;
