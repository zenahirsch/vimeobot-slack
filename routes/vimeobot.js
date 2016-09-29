var express = require('express');
var Vimeo = require('vimeo').Vimeo;
var router = express.Router();

var lib = new Vimeo(process.env.CLIENT_ID, process.env.CLIENT_SECRET, process.env.ACCESS_TOKEN);

/* GET vimeobot index. */
router.get('/', function(req, res, next) {
 	res.render('index', { title: 'Express' });
});

router.post('/', (req, res, next) => {
	let video = null;

	lib.request({
		path: '/channels/staffpicks/videos',
		query: {
			per_page: 50
		}
	}, (error, body, status_code, headers) => {
		if (error) {
			res.status(500).json({
				"text": `There was an error ${error}`
			});
		} else {
			video = body.data[1]; // will be randomized
			res.status(200).json({
		 		"response_type": "in_channel",
		  		"text": video.link
		  	});
		}
	});
});

module.exports = router;
