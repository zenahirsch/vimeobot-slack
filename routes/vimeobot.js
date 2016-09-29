var express = require('express');
var Vimeo = require('vimeo').Vimeo;
var router = express.Router();

var lib = new Vimeo(process.env.CLIENT_ID, process.env.CLIENT_SECRET, process.env.ACCESS_TOKEN);

var makeRequest = function (res, path, page, per_page, fields, callback) {
	lib.request({
		path: path,
		query: {
			page: page,
			per_page: per_page,
			fields: fields
		}
	}, (error, body, status_code, headers) => {
		if (error) {
			res.status(500).json({
				'text': `There was an error ${error}`
			});
		} else {
			callback(body);
		}
	})
};

/* GET vimeobot index. */
router.get('/', function(req, res, next) {
 	res.render('index', { title: 'Express' });
});

router.post('/', (req, res, next) => {
	console.log(req.body);
	res.status(200).json({
 		'response_type': 'in_channel',
  		'text': req.body
  	});
/*
	makeRequest(res, '/channels/927', 1, null, 'metadata.connections.videos.total', (body) => {
		var rand_page = Math.floor(Math.random() * body.metadata.connections.videos.total) + 1;
		makeRequest(res, '/channels/927/videos', rand_page, 1, 'link', (body) => {
			res.status(200).json({
		 		'response_type': 'in_channel',
		  		'text': body.data[0].link
		  	});
		});
	});
*/
});

module.exports = router;
