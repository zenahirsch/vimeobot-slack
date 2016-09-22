var express = require('express');
var router = express.Router();

/* GET vimeobot index. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/', function(req, res, next) {
  res.status(200).json({
  	"response_type": "in_channel",
  	"text": "hello! https://vimeo.com/183752285"
  });
});

module.exports = router;
