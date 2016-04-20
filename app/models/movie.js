var mongoose = require('mongoose');
var MovieSchema = require('../schemas/movie.js');
// 
var Movie = mongoose.model('Movie',MovieSchema)
// 输出网页模型
module.exports = Movie;