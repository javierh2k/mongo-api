const mongoose = require ('mongoose');
const { Schema } = mongoose;

mongoose.Promise = global.Promise;

const hatSchema = new Schema({
  _id: String,
  name: String,
  price:Number,
  material:String
});

module.exports =  mongoose.model('Hat', hatSchema);
