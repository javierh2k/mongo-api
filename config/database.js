const mongoose = require('mongoose')
const { databaseUri } = require('./env')

if(!databaseUri){
  console.log("require .env database string");
  process.exit();
}

mongoose.Promise = global.Promise
mongoose.connection
  .once('open', _ => console.log('Connected to database with success.'))
  .on('error', _ => console.log('Error connecting to database', _))

module.exports = () => mongoose.connect(databaseUri, { useNewUrlParser: true})
