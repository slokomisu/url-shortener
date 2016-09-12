var express = require('express');
var validUrl = require('valid-url');
var simpledb = require('mongoose-simpledb');
var options = {
    connectionString: process.env.MONGOLAB_URL,
    autoIncrementNumberIds: true
}

var app = express();



app.use(express.static('public'));


simpledb.init(options, function (err, db) {

    app.get('/new/*', function (req, res) {
        var paramUrl = req.params[0];

        if (validUrl.isWebUri(paramUrl)) {
            var url = new db.Url({url : paramUrl});
            url.save(function (err) {
                if (err) {
                    console.log(err)
                } else {
                    res.json(
                        {
                            'original-url': url,
                            'short-url': 'https://' + req.hostname + '/' + url.id
                        }
                    )
                }
            })
        } else {
            res.json(
                {
                    'error' : 'Invalid URL. Check for typos.'
                }
            )
        }
    })

    app.get('/:id', function (req, res) {
        db.Url.findOne( {_id : req.params.id } , function (err, url) {
            if (err) {
                res.send("Could not find link. Are you sure you typed in the correct ID?")
            } else {
                res.redirect(url.url);
            }
        })
    })



})


app.listen(process.env.PORT || 3000);
