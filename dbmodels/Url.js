var ObjectId = require('mongoose-simpledb').Types.ObjectId;

exports.schema = {
    _id : Number,
    urlLong : String,
}

exports.virtuals = {
    id : {
        get : function () {
            return this._id;
        }
    },

    url : {
        get : function () {
            return this.url;
        }
    }
}