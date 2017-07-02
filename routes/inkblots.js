var router = require('express').Router();
var fs = require('fs')


var showInkblot = function(req, res, id) {
  id = id || 1;
  var blotId = ("00" + id).slice(-2);
  var fileName = "inkblots/Rorschach_blot_" + blotId + ".jpg";
  fs.readFile(fileName, function(err, data) {
    if (err) {
      console.warn(err);
      var status =  (err.code == "ENOENT") ? 404 : 500;
      res.locals.message = "Not Found";
      res.locals.error = {};
      res.status(status);
      res.render('error');
      return;
    }
    res.writeHead(200, {'Content-Type': "image/jpeg"});
    res.end(data);
  });
};

var randomImageId = function() {
  var imageCount = 10;
  var id = Math.ceil(Math.random() * imageCount);
  return id;
}

router.get('/', function(req, res, next) {
  var id = randomImageId();
  var data = {
    "url": "/inkblots/blot/" + id
  };
  res.json(data);
});

router.get('/blot/:id', function(req, res) {
  showInkblot(req, res, req.params.id);
});

module.exports = router;
