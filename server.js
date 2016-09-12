var express = require('express');
var validUrl = require('valid-url');
var simpledb = require('mongoose-simpledb');
var options = {
    connectionString: process.env.MONGOLAB_URI,
    autoIncrementNumberIds: true
}

var app = express();






simpledb.init(options, function (err, db) {

    app.get('/new/*', function (req, res) {
        var paramUrl = req.params[0];

        if (validUrl.isWebUri(paramUrl)) {
            var url = new db.Url({url : paramUrl});
            url.save(function (err) {
                if (err) {
                    console.log(err)
                } else {
                    res.send("URL SHORTEN SUCCESSFUL.\nOld Link: " + paramUrl 
                    + "\nNew Link: http://localhost:8080/" + url.id );
                }
            })
        }
    })

    app.get('/:id', function (req, res) {
        db.Url.findOne( {_id : req.params.id } , function (err, url) {
            if (err) {
                res.send(err)
            } else {
                res.redirect(url.url);
            }
        })
    })



})


app.listen(process.env.PORT);
