var express = require('express');
var Vimeo = require('vimeo').Vimeo;
var router = express.Router();

var lib = new Vimeo(process.env.CLIENT_ID, process.env.CLIENT_SECRET, process.env.ACCESS_TOKEN);

/* GET vimeobot index. */
router.get('/', function(req, res, next) {
 	res.render('index', { title: 'Express' });
});

router.post('/', (req, res, next) => {
	var video = null;
	var num_pages = 0;	

	lib.request({
		path: '/videos',
		query: {
			page: 1,
			query: 'cool',
			fields: 'uri'
		}
	}, (error, body, status_code, headers) => {
		if (error) {
			res.status(500).json({
				'text': `There was an error ${error}`
			});
		} else {
			num_pages = body.total;

			lib.request({
				path: '/videos',
				query: {
					page: Math.floor(Math.random() * num_pages) + 1,
					per_page: 1,
					query: 'cool'
					fields: 'name,description,link'
				}
			}, (error, body, status_code, headers) => {
				if (error) {
					res.status(500).json({
						"text": `There was an error ${error}`
					});
				} else {
					//video = body.data[(Math.random() * 50) + 1];
					video = body.data[0];

					res.status(200).json({
				 		'response_type': 'in_channel',
				  		'text': video.link
				  	});
				}
			});
		}
	});
});

module.exports = router;
