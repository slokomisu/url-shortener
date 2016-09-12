var ObjectId = require('mongoose-simpledb').Types.ObjectId;

exports.schema = {
    _id : Number,
    url : String,
}

exports.virtuals = {
    id : {
        get : function () {
            return this._id;
        }
    }
}