var express = require('express');
var Vimeo = require('vimeo').Vimeo;
var router = express.Router();
var request = require('request');

var lib = new Vimeo(process.env.CLIENT_ID, process.env.CLIENT_SECRET, process.env.ACCESS_TOKEN);

var makeRequest = function (res, path, page, fields, query, callback) {
	var req_query = {
		page: page,
		per_page: 1,
		fields: fields,
	};

	if (query) {
		req_query.query = query;
	}

	lib.request({
		path: path,
		query: req_query
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

var sendDelayedResponse = function (response_url, response) {
	request.post(response_url, {
		json: response
	}, (error, res, body) => {
		if (error) {
			res.status(500).json({
				'text': `There was an error ${error}`
			});
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

	if (!req.body.text) {
		path = '/channels/927/videos';
	} else if (paths[req.body.text]) {
		path = paths[req.body.text];
	} else {
		path = '/videos';
		query = req.body.text;
	}

	makeRequest(res, path, 1, 'uri', query, (body) => {
		var rand_page = Math.floor(Math.random() * body.total) + 1;
		makeRequest(res, path, rand_page, 'link', query, (body) => {
			/*res.status(200).json({
		 		'response_type': 'in_channel',
		  		'text': `Hey ${req.body.user_name}, here's your video! ${body.data[0].link}`
		  	});*/
		  	sendDelayedResponse(req.body.response_url, {
		  		'response_type': 'in_channel',
		  		'text': `Hey ${req.body.user_name}, here's your video! ${body.data[0].link}`
		  	});
		});
	});
});

module.exports = router;
