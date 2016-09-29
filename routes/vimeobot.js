var express = require('express');
var Vimeo = require('vimeo').Vimeo;
var router = express.Router();

var lib = new Vimeo(process.env.CLIENT_ID, process.env.CLIENT_SECRET, process.env.ACCESS_TOKEN);

var makeRequest = function (res, path, page, fields, query, callback) {
	var query = {
		page: page,
		per_page: 1,
		fields: fields,
	};

	if (query) {
		query.query = query;
	}

	lib.request({
		path: path,
		query: query
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
		'staffpick': '/channels/927/videos',
		'staffpicks': '/channels/927/videos',
		'comedy': '/categories/comedy/videos',
		'funny': '/categories/comedy/videos',
		'weird': '/categories/experimental/videos',
		'experimental': '/categories/experimental/videos',
		'animation': '/categories/animation/videos',
		'documentary': '/categories/documentary/videos',
		'food': '/categories/food/videos'
	};

	var path = null;
	var query = null;

	if (paths[req.body.text]) {
		path = paths[req.body.text];
	} else {
		path = '/videos';
		query = req.body.text;
	}

	makeRequest(res, path, 1, 'uri', query, (body) => {
		console.log('first request body', body);
		var rand_page = Math.floor(Math.random() * body.total) + 1;
		console.log('RANDOM PAGE: ', rand_page);
		makeRequest(res, path, rand_page, 'link', query, (body) => {
			console.log('the body:', body);
			res.status(200).json({
		 		'response_type': 'in_channel',
		  		'text': `Hey ${req.body.user_name}, here's your video! ${body.data[0].link}`
		  	});
		});
	});
});

module.exports = router;
