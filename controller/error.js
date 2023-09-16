const createError = require("http-errors");

exports.not_found = function(req, res, next) {
    res.render('error/404')
}
