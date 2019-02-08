const mongoose = require ('mongoose');
const { Schema } = mongoose;
const Hat = require('./hat');

mongoose.Promise = global.Promise;

const userSchema = new Schema({
  _id: String,
  email: String,
  hats: [{ type: Schema.Types.ObjectId, ref: 'Hat' }],
  recommendedHats : [{ type: Schema.Types.ObjectId, ref: 'Hat' }]
});

module.exports =  mongoose.model('User', userSchema);
