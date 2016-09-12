var express = require('express');
var validUrl = require('valid-url');
var simpledb = require('mongoose-simpledb');
var options = {
    connectionString: process.env.MONGOLAB_URI,
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
                    res.send(err)
                } else {
                    res.json(
                        {
                            'original-url': paramUrl,
                            'short-url': 'https://' + req.hostname + '/' + url.id
                        }
                    )
                }
            })
        } else {
            res.json(
                {
                    'error' : 'Invalid URL. Must be in form of http://www.example.com'
                }
            )
        }
    })

    /**
     * Let it be known that it took me ALL FUCKING DAY to figure out
     * that the GET /favicon.ico requests were fucking everything up. */    
    app.get('/favicon.ico', (req, res) => {
        res.sendStatus(200);
    })

    app.get('/:id', (req, res) => {
        console.log(req.params);
        db.Url.findOne({_id: req.params.id} ,function (err, url) {
            if (err) {
                res.send("Could not find link. Are you sure you typed in the correct ID? " + req.params.id)
            } else {
                res.redirect(url.url);
            }
        })
    })



})


app.listen(process.env.PORT || 3000);
