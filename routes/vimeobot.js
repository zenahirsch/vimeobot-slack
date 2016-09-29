var express = require('express');
var Vimeo = require('vimeo').Vimeo;
var router = express.Router();

var lib = new Vimeo(process.env.CLIENT_ID, process.env.CLIENT_SECRET, process.env.ACCESS_TOKEN);

/* GET vimeobot index. */
router.get('/', function(req, res, next) {
 	res.render('index', { title: 'Express' });
});

router.post('/', (req, res, next) => {
	var makeRequest = function (path, page, fields, callback) {
		lib.request({
			path: path,
			query: {
				page: page,
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

	makeRequest('/channels/927', 1, 'metadata.connections.videos.total', (body) => {
		makeRequest('/channels/927/videos', body.metadata.connections.videos.total, 'link', (body) => {
			res.status(200).json({
		 		'response_type': 'in_channel',
		  		'text': body.data[0].link
		  	});
		});
	});
/*
	lib.request({
		path: `/${type}/${id}`,
		query: {
			page: 1,
			fields: 'metadata.connections.videos.total'
		}
	}, (error, body, status_code, headers) => {
		if (error) {
			res.status(500).json({
				'text': `There was an error ${error}`
			});
		} else {
			lib.request({
				path: `/${type}/${id}/videos`,
				query: {
					page: Math.floor(Math.random() * body.metadata.connections.videos.total) + 1,
					per_page: 1,
					fields: 'name,description,link'
				}
			}, (error, body, status_code, headers) => {
				if (error) {
					res.status(500).json({
						"text": `There was an error ${error}`
					});
				} else {
					res.status(200).json({
				 		'response_type': 'in_channel',
				  		'text': body.data[0].link
				  	});
				}
			});
		}
	});
*/
});

module.exports = router;
