var express = require('express');
var Vimeo = require('vimeo').Vimeo;
var router = express.Router();

var lib = new Vimeo(process.env.CLIENT_ID, process.env.CLIENT_SECRET, process.env.ACCESS_TOKEN);

var makeRequest = function (res, path, page, per_page, fields, query, callback) {
	lib.request({
		path: path,
		query: {
			page: page,
			per_page: per_page,
			fields: fields,
			query: query
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
	var paths = {
		'staffpick': '/channels/927',
		'staffpicks': '/channels/927',
		'comedy': '/categories/comedy',
		'funny': '/categories/comedy',
		'weird': '/categories/experimental',
		'experimental': '/categories/experimental',
		'animation': '/categories/animation',
		'documentary': '/categories/documentary',
		'food': '/categories/food'
	};

	var path = null;
	var query = null;

	if (paths[req.body.text]) {
		path = paths[req.body.text];
	} else {
		path = '/videos';
		query = req.body.text;
	}

	makeRequest(res, path, 1, null, 'metadata.connections.videos.total', query, (body) => {
		var rand_page = Math.floor(Math.random() * body.metadata.connections.videos.total) + 1;
		makeRequest(res, `${path}/videos`, rand_page, 1, 'link', query, (body) => {
			res.status(200).json({
		 		'response_type': 'in_channel',
		  		'text': `Hey ${req.body.user_name}, here's your video! ${body.data[0].link}`
		  	});
		});
	});
});

module.exports = router;
